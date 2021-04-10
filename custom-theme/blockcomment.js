
exports.preprocess = async (filename,contents)=>{
    return contents.replace(/\[comment\]\n((.*\n)*?)^\[\/comment\]/gmu,'');
}