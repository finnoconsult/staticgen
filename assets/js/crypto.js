if (typeof require !== "undefined") {
	const cypheredText = window.location.hash.substring(1);
	console.log('string to be decrypted', cypheredText);
	var crypto = require('crypto');

	ctm(function (document, window) {
		"use strict";

		// https://stackoverflow.com/questions/48441285/cant-encrypt-decrypt-on-php-equivalent-nodejs-crypto
		var key = '0a8f1b576cf98841fd1202090230a398';
		var iv = '1234567890abcdef';
		var text = "árvíztűrő@tükörfórógép.hu!";

		var encrypt = function(iv, text, key){
			  var cipher = crypto.createCipheriv('aes-256-ctr', key, iv)
		  var crypted = cipher.update(text,'utf8','hex')
		  crypted += cipher.final('hex');
		  return crypted;
		}

		var decrypt = function(iv, text, key){
		  var decipher = crypto.createDecipheriv('aes-256-ctr', key, iv)
		  var dec = decipher.update(text,'hex','utf8')
		  dec += decipher.final('utf8');
		  return dec;
		}

		const key2=window.prompt('Decrpyt key', '');
		console.log(decrypt(iv, cypheredText, key));
		console.log(crypto.createHash("md5").update("Man oh man do I love node!").digest("hex"));
		console.log('cypheredText', encrypt(iv, text, key), key2);
	});
}
