if (typeof require !== "undefined") {
	var crypto = require('crypto');

	ctm(function (document, window) {
		"use strict";

		// https://stackoverflow.com/questions/48441285/cant-encrypt-decrypt-on-php-equivalent-nodejs-crypto
		const iv = '1234567890abcdef';
		const text = '{"name": "Nevem senki.", "email": "árvíztűrő@tükörfórógép.hu!"}';
		const cypheredText = window.location.hash.substring(1); // TODO: remove prefix correctly


		// Not in use yet for prod
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

		var makeObject = function(string) {
			try {
				console.log('parse string', string);
				return JSON.parse(string) || {};
			} catch(e) {
				console.error('JSON parse error', e);
				return {};
			}
		}

		var md5 = function(string) {
			return crypto.createHash("md5").update(string).digest("hex");
		}


		window.promptForKey = function() {
			const key=window.prompt('Enter your decrpyting key to display details', '');

			if (key) {
				console.log('--encrypting default text', encrypt(iv, text, md5(key)));
				console.log('to decrypt text', cypheredText, 'with key', md5(key));
				const sender = makeObject(decrypt(iv, cypheredText, md5(key)));
				console.log('decrypted from url ', sender);
				document.getElementById('crypto-sender-name').value = sender.name;
				document.getElementById('crypto-sender-email').value = sender.email;

				// switch layouts by removing data-* tag
				[].forEach.call(document.querySelectorAll("main#crypto"), function (element) {
					element.removeAttribute("data-prompt");
				});
			}
		}


		window.promptForKey();

	});
}
