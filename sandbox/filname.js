const crypto = require('crypto');
const lz = require("./lzstring");
const cipher = crypto.createCipher('aes192', 'a password');
let base64 = require("js-base64");
base64 = base64.Base64;
let text = "abcdefhghijklmnopqrstuvwxyz1234567890abcdefhghijklmnopqrstuvwxyz1234567890abcdefhghijklmnopqrstuvwxy";
// let encrypted = cipher.update(text,'utf8', 'hex');
// encrypted += cipher.final('hex');
// console.log("Original Text : ",text.length);
// console.log(encrypted);
// console.log("Encrypted Text :",encrypted.length);

// const decipher = crypto.createDecipher('aes192', 'a password');

// let decrypted = decipher.update(encrypted, 'hex', 'utf8');

// decrypted += decipher.final('utf8');
// console.log(decrypted);

console.log("Filename length: ",text.length);

let z = lz.compressToEncodedURIComponent(text);
console.log("Encode to URI Comp. :",z.length);
let encrypted = cipher.update(text,'utf8', 'hex');
encrypted += cipher.final('hex');
console.log("AES enc. : ",encrypted.length);
// console.log(lz.compressToUTF16(text));
