const path = require('path');

// ファイルをまたぐsectionカウンタ用
let chapter = 0;
// 原稿のディレクトリ
let entryContext = ""; //"manuscripts/001php/";
// ソースファイル読み込みのベースディレクトリ
let src_basedir = "src/fin/";
// ソース埋め込みの折り返し文字数
let src_maxlen = 55;
// 傍注の左右逆転フラグ
let sn_reverse = false;

function insertCR(line){
    let buf = "";
    for(let i = 0,c = 0;i < line.length;i++,c++){
        const code = line.codePointAt(i);
        if( ! ((0x20 <= code && code <= 0x7d) || code == 0x5c || code == 0xa5) ) {c++;} // 全角なら1文字分増やす 半角カナ未対応
        if(c > src_maxlen-1) {
            buf += "⏎";
            c = 0;
        }
        buf += line[i];
    }
    return buf;
}

exports.init = vars => {
    if(vars.entryContext) { entryContext = vars.entryContext; }
    if(vars.sn_reverse) { sn_reverse = vars.sn_reverse; }
};

exports.replaces = [
    { // 空段落
        test: /^@$/,
        match: ([,], h) => {
            return h("p",{class:"empty-paragraph"}); // 暫定処理 クラスを割り当てて高さを指定する
        }
    },
    { // PlantUMLの埋め込み
        test: /^\[plantuml:([^\]]*),([^)<]*)\]/,
        match: ([, fn, caption], h) => {
            const fs = require("fs");
            const encoder = require("plantuml-encoder");
            const buf = fs.readFileSync(path.join(entryContext,fn), "utf8");
            const encoded = encoder.encode(buf);

            return h("figure", {class: "plantuml"}, [
                h("figcaption", caption),
                h("img", {src: "http://www.plantuml.com/plantuml/svg/" + encoded})
            ]);
        }
    },
    { // ページ番号設定 任意のページ数から初める機能はCSSの仕様として無理なので白紙ページを必要数追加する。
        test: /^\[page:(\d+)\]/,
        match: ([, no], h) => {
            let buf = [];
            for (let i = 0; i < no - 1; i++) {
                buf.push(
                    h(
                        'div',
                        { style: 'break-after: page;/*height: 0;margin: 0;padding: 0;*/' },
                        '@DELETE@',
                    ),
                );
            }
            return h("div", {style: "height:0;margin:0;padding:0;"},buf);
        }
    },
    { // 任意の章番号を設定(この設定はファイルを跨いで有効 )
        test: /^\[chapter:(\d+)\]/,
        match: ([, no], h) => {
            chapter = no - 1;
            sn_reverse = false;
            return h("span", {style: "counter-set: section " + chapter++});
        }
    },
    { // ファイルを跨いで連続する章番号設定
        test: /^\[chapter\]/,
        match: ([, no], h) => {
            sn_reverse = false;
            return h("span", {style: "counter-set: section " + chapter++});
        }
    },
    { // 傍注逆転
        test: /\[sn:reverse\]/g,
        match: ([], h) => {
            sn_reverse = true;
            return null;
        }
    },
    { // 傍注
        test: /\[sn:([LR])([+-]\d+)?,([^\]]*?),([^\]]*)\]/,
        match: ([, lr, offset, key, text], h) => {
            if(offset) {
                offset = offset + 'em';
            }else{
                offset = '-7em';
            }
            if(sn_reverse == true) {
                if(lr === "R"){ lr = "L"; }else if(lr === "L"){ lr = "R"; }
            }
            return h("div", {class: "sidenote " + lr,style:"margin-top: " + offset}, "* " + text);
        }
    },
    { // 傍注マーカー
        test: /\[sn:([^\]<]+)\]/g,
        match: ([, key], h) => {
            return h("span", {class: "sidenote", id: key}, "*");
        }
    },
    { // 行指定でソースコードファイル埋め込み
        test: /\[src:([^\]<]*),(\d+)-(\d+)\]/g,
        match: ([, fn,begin,end], h) => {
            const fs = require("fs");
            let l = 1;
            const lines = fs.readFileSync(path.join(entryContext,src_basedir,fn), "utf8").split("\n");
            let buf = [];
            for(let i = begin-1;i < end;i++){
                buf.push(lines[i]);
            }
            return h(
                "figure",
                {class: "code"},
                [
                    h("figcaption", fn + " (一部)"),
                    h("ol",{'style':'counter-reset: item '+(begin-1)}, buf.map((l) => {
                        console.log(l);
                        return h("li", l /*insertCR(l)*/);
                    }))
                ]
            );
        }
    },
    { // ソースコードファイル埋め込み
        test: /\[src:([^\]<]*)\]/g,
        match: ([, fn], h) => {
            const fs = require("fs");
            let l = 1;
            const buf = fs.readFileSync(path.join(entryContext,src_basedir,fn), "utf8").split("\n");
            return h(
                "figure",
                {class: "code"},
                [
                    h("figcaption", fn),
                    h("div", buf.map((l) => {
//                        console.log(l);
                        return h("pre",l); // /*insertCR(l)*/);
                    }))
                ]
            );
        }
    },
    { // UML等の読み込みのベースディレクトリ変更
        test: /\[basedir:([^\]<]+)\]/g,
        match: ([, dir], h) => {
            entryContext = dir;
            return null;
        }
    },
    { // ソースコード読み込みのベースディレクトリ変更
        test: /\[src_basedir:([^\]<]+)\]/g,
        match: ([, dir], h) => {
            src_basedir = dir;
            return null;
        }
    },
    { // 強制改ページ
        test: /\[newpage\]/g,
        match: ([], h) => {
            return h("div",{style:"break-before: page;height: 0;margin: 0;padding: 0;"});
        }
    },
    { // インラインコード
        test: /\[code:([^\]<]+)\]/g,
        match: ([, str], h) => {
            str = str == "&#124;" ? "|" : str; // テーブル内に|を書けないため TODO:使えそうなパッケージを探す。
            return h("span",{"class":"character"},str);
        }
    },
    { // TODO
        test:/\[TODO:([^\]]+)\]/g,
        match: ([, str], h) => {
            return h("span",{"style":"color:red;font-weight:bold;"},str);
        }
    },
    {
        test:/\[hanging:([^\]]+)\]/g,
        match: ([, str], h) => {
            return h("span", {class: "hanging"}, str);
        }
    }
];
