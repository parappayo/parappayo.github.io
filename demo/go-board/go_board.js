
var black_img, white_img;  // graphics

var gBoardState = new Array();
var gBoardWidth = 19;
var gBoardHeight = 19;

var gIsBlackTurn = true;

var gKnownGroups = new Array();

//------------------------------------------------------------------------------
//  called when HTML document is finished loading
//------------------------------------------------------------------------------
function init() {

	black_img = new Image();
	black_img.onload = function() {

		white_img = new Image();
		white_img.onload = function() {
			main_start();
		};
		white_img.src = 'white_stone.png';
	};
	black_img.src = 'black_stone.png';

}

//------------------------------------------------------------------------------
function main_start() {

	// no need to loop, just start listening for input
	var canvas = document.getElementById('canvas');
	canvas.onclick = handleMouseClick;

	init_board();
	draw_board();
}

//------------------------------------------------------------------------------
function init_board() {

	for (var i = 0; i < gBoardWidth * gBoardHeight; i++) {
		gBoardState[i] = 'clear';
	}
}

//------------------------------------------------------------------------------
function get_stone(x, y) {

	var stone = new Object();
	stone.x = x;
	stone.y = y;

	var i = y * gBoardWidth + x;
	stone.color = gBoardState[i];

	return stone;
}

//------------------------------------------------------------------------------
function place_stone(stone) {

	var i = stone.y * gBoardWidth + stone.x;
	gBoardState[i] = stone.color;

	var new_group = create_group();
	new_group.stones.push(stone);

	// update groups
	var groups_to_merge = new Array();
	for (var i in gKnownGroups) {
		var group = gKnownGroups[i];
		if (group == new_group) { continue; }
		if (belongs_to_group(stone, group)) {
			// don't modify gKnownGroups while we're walking it
			groups_to_merge.push(group);
		}
	}
	for (var i in groups_to_merge) {
		var group = groups_to_merge[i];
		new_group = merge_groups(new_group, group);
	}

	// TODO: implement ko rule

	// capture before die rule: check neighbouring groups first
	/*
	var neighbouring_groups = find_neighbouring_groups(stone);
	for (var i in neighbouring_groups) {
		var group = neighbouring_groups[i];
		if (belongs_to_group(stone, group)) {
			continue;
		}
		if (has_no_liberties(group)) {
			remove_group(group);
		}
	}
	*/

	// check for removals
	for (var i in gKnownGroups) {
		var group = gKnownGroups[i];
		//console.log(group);
		//console.log(count_liberties(group));
		if (has_no_liberties(group)) {
			remove_group(group);
		}
	}
	//console.log('---');
}

//------------------------------------------------------------------------------
function clear_stone(stone) {

	var i = stone.y * gBoardWidth + stone.x;
	gBoardState[i] = 'clear';
}

//------------------------------------------------------------------------------
function is_adjacent(stone1, stone2) {

	// note: will return false if stone1 is at the same location as stone2
	return	(stone1.y == stone2.y &&
			(stone1.x == stone2.x - 1 || stone1.x == stone2.x + 1)
		) ||
		(stone1.x == stone2.x &&
			(stone1.y == stone2.y - 1 || stone1.y == stone2.y + 1)
		);
}

//------------------------------------------------------------------------------
function belongs_to_group(stone, group) {

	if (group.stones.length < 1) { return false; }
	if (stone.color !== group.stones[0].color) { return false; }

	for (var i in group.stones) {
		var member = group.stones[i];
		if (member.x == stone.x && member.y == stone.y) {
			return true;
		}
		if (is_adjacent(stone, member)) {
			return true;
		}
	}
	return false;
}

//------------------------------------------------------------------------------
function is_bordering_adversary_group(stone, group) {

	if (group.stones.length < 1) { return false; }
	if (stone.color === group.stones[0].color) { return false; }

	for (var i in group.stones) {
		var member = group.stones[i];
		if (is_adjacent(stone, member)) {
			return true;
		}
	}
	return false;
}

//------------------------------------------------------------------------------
function count_liberties(group) {

	var retval = 0;

	var found_liberties = new Object();
	function found_liberty(stone) {
		var i = stone.y * gBoardWidth + stone.x;
		found_liberties[i] = true;
	}

	for (var i in group.stones) {
		var stone = group.stones[i];
		var neighbour;

		if (stone.x > 0) {
			neighbour = get_stone(stone.x - 1, stone.y);
			if (neighbour.color == 'clear') { found_liberty(neighbour); }
		}
		if (stone.x < gBoardWidth - 1) {
			neighbour = get_stone(stone.x + 1, stone.y);
			if (neighbour.color == 'clear') { found_liberty(neighbour); }
		}
		if (stone.y > 0) {
			neighbour = get_stone(stone.x, stone.y - 1);
			if (neighbour.color == 'clear') { found_liberty(neighbour); }
		}
		if (stone.y < gBoardHeight - 1) {
			neighbour = get_stone(stone.x, stone.y + 1);
			if (neighbour.color == 'clear') { found_liberty(neighbour); }
		}
	}

	for (var i in found_liberties) { retval += 1; }
	return retval;
}

//------------------------------------------------------------------------------
//  more efficient alternative to count_liberties() == 0
//------------------------------------------------------------------------------
function has_no_liberties(group) {

	for (var i in group.stones) {
		var stone = group.stones[i];
		var neighbour;

		if (stone.x > 0) {
			neighbour = get_stone(stone.x - 1, stone.y);
			if (neighbour.color == 'clear') { return false; }
		}
		if (stone.x < gBoardWidth - 1) {
			neighbour = get_stone(stone.x + 1, stone.y);
			if (neighbour.color == 'clear') { return false; }
		}
		if (stone.y > 0) {
			neighbour = get_stone(stone.x, stone.y - 1);
			if (neighbour.color == 'clear') { return false; }
		}
		if (stone.y < gBoardHeight - 1) {
			neighbour = get_stone(stone.x, stone.y + 1);
			if (neighbour.color == 'clear') { return false; }
		}
	}

	return true;
}

//------------------------------------------------------------------------------
function create_group() {

	var new_group = new Object();
	new_group.stones = new Array();
	new_group.index = gKnownGroups.length;
	gKnownGroups.push(new_group);
	return new_group;
}

//------------------------------------------------------------------------------
function delete_group(group) {

	gKnownGroups.splice(group.index, 1);
	for (var i in gKnownGroups) {
		var group = gKnownGroups[i];
		group.index = i;
	}
}

//------------------------------------------------------------------------------
function remove_group(group) {

	for (var i in group.stones) {
		var stone = group.stones[i];
		clear_stone(stone);
	}
	delete_group(group);
}

//------------------------------------------------------------------------------
function merge_groups(group1, group2) {

	var merged_stones = new Array();

	for (var i in group1.stones) {
		var stone = group1.stones[i];
		merged_stones.push(stone);
	}
	for (var i in group2.stones) {
		var stone = group2.stones[i];
		merged_stones.push(stone);
	}

	delete_group(group1);
	delete_group(group2);

	var new_group = create_group();
	new_group.stones = merged_stones;
	return new_group;
}

//------------------------------------------------------------------------------
function find_neighbouring_groups(stone) {

	var retval = new Array();

	for (var i in gKnownGroups) {
		var group = gKnownGroups[i];
		if (is_bordering_adversary_group(group)) {
			// TODO: don't add group more than once
			retval.push(group);
		}
	}
	
	return retval;
}

//------------------------------------------------------------------------------
function draw_board() {

	var ctx = document.getElementById('canvas').getContext('2d');

	ctx.fillStyle = "rgb(220, 220, 220)";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	// piece dimensions
	var img_w = black_img.width;
	var img_h = black_img.height;

	// draw play grid
	for (var x = 0; x < gBoardWidth; x++) {
		ctx.moveTo(x * img_w + img_w / 2.0, img_h / 2.0);
		ctx.lineTo(x * img_w + img_w / 2.0, gBoardHeight * img_h - img_h / 2.0);
		ctx.stroke();
	}
	for (var y = 0; y < gBoardHeight; y++) {
		ctx.moveTo(img_w / 2.0, y * img_h + img_h / 2.0);
		ctx.lineTo(gBoardWidth * img_w - img_w / 2.0, y * img_h + img_h / 2.0);
		ctx.stroke();
	}

	// draw the pieces
	for (var y = 0; y < gBoardHeight; y++) {
		for (var x = 0; x < gBoardWidth; x++) {

			var i = y * gBoardWidth + x;
			var color = gBoardState[i];
			var img_x = x * img_w;
			var img_y = y * img_h;

			if (color == 'black') {
				ctx.drawImage(black_img, img_x, img_y);

			} else if (color == 'white') {
				ctx.drawImage(white_img, img_x, img_y);
			}
		}
	}
}

//------------------------------------------------------------------------------
function take_move(x, y)
{
	// TODO: need to do some checking to see if the given move is valid
	// eg. can't place stone where it will immediately die unless it
	// captures a group first

	var stone = new Object();
	stone.x = x;
	stone.y = y;

	if (gIsBlackTurn) {
		stone.color = 'black';
	} else {
		stone.color = 'white';
	}
	gIsBlackTurn = !gIsBlackTurn;

	place_stone(stone);
}

//------------------------------------------------------------------------------
//  input handling
//------------------------------------------------------------------------------
function handleMouseClick(e) {

	var e = window.event || e;

	var board_x = Math.floor(e.clientX / black_img.width);
	var board_y = Math.floor(e.clientY / black_img.height);

	var stone = get_stone(board_x, board_y);
	if (stone.color == 'clear') {
		take_move(board_x, board_y);
	}

	draw_board();
}

