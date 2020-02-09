
/*
 *  Matrix Green Colours
 *  https://www.schemecolor.com/matrix-code-green.php
 *  0D0208, 003B00, 008F11, 00FF41
 *
 *  Color Blander:
 *  https://meyerweb.com/eric/tools/color-blend/#00FF41:003B00:1:hex
 *
 *  Half-width Japanese unicode range
 *  https://stackoverflow.com/questions/19899554/unicode-range-for-japanese
 *  [\xFF5F .. \xFF9F]
 */

function randomIntegerFromRange(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function randomJapaneseHalfWidthChar() {
	return String.fromCharCode(randomIntegerFromRange(0xFF9F, 0xFF5F));
}

function spawnMatrixString(canvasWidth, canvasHeight, length) {
	const marginX = 30;
	const marginY = 100;

	var result = {
		step: 0,
		x: Math.floor(Math.random() * (canvasWidth + marginX)) - marginX,
		y: Math.floor(Math.random() * (canvasHeight + marginY)) - marginY,
		text: ''
	}

	for (var i = 0; i < length; i++) {
		result.text += randomJapaneseHalfWidthChar();
	}

	matrixStrings.push(result);

	return result;
}

function fitToContainer(canvas) {
	canvas.style.width  = '100%';
	canvas.style.height = '35em'; // '100%';
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}

function drawBackground(ctx, width, height) {
	ctx.fillStyle = ctx.createLinearGradient(0, 0, width, height*2);
	ctx.fillStyle.addColorStop(0, '#000000');
	ctx.fillStyle.addColorStop(1, '#003B00');
	ctx.fillRect(0, 0, width, height);
}

function drawMatrixString(ctx, matrixString) {
	ctx.font = "24px sans-serif";

	const charHeight = 30;

	for (var y = 0; y < matrixString.text.length; y++) {
		if (y > matrixString.step) {
			break;
		}

		var charAge = matrixString.step - y;
		var fontColor = '#0D0208';

		if (charAge < 1) {
			fontColor = '#00FF41';
		} else if (charAge < 5) {
			fontColor = '#00C729';
		} else if (charAge < 9) {
			fontColor = '#008F11';
		} else if (charAge < 10) {
			fontColor = '#003B00';
		} else if (charAge > 10) {
			continue;
		}

		ctx.strokeStyle = fontColor;
		ctx.fillStyle = fontColor;

		ctx.fillText(
			matrixString.text[y],
			matrixString.x,
			matrixString.y + y * charHeight);
	}
}

function updateMatrixStrings(matrixStrings, ctx, width, height) {
	const spawnCount = 3;

	for (var i = 0; i < spawnCount; i++) {
		spawnMatrixString(width, height, 12);
	}

	for (var i in matrixStrings) {
		var matrixString = matrixStrings[i];

		drawMatrixString(ctx, matrixString);

		matrixString.step += 1;
	}
}

function cleanupMatrixStrings(matrixStrings) {
	const stepsToLive = 30;

	for (var i in matrixStrings) {
		if (matrixStrings[i].step > stepsToLive) {
			matrixStrings.splice(i, 1);
			i--;
		}
	}
}

var matrixStrings = [];

function updateMatrixFx(canvasElement) {
	fitToContainer(canvasElement);
	var ctx = canvasElement.getContext('2d');
	var width = canvasElement.width;
	var height = canvasElement.height;

	drawBackground(ctx, width, height);
	updateMatrixStrings(matrixStrings, ctx, width, height);
	cleanupMatrixStrings(matrixStrings);
}
