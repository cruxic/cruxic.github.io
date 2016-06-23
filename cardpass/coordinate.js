var gSeed = null;

function onLoad() {
	var err = checkBrowserCompatibility();
	if (err) {
			alert(err);
			return;
	}		
	
	var seed = getQueryParam('seed');
	if (!seed || !isValidSeed(seed)) {
		document.location = 'coordinate-missing-seed.html';		
		return;
	}
	
	//seed is valid
	gSeed = seed;
}

function checkBrowserCompatibility() {
	//ensure browser can compute SHA-256 correctly
	if (SHA2.hash_text_to_hex("hello\n") !=
		'5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03') {
		return 'This browser is having trouble executing JavaScript properly.  Try a different browser.';
	}
}

function getQueryParam(name) {
	if (!name)
		return null;
	
	var query = document.location.search + '&';
	
	var start = query.indexOf('?' + name + '=');
	if (start == -1)
		start = query.indexOf('&' + name + '=');
	if (start == -1)
		return null;
	
	start += name.length + 	2;
	
	var end = query.indexOf('&', start);
	
	return query.substring(start, end);		
}

function isValidSeed(seed) {
	//todo: verify base26 a-z "Hexavigesimal" and then verify 2 digit checksum.
	return typeof(seed) == 'string';	
}

function makeCoordinate8(byte, alphabet1, alphabet2) {
	//3bits gives 0-7
	var a = byte & 0x7;
	var b = (byte >> 3) & 0x7;
	
	return alphabet1.charAt(a) + alphabet2.charAt(b);
}

function showCoordinates() {
	var elm = document.getElementById('siteurl');

	var siteurl = elm.value;

	siteurl = make_sitename(siteurl);

	elm.value = siteurl;
	
	//sanity
	if (!gSeed || !siteurl)
		throw 'sanity check failed';

	//sha256 hash of seed and site
	var bytes = SHA2.words2bytes(SHA2.sha256(SHA2.str2words(gSeed + siteurl + '\n')));

	//high bit of first byte selects which side of the card (1 or 2)
	var sideNum = (bytes[0] & 0x80) != 0 ? 1 : 0;
	
	var topAlphabet = sideNum == 1 ? 'ABCDEFGH' : 'IJKLMNOP';
	
	//choose first coordinate
	var coord1 = makeCoordinate8(bytes[0], '12345678', topAlphabet);
	
	//Try avoid duplicate for the 2nd coordinate
	var coord2 = null;
	var i, tmp;
	for (i = 1; i < bytes.length; i++) {
		coord2 = makeCoordinate8(bytes[i], '12345678', topAlphabet);
		if (coord2 != coord1)
			break;
	}	

	document.getElementById('coordinates').firstChild.nodeValue = coord1 + ' ' + coord2;
}


function make_sitename(hostname) {
	//For MOST websites using the top and second-level domain name is the best
	// choice.  For example, the login page of homedepot.com appears to
	// be a load-balanced subdomain like (secure2.homedepot.com).
	// Similarly, newegg.com has their login page on secure.newegg.com.
	//
	// However, using the 2nd level domain is not always the best choice.
	// For  example, universities like oregonstate.edu have
	// many subdomains such as osulibrary.oregonstate.edu.
	// Perhaps future versions should allow the user to choose?


	//always lower case
	hostname = hostname.toLowerCase();

	//no IPv6.  This also filters out port numbers however those are not
	// supposed to make it into this function anyway.
	if (hostname.indexOf(':') == -1) {
		var parts = hostname.split('.');
		if (parts.length > 1) {
			// Don't process IPv4 addresses
			var re = new RegExp('[0-9]+');
			if (!re.test(parts[parts.length-1])) {
				//second-level.top-level
				return parts.slice(parts.length-2).join('.');
			}
		}
	}

	return hostname;
}
