const plantuml = require('node-plantuml');
const replaceAsync = require("string-replace-async");

exports.preprocess = async (filename,contents)=>{
    contents = await replaceAsync(contents, /^```puml-render\n((.*\n)*?)^```/gm, async (match,group1)=>{
        return new Promise((resolve)=>{
            plantuml.generate(group1,{text:true,format:'svg'},(err,result)=>{
                // decode to utf-8 string and remove svg comments
                const svg = result.toString('utf-8').replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,'');
                // console.log(svg);
                resolve(svg);
            })
        });
    });
//    console.log(contents);
    return contents;
}