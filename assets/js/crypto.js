if (typeof require !== "undefined") {
	console.log('string to be decrypted', window.location.hash);
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
		console.log(encrypt(iv, text, key), key2);
		console.log(decrypt(iv, '014a08e056caa961d518963ab744ba860111b88920c38408e8a9a739860c3608da89d9', key));
	});
}
