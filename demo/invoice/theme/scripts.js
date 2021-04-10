const fs = require("fs");
const yaml = require('js-yaml');

let invoice;

const computes = {
    小計:(item)=>{
        const subTotal = item["単価"] * item["数量"];
        invoice["合計"] += subTotal;
        return subTotal;
    },
    SALES_TAX:(item)=>{
        return Math.floor(invoice["合計"] * 0.1);
    }
}

exports.preprocess = (path,content)=>{
    invoice = yaml.load(fs.readFileSync(path,'utf-8'));

    const template = fs.readFileSync("template.md",'utf-8');

    const newContent = template.replace(/\[(.*?):((.*?\|)+)(.*?)]/,(match,items,p2,p3,p4)=>{
        let rows = [];
        const fields = (p2+p4).split("|").map((f)=>f.trim());
        for(item of invoice[items]) {
            const row = fields.map((f)=>{
                if(!(f in item)) {
                    item[f] = computes[f](item);
                }
                if(item[f] in computes) {
                    item[f] = computes[item[f]](item);
                }
                return item[f];
            }).join("|");
            rows.push(row);
        }
        return rows.join("|\n");
    })
    return newContent;
}

exports.replaces = [
    {
        test:/\[(.*?)]/gm,
        match:([,fieldName],h)=>{
            const val = typeof invoice[fieldName] === 'string' ? invoice[fieldName]:""+invoice[fieldName];
            return h("span",val);
        }
    }
];