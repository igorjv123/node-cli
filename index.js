const inquirer = require("inquirer");
const fs = require("fs");

(async () => {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            message: "Pick the action you want to do:",
            name: "action",
            choices: ["encode", "decode"]
        }
    ]);
    const { filePath } = await inquirer.prompt([
        {
            type: "input",
            message: "Write the path to file you want perform",
            name: "filePath"
        }
    ]);
    const { shift } = await inquirer.prompt([
        {
            type: "input",
            message: "Write the shift",
            name: "shift"
        }
    ]);
    var readStream = fs.createReadStream(filePath);
    var performedString = '';
    readStream
        .on('data', function (chunk) {
            let string = chunk.toString().split('')
            string.splice(-2,2);
            string = string.join('')

            if(action === 'encode') {
                performedString += encrypt(string, shift);
            }
            if(action === "decode"){
                performedString += decrypt(string, shift);
            }

        })
        .on('end', function () {
            const cwd = process.cwd();

            fs.writeFileSync(`${cwd}/${action}.${filePath}`, performedString, null, 2);

            console.log(`${action}ing success`);
        });


})();

function encrypt(text, shift) {
    shift = parseInt(shift);
    var result = "";
    for (var i = 0; i < text.length; i++) {

        //get the character code of each letter
        var c = text.charCodeAt(i);

        // handle uppercase letters
        if(c >= 65 && c <=  90) {
            result += String.fromCharCode((c - 65 + shift) % 26 + 65);

            // handle lowercase letters
        }else if(c >= 97 && c <= 122){
            result += String.fromCharCode((c - 97 + shift) % 26 + 97);

            // its not a letter, let it through
        }else {
            result += text.charAt(i);
        }
    }
    return result;
}

function decrypt(text,shift){
    shift = parseInt(shift);
    var result = "";
    shift = (26 - shift) % 26;
    result = encrypt(text,shift);
    return result;
}
