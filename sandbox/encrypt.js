const crypto = require("crypto");
const fs = require("fs");
///media/teja/9E39-80DA
let mountpoint = "/media/teja/871B-C87F";
let cipher = crypto.createCipher("aes192","A strong Pass");
let decipher = crypto.createDecipher("aes192","A strong Pass");
cipher.on('end',()=>console.log("end"));
let input = fs.createReadStream(`${mountpoint}/enc.mp4`);
let output = fs.createWriteStream(`${mountpoint}/enc.mp4.rigel`);
input.pipe(cipher).pipe(output);