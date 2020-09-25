#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const axios = require('axios');
const chalk = require('chalk');

//syntax with using yargs
const argv = yargs
    .usage('Usage lct <command> [options]')
    .example("lct -f foo.js", "Check all valid URLs in the file")
    .alias('v', 'version')
    .alias('f', 'file')
    .alias('url', 'u')
    .nargs('f', 1) //set the requirement of at least 1 argument for the option, otherwise display --help menu
    .describe('f', 'Load file(s)')
    .demandOption(['f'])
    .describe('u', 'Check a specific url')
    .example('lct -fu https://www.google.com/', 'Check the status of https://www.google.com/')
    .nargs('u', 1)
    .help('help')
    .version("NAME: Link checker tool, Version 1.0.0")
    .alias('h', 'help').argv

//INTERACT WITH A FILE
const fileInteraction = (fName) => {

    let file = fs.createReadStream(fName);
    let fileName = fName;
    let text;
    file.on('data', buf => {
        console.log(fileName + " is OK to be open")
        text = buf.toString();
    })
    file.on('end', () => {
        let validURLs = getValidURLFormat(text);
        if (validURLs == null)
            console.log("There is no URLs in " + fileName)
        else {
            for (i = 0; i < validURLs.length; i++) {
                checkURL(validURLs[i]);
            }
        }
        console.log("---------------------------------------------")

    })


}


// check valid URL format

const getValidURLFormat = (text) => {
    let regEx1 =  new RegExp([
        /(((http|ftp|https):\/{2})/
        ,/(([0-9a-z_-]+\.)/
        ,/(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)/
        ,/(:[0-9]+)?/
        ,/((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?/
        ,/(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?))\b/g
    ].map(r => r.source));
    let validURLs = text.match(regEx1);
    return validURLs;
}

// check status of each URL


const checkURL = async (url) => {
    try {
        const response = await axios.get(url);
        console.log(chalk.green("[GOOD]" + "[" + response.status + "]" + " " + url))
    }
    catch (err) {
        if (err.response) {
            if (err.response.status == 404 || err.response.status == 400)
                console.log(chalk.red("[BAD]" + "[" + err.response.status + "]" + " " + url))
            else
                console.log(chalk.gray("[UNKOWN]" + "[" + err.response.status + "]" + " " + url))
        }
        else
            console.log(chalk.gray("[UNKOWN][ENOTFOUND] " + url));
    }
}


//main 
if (argv.f && (argv.u)) {
    checkURL(argv.u);
}
else if (typeof argv.f == "string") {

    // fileInteraction(argv);

    // for (i = 0; i < argv._.length; i++) {
    //     fileInteraction(argv._[i]);
    // }
    fileInteraction(argv.f)
    for (i = 0; i < argv._.length; i++)
    {
        fileInteraction(argv._[i])
    }
}

