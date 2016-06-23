

function checkBrowserCompatibility() {
	if (!window.crypto.getRandomValues) {
		return 'Your browser does not support window.crypto.getRandomValues.  Please use a newer browser';
	}		
}

function getTrulyRandomChars(count) {
	var bytes = new Uint8Array(count);
	window.crypto.getRandomValues(bytes);
	
	var result = '';
	var i;
	for (i = 0; i < count; i++) {
		result += String.fromCharCode(65 + (bytes[i] % 26));  //map each byte to A-Z using modulo
	}
	
	return result;
}

function generateRandomCells(count) {
	//The only bias I will introduce in this is that no two cells have
	// the same 3 letters.  This ensures no password will be a repetition 
	// of the same 3 letters.
	var i, c, randChars;
	var tries = 0;
	var nDiscarded = 0;
	var cells = [];
	while (cells.length < count) {
		tries++;
		if (tries > 100) {
			throw 'Unable to get good random values!';
		}
		
		//generate another batch
		randChars = getTrulyRandomChars(CARD_GRID_W * CARD_CHARS_PER_CELL);
		for (i = 0; i < CARD_GRID_W && cells.length < count; i++) {
			c = randChars.substring(i * CARD_CHARS_PER_CELL, (i + 1) * CARD_CHARS_PER_CELL);
			
			//not already used?
			if (cells.indexOf(c) == -1)
				cells.push(c);
			else
				nDiscarded++;
		}
	}
	
	return cells;	
}

function fillCardCells(sideNum, randCells) {
	//s1_rc00
	var row, col, elm, id;
	var k = 0;
	for (row = 0; row < CARD_GRID_H; row++) {
		for (col = 0; col < CARD_GRID_W; col++) {
			id = 's' + sideNum + '_rc' + row + col;
			elm = document.getElementById(id);
			elm.firstChild.nodeValue = randCells[k++];									
		}
	}
}

function histogram(randCells) {
	var map = {};
	
	var s, i, j, c;
	for (i = 0; i < randCells.length; i++) {
		s = randCells[i];
		for (j = 0; j < s.length; j++) {
			c = s.charAt(j);
			if (map[c])
				map[c]++;
			else
				map[c] = 1;
		}
	}
	
	var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var res = '';
	for (i = 0; i < 26; i++) {
		c = alpha.charAt(i);
		res += c;
		if (map[c])		
			res += map[c];
		else
			res += '0';
			
		res += '\n';
	}		
	
	alert(res);
}

//Called when the page is refreshed
function onLoad() {
	var err = checkBrowserCompatibility();
	if (err) {
		alert(err);
		return;
	}
	
	//Generate random 3 random letters for both sides of the card.
	var NCELLS = CARD_GRID_W * CARD_GRID_H;
	var randCells = generateRandomCells(NCELLS * 2);
	
	fillCardCells(1, randCells.slice(0, NCELLS));
	fillCardCells(2, randCells.slice(NCELLS));
	
	var elm = document.getElementById('seed');
	elm.firstChild.nodeValue = randCells.join(' ');
	
	histogram(randCells);
}
