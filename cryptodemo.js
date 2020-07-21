// simple encryption demo
var CryptoJS = require('crypto-js');
var masterPassword = 'secret key 123';

// encrypt using your key
var ciphertext = CryptoJS.AES.encrypt('12345', masterPassword).toString();
console.log(ciphertext);

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, masterPassword);
var originalText = bytes.toString(CryptoJS.enc.Utf8);
 
console.log(originalText);