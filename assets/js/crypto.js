if (typeof require !== "undefined") {
	var crypto = require('crypto');

	ctm(function (document, window) {
		"use strict";

		// https://stackoverflow.com/questions/48441285/cant-encrypt-decrypt-on-php-equivalent-nodejs-crypto
		const iv = 'FK_pu8l1CK3y4IV!';
		// const text = '{"name": "Nevem senki.", "email": "árvíztűrő@tükörfórógép.hu!"}';
		const algorithm = 'aes-256-ctr';
		const cypheredText = window.location.hash
			.substring(1) // remove # prefix correctly
			.replace(/^\$\$cR1X\!\$\$/,''); // remove prefix

		// Not in use yet for prod
		// var encrypt = function(iv, text, key){
		//   var cipher = crypto.createCipheriv(algorithm, key, iv)
		//   var crypted = cipher.update(text,'utf8','hex')
		//   crypted += cipher.final('hex');
		//   return crypted;
		// }

		var decrypt = function(iv, text, key){
		  var decipher = crypto.createDecipheriv(algorithm, key, iv)
		  var dec = decipher.update(text,'hex','utf8')
		  dec += decipher.final('utf8');
		  return dec;
		}

		var makeObject = function(string) {
			try {
				return JSON.parse(string) || {};
			} catch(e) {
				console.error('JSON parse error', e);
				return {};
			}
		}

		var md5 = function(string) {
			return crypto.createHash("md5").update(string).digest("hex");
		}


		window.promptForKey = function(inputId) {
			const key=document.getElementById(inputId) && document.getElementById(inputId).value;

			if (key) {
				const sender = makeObject(decrypt(iv, cypheredText, md5(key)));

				// in case of successful decryption
				if (sender.name || sender.email) {
					document.getElementById('crypto-sender-name').value = document.getElementById('crypto-sender-name').innerText = sender.name;
					document.getElementById('crypto-sender-email').value = document.getElementById('crypto-sender-email').innerText = sender.email;
					document.getElementById('crypto-sender-email').onclick = function() {window.location='mailto:'+sender.email+'?subject=Contact&body=Dear '+sender.name+',';return false;};	

					// switch layouts by removing data-* tag
					[].forEach.call(document.querySelectorAll("main#crypto"), function (element) {
						element.removeAttribute("data-prompt");
					});
				} else if(document.getElementById(inputId)) {
					document.getElementById(inputId).value = '';
				}
			}
			return false;
		}


		// window.promptForKey();

	});
}
