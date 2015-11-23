/******************************************************************************************

Angular Animations for use in common apps

******************************************************************************************/

var app = angular.module("alchemytec.animations", ["ngAnimate"]);

app.animation(".slide-view", [function() {
	var animationSpeed = "750ms";
	var animationFunction = "ease";
	var elementCSS = {
		position: "absolute",
		overflow: "auto",
		display: "block"
	};
	var arriving = null;
	var leaving = null;
	
	var animateContentHeight = function() {
		if (leaving && arriving) {
			var $content = angular.element("#content");
			
			// Fix the element widths to avoid reflows and set their starting positions
			leaving.element.css(angular.extend(elementCSS, {
				width: leaving.element.find("div").first().width() + "px"
			}));
			arriving.element.css(angular.extend(elementCSS, {
				width: arriving.element.find("div").first().width() + "px"
			}));
			
			// Make the content width fixed so we can position the new view hidden nicely
			$content.css({
				overflow: "hidden",
				position: "relative",
				width: $content.width() + "px"
			});
			
			// Remove and re-create our keyframe styles for view-leave
			$("#slide-out-to-left").remove();
			$.keyframe.define({
				name: "slide-out-to-left",
				from: {
					transform: "translate(0, 0)"
				},
				to: {
					transform: "translate(-" + $content.outerWidth() + "px, 0)"
				}
			});
			
			// Remove and re-create our keyframe styles for view-enter
			$("#slide-in-from-right").remove();
			$.keyframe.define({
				name: "slide-in-from-right",
				from: {
					transform: "translate(" + $content.outerWidth() + "px, 0)"
				},
				to: {
					transform: "translate(0, 0)"
				}
			});
			
			// Remove and re-create our keyframe styles for resizing the height of the content area
			$("#slide-in-height-fix").remove();
			$.keyframe.define({
				name: "slide-in-height-fix",
				from: {
					height: leaving.element.outerHeight() + "px"
				},
				to: {
					height: arriving.element.outerHeight() + "px"
				}
			});

			// Perform the view-leave animation
			leaving.element.playKeyframe({
				name: "slide-out-to-left",
				duration: animationSpeed,
				timingFunction: animationFunction,
				complete: leaving.callback
			});
			
			// Perform the view-enter animation
			arriving.element.playKeyframe({
				name: "slide-in-from-right",
				duration: animationSpeed,
				timingFunction: animationFunction,
				complete: arriving.callback
			});
			
			// Perform the content height animation
			$content.playKeyframe({
				name: "slide-in-height-fix",
				duration: animationSpeed,
				timingFunction: animationFunction,
				complete: function() {
					// Clear the content styles
					$content.attr("style", "");
				}
			});
			
			// Clear the vars so another view must be loaded before this is all triggered
			arriving = null;
			leaving = null;
		}
	};

	return {
		enter: function(element, done) {
			// Trigger arriving animation if possible
			arriving = {
				element: element,
				callback: done
			};
			animateContentHeight();

			// Handle any animation cleanup operations
			return function(cancelled) {
				if (cancelled)
					angular.element("#content").attr("style", "").resetKeyframe();
				
				// Reset the element styles
				element.attr("style", "");
			}
		},
		leave: function(element, done) {
			// Trigger leaving animation if possible
			leaving = {
				element: element,
				callback: done
			};
			animateContentHeight();
			
			// Handle any animation cleanup operations
			return function(cancelled) {
				// Reset the element styles
				element.attr("style", "");
			}
		}
	}
}]);


app.animation(".animate-fade", [function() {
	var animationSpeed = "500ms";
	var animationFunction = "ease";
	var configured = false;
	
	var createKeyFrames = function() {
		if (configured)
			return;
		
		$.keyframe.define({
			name: "animate-fade-out",
			from: {
				opacity: 1
			},
			to: {
				opacity: 0
			}
		});
		
		$.keyframe.define({
			name: "animate-fade-in",
			from: {
				opacity: 0
			},
			to: {
				opacity: 1
			}
		});
		
		configured = true;
	};
	
	return {
		addClass: function(element, className, done) {
			createKeyFrames();
			
			element.css({
				display: "block"
			});

			// Perform the enter animation
			element.playKeyframe({
				name: "animate-fade-in",
				duration: animationSpeed,
				timingFunction: animationFunction,
				complete: done
			});

			// Handle any animation cleanup operations
			return function(cancelled) {
				if (cancelled)
					element.resetKeyframe();
			}
		},
		removeClass: function(element, className, done) {
			createKeyFrames();

			// Perform the leave animation
			element.playKeyframe({
				name: "animate-fade-out",
				duration: animationSpeed,
				timingFunction: animationFunction,
				complete: function() {
					element.css({
						display: "none",
						opacity: 0
					});
					done();
				}
			});

			// Handle any animation cleanup operations
			return function(cancelled) {
				if (cancelled)
					element.resetKeyframe();
			}
		},
		enter: function(element, done) {
			console.log("enter");
		},
		leave: function(element, done) {
			console.log("leave");
		}
	}
}]);
