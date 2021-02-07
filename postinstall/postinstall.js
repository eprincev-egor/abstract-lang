"use strict";

const fs = require("fs");

function main() {
    console.log("postinstall.js");

    if ( !fs.existsSync("./.vscode") ) {
        fs.mkdirSync("./.vscode");
    }
    else {
        console.log("dir .vscode exists");
    }

    if ( !fs.existsSync("./.vscode/launch.json") ) {
        const launchExample = fs.readFileSync("./postinstall/launch.json").toString();
        fs.writeFileSync("./.vscode/launch.json", launchExample);
    }
    else {
        console.log("file .vscode/launch.json exists");
    }


}

main();