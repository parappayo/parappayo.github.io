
function setElementOpacity(element, opacity) {
	element.style.opacity = opacity;
	element.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
}

function fadeInLinear(element, duration, steps) {
	var opacity = 0.15;
	setElementOpacity(element, opacity);
	var timer = setInterval(function () {
		if (opacity >= 1) {
			clearInterval(timer);
		}
		setElementOpacity(element, opacity);
		opacity += 1 / steps;
	}, duration / steps);
}

function fadeOutLinear(element, duration, steps) {
	var opacity = 1;
	setElementOpacity(element, opacity);
	var timer = setInterval(function () {
		if (opacity < 0.1) {
			clearInterval(timer);
		}
		setElementOpacity(element, opacity);
		opacity -= 1 / steps;
	}, duration / steps);
}

function updateCarosel(className, slideIndex, duration) {
	var slides = document.getElementsByClassName(className);
	slideIndex = slideIndex % slides.length;

	for (var index = 0; index < slides.length; index++) {
		slides[index].style.display = "none";
	};
	slides[slideIndex].style.display = "block";

	var fadeDuration = 200;
	var fadeSteps = 20;
	fadeInLinear(slides[slideIndex], fadeDuration, fadeSteps);
	setTimeout(function () {
		fadeOutLinear(slides[slideIndex], fadeDuration, fadeSteps);
	}, duration - fadeDuration + 2);
}

var visibleSlideIndex = 0;
function flipCarousel(duration, slide_classes) {
	for (const slide_class of slide_classes) {
		updateCarosel(slide_class, visibleSlideIndex, duration);
	}
	visibleSlideIndex++;
}
