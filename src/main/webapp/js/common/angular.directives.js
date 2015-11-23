/******************************************************************************************

Angular Directives for use in common apps

******************************************************************************************/

var app = angular.module("alchemytec.directives", []);

// The slidein directive makes a fixed element visible when the page scrolls down
// Usage: <div slidein min-scroll="50" slide-direction="down" slide-delay="50" slide-speed="250" class="fixed-menu">Hi there</div>
//	this will slide down the div with an animation time of 250ms when the window is scrolled down by 50 pixels,
//	delaying the initial animation by 50ms
// Any elements inside a slidein element may also contain slide-direction attributes, and will be slid-in when the top animation is complete
app.directive("slidein", ["$timeout", function($timeout) {
	var getHidePos= function(element, direction) {
		var hidePos = { };
		var eleWidth = element.element.outerWidth() + 10;
		var eleHeight = element.element.outerHeight() + 10;
		
		// Set the hidden position based on the slide direction
		switch (direction) {
			case "right":
				hidePos.left = element.left - eleWidth;
				break;
			case "left":
				hidePos.right = element.right - eleWidth;
				break;
			case "up":
				hidePos.bottom = element.bottom - eleHeight;
				break;
			case "down":
				hidePos.top = element.top - eleHeight;
				break;
			default:
				break;
		}
		
		return hidePos;
	};
	
	var getAnimateVars = function(element, direction) {
		// Make sure we only animate the minimum of values
		switch (direction) {
			case "right":
				return { left: element.left + "px" };
			case "left":
				return { right: element.right + "px" };
			case "up":
				return { bottom: element.bottom  + "px" };
			case "down":
				return { top: element.top+ "px" };
		}
		
		return {};
	};
	
	var getElementVars = function(element, slideDirection, slideSpeed, slideDelay) {
		var top = element.css("top");
		var right = element.css("right");
		var bottom = element.css("bottom");
		var left = element.css("left");
		
		return {
			element: element,
			top: (top == "auto")? null : parseInt(top, 10),
			right: (right == "auto")? null : parseInt(right, 10),
			bottom: (bottom == "auto")? null : parseInt(bottom, 10),
			left: (left == "auto")? null : parseInt(left, 10),
			direction: slideDirection || "down",
			speed: parseInt(slideSpeed || 250, 10),
			delay: parseInt(slideDelay || 0, 10)
		};
	};

	var link = function($scope, element, attrs, ngModel) {
		var minScroll = $scope.$eval(attrs.minScroll) || 60;
		var $window = angular.element(window);
		var $body = angular.element("body");
		var elements = [];
		var visible = false;
		
		// Setup the initial elements list
		var setupElements = function() {
			// Get the element position and size
			element.show();
			
			// Store the initial positions
			elements.push(getElementVars(element, attrs.slideDirection, attrs.slideSpeed, attrs.slideDelay));
			
			// Find any child elements that require sliding
			element.find("[slide-direction]").each(function() {
				var $this = $(this);
				
				$this.show();
				elements.push(getElementVars($this, $this.attr("slide-direction"), $this.attr("slide-speed"), $this.attr("slide-delay")));
			});
			
			// Set initial hidden positions of all objects
			for (var u = 0; u < elements.length; u++) {
				var eleHidePos = getHidePos(elements[u], elements[u].direction);
				var newCSS = getAnimateVars(eleHidePos, elements[u].direction);
				
				for (var key in newCSS)
					elements[u].element.css(key, newCSS[key]);
			}
		};
		
		// Watch for any changes in our minimum scroll values
		if (attrs.minScroll) {
			$scope.$watch(attrs.minScroll, function(newValue, oldValue) {
				minScroll = parseInt(newValue) || 60;
			});
		}
		
		// Update element visibilities
		var showHide = function(event) {
			if (!elements.length)
				return;

			// Only show the element if we haven't already
			if (!visible && ($window.scrollTop() > minScroll)) {
				visible = true;
				
				// Ensure no other animations are in progress
				elements[0].element.stop();
				
				// Trigger the main animation
				$timeout(function() {
					elements[0].element.animate(getAnimateVars(elements[0], elements[0].direction), elements[0].speed, function() {
						// Trigger any child animations once the main is complete
						for (var u = 1; u < elements.length; u++) {
							(function(index) {
								$timeout(function() {
									elements[index].element.animate(getAnimateVars(elements[index], elements[index].direction), elements[index].speed);
								}, elements[index].delay);
							})(u);
						}
					});
				}, elements[0].delay);
			}
			else if (visible && ($window.scrollTop() <= minScroll)) {
				visible = false;
				
				// Trigger any child animations once the main is complete
				for (var u = 0; u < elements.length; u++) {
					(function(index) {
						$timeout(function() {
							// Ensure no other animations are in progress
							elements[index].element.stop();
							var eleHidePos = getHidePos(elements[index], elements[index].direction);

							elements[index].element.animate(getAnimateVars(eleHidePos, elements[index].direction), elements[index].speed);
						}, elements[index].delay);
					})(u);
				}
			}
		};
		
		// Initialise our element list
		setupElements();

		// Watch for a scroll event
		$window.on("scroll", showHide);
		$window.bind("touchmove", showHide);
	};

	return {
		restrict: "A",
		link: link
	};
}]);


// The nozero validation directive marks a form field as invalid if it contains a zero value
// Usage: <input ng-required nozero ng-model="quantity" />
//	If quantity == "0" then this would be marked $invalid
app.directive("nozero", function (){
	var link = function(scope, element, attr, ngModel) {
		var validate = function(value) {
			var testvalue = value? (value.value || value) : value;

			if (testvalue && !isNaN(parseInt(testvalue, 10)) && (parseInt(testvalue, 10) != 0)) {
				ngModel.$setValidity("nozero", true);
			}
			else {
				ngModel.$setValidity("nozero", false);
			}
				
			return value;
		};
		
		ngModel.$parsers.unshift(function(value) {
			return validate(value);
		});

		ngModel.$formatters.unshift(function(value) {
			return validate(value);
		});
	}
	
	return {
		restrict: "A",
		require: "ngModel",
		link: link
	};
});


// The currency directive formats a form field on blur to match the currency format
// Usage: <input currency currency-zero-invalid ng-model="price" />
//	If price == "23.4" then on blur the view will display 23.40
app.directive("currency", function (){
	var link = function(scope, element, attr, ngModel) {
		element.before("<i class='currency'></i>");
		element.addClass("currency");
		
		var isZeroValid = !attr.currencyZeroInvalid;
		
		ngModel.$parsers.push(function(value) {
			var value = parseFloat(value);
			
			ngModel.$setValidity("currency", isZeroValid? !isNaN(value) : !!value);
             
			return value;
		});
		
		ngModel.$formatters.unshift(function(value) {
			var value = parseFloat(value);
			
			ngModel.$setValidity("currency", isZeroValid? !isNaN(value) : !!value);

			if (isNaN(value))
				value = 0;
	
			var pounds = Math.floor(value);
			var pence = new String(Math.round((value - pounds) * 100));
			if (pence.length < 2)
				pence = "0" + pence;
			
			return pounds + "." + pence;
		});
	};
	
	return {
		restrict: "A",
		require: "ngModel",
		link: link
	};
});


// The cleanser directive marks all elements of a form clean when the form is marked clean
// Usage: <form cleanser><input name="blah" /></form>
//	this will mark the blur element as pristine and !dirty whenever the form is marked clean
app.directive("cleanser", function() {
	var link = function($scope, element, attr, ngModel) {
		var formname = element.attr("name");

		$scope.$watch(function() {
			return $scope[formname].$pristine;
		}, function() {
			if ($scope[formname].$pristine) {
				var formFields = element.find("input,textarea");
				
				angular.forEach(formFields, function(field) {
					var $field = angular.element(field);
					var name = $field.attr("name");
					
					$scope[formname][name].$dirty = false;
					$scope[formname][name].$pristine = true;
				});
			}
		});
	};
	
	return {
		restrict: "A",
		link: link
	};
});


// The clicktoggle directive makes another element visible when the element is clicked
// Usage: <a clicktoggle="#showme" hide-on="scroll,click">Click me</a> <div id="showme">Thanks for the click!</div>
//	this will show or hide the div when the A element is clicked, and also hide the div when the window element is clicked or scrolled.
//	target element can also begin with a chain of commands that include $parent, $next, $prev to find a relative element
// Optional attribute target-position="center/left/right" will position the element it is showing based on the clicked element
// Optional attribute show-method="slidedown/slideup/fade" will show the element with that animation type
// Optional attribute parent-touchable="true" will react when the parent element is clicked
app.directive("clicktoggle", ["$timeout", "$animate", function($timeout, $animate) {
	var setShowPos = function(element, clickedElement, position) {
		var currentPos = element.offset();
		
		if (!position)
			return;

		// Set the show position based on the parent element
		switch (position) {
			case "right":
				currentPos.left = clickedElement.offset().left + clickedElement.outerWidth() - element.outerWidth();
				break;
			case "left":
				currentPos.left = clickedElement.offset().left;
				break;
			case "center":
				currentPos.left = clickedElement.offset().left + Math.floor((clickedElement.outerWidth() - element.outerWidth()) / 2);
				break;
		}
		
		element.css({ left: currentPos.left });
	};
	
	var toggleElement = function(clickedElement, showHideElement, method, forcehide) {
		if (forcehide || showHideElement.is(":visible")) {
			switch (method) {
				case "slidedown":
					showHideElement.slideUp();
					break;
				case "slideup":
					showHideElement.slideDown();
					break;
				case "fade":
				default:
					$timeout(function() {
						$animate.removeClass(showHideElement, "animate-fade");
					});
			}
			
			clickedElement.removeClass("toggle-show");
			clickedElement.addClass("toggle-hide");
		}
		else {
			switch (method) {
				case "slidedown":
					showHideElement.slideDown();
					break;
				case "slideup":
					showHideElement.slideUp();
					break;
				case "fade":
				default:
					$timeout(function() {
						$animate.addClass(showHideElement, "animate-fade");
					});
			}
			
			clickedElement.removeClass("toggle-hide");
			clickedElement.addClass("toggle-show");
		}
	};
	
	var link = function($scope, element, attrs, ngModel) {
		var $window = angular.element(window);
		var clickToggle = attrs.clicktoggle || "$this";
		var showMethod = attrs.showMethod || "fade";
		var parentTouchable = attrs.parentTouchable || false;
		var position = attrs.targetPosition;

		// Get a list of events to filter on
		if (attrs.hideOn)
			var events = attrs.hideOn.split(",");
		else
			var events = [];
		
		// If we have no special $ operators we can just get the target element
		if (clickToggle.search(/\$/) == -1)
			var $target = angular.element(clickToggle);
		else {
			// Make special operators
			clickToggle = "element." + clickToggle.replace(/\$([a-z]+)/ig, "$1()");
			clickToggle = clickToggle.replace(/\)([.#]+[a-z0-9]+)$/ig, "'$1')");

			$target = eval(clickToggle);
		}
		
		var clickFunc = function(event) {
			event.preventDefault();
			event.stopPropagation();
			
			toggleElement(element, $target, showMethod);
			setShowPos($target, element, position);
			
			// Hide any other clicktoggles currently showing
			angular.forEach(angular.element("[clicktoggle]"), function(clickelement) {
				var $element = angular.element(clickelement);
				var target = $element.attr("clicktoggle");
				
				if ((target.indexOf("$") == -1) && (target != clickToggle)) {
					var $targetElement = angular.element(target);

					if ($targetElement.is(":visible")) {
						var hideOn = $element.attr("hide-on");
						
						if (hideOn && hideOn.indexOf("click"))
							toggleElement($element, $targetElement, $element.attr("show-method") || "fade", true);
					}
				}
			});
		};
		
		// Toggle our target element whenever this element (and parent) is clicked
		element.click(clickFunc);
		if (parentTouchable)
			element.parent().click(clickFunc);
		
		// Make sure any clicks to the target element we are showing don't propagate up to window
		$target.click(function(event) {
			event.stopPropagation();
		});

		// Hide our target element whenever specified events are triggered
		angular.forEach(events, function(eventname) {
			$window.on(eventname, function(event) {
				toggleElement(element, $target, showMethod, true);
			});
		});
	};

	return {
		restrict: "A",
		link: link
	};
}]);


// The circlebox directive turns an element into a circle checkbox
// Usage: <div><div circlebox ng-model="restactive" parent-touchable="true"> click me</div>
//	this would show a circle checkbox in place of the div and clicking on the parent div will also toggle it
// NB: When a parent element is touchable it also gains the class checked
app.directive("circlebox", function() {
	var link = function($scope, element, attrs, ngModel) {
		var parentTouchable = attrs.parentTouchable || false;
		
		var clickFunc = function(event) {
			event.preventDefault();
			event.stopPropagation();
			
			if (element.hasClass("checked")) {
				ngModel.$setViewValue(false);
				element.removeClass("checked");
				if (parentTouchable)
					element.parent().removeClass("checked");
			}
			else {
				ngModel.$setViewValue(true);
				element.addClass("checked");
				if (parentTouchable)
					element.parent().addClass("checked");
			}
		};

		element.click(clickFunc);
		if (parentTouchable)
			element.parent().click(clickFunc);

		// Adjust our circlebox when our model changes
		ngModel.$render = function() {
			if (ngModel.$viewValue)
				element.addClass("checked");
			else
				element.removeClass("checked");
		};
	};

	return {
		restrict: "A",
		require: "^ngModel",
		scope: {
			ngModel: "="
		},
		replace: true,
		template: "<div class='checkbox circle clickable'></div>",
		link: link
	};
});


// The showmore directive places a clickable ruler at the bottom of an element that can be used to load and view more content
// Usage: <div showmore="loadMoreContent" show-count="remainingCount()">
//	this would call $scope.loadMoreContent = function(callback) {}; when clicked and then reveal the additional content
app.directive("showmore", ["$timeout", function($timeout) {
	var link = function($scope, element, attrs) {
		var moreCount = angular.element("<span></span>");
		var wrapHtml = angular.element("<div class='show-more-wrapper'><div class='show-more-gradient'></div><div class='show-more-rule'></div></div>");
		var showHtml = angular.element("<div class='show-more clickable'></div>");
		var showTextHtml = angular.element("<span></span>");
		var lastMoreCount = 0;
		var loading = false;
		
		showTextHtml.append("Show ", moreCount, " more");
		showHtml.append("<i class=''></i>", showTextHtml);
		wrapHtml.append(showHtml);
		wrapHtml.css("marginTop", "-" + (parseInt(element.css("marginBottom"), 10) - 10) + "px");
		element.after(wrapHtml);
		
		showHtml.click(function() {
			// Make sure we aren't loading more already
			if (loading)
				return;
			loading = true;

			// Make the element height fixed so when new content is added it is hidden
			element.css("overflow-y", "hidden");
			element.height(element.height());
			
			// Update the clickable text so the user knows something is happening
			showTextHtml.html("Retrieving more");
			$scope[attrs.showmore](function() {
				// Put the animation in the next digest so the DOM has had a chance to be updated with the new elements
				$timeout(function() {
					element.animate({ height: element.prop("scrollHeight") }, lastMoreCount * 50, function() {
						// Return the table back to auto height
						element.css("overflow-y", "visible");
						element.css("height", "");
						
						// Update the clickable text to allow for more results
						showTextHtml.empty();
						showTextHtml.append("Show ", moreCount, " more");
						loading = false;
					});
				}, 0);
			});
		});

		$scope.$watch(attrs.showCount, function(newvalue, oldvalue) {
			lastMoreCount = newvalue;
			
			// Number of results has changed so either update text or hide offer to show more
			if (newvalue)
				moreCount.text(newvalue);
			else
				wrapHtml.hide();
		});
	};

	return {
		restrict: "A",
		link: link
	};
}]);


// The click-to-window directive makes sure any click to the element always reaches the main window
// Usage: <a click-to-window href="/">blah</a>
//	this may cause a page change but the window element will receive the click event
app.directive("clickToWindow", [function() {
	var link = function($scope, element, attrs) {
		element.click(function() {
			angular.element(window).click();
		});
	};

	return {
		restrict: "A",
		link: link
	};
}]);


// The popupmenu directive adds a popup menu to an element
// Usage: <i popupmenu ng-model="menuoptions" class="icon hamburger"></i>
//	this will popup a menu configured by the array menuoptions
//	menuoptions = [ { title: "somestring" || null, click: "scopefunctionname", enabled: true } ]
app.directive("popupmenu", ["$timeout", "$animate", function($timeout, $animate) {
	var link = function($scope, element, attrs, ngModel) {
		var $window = angular.element(window);
		var menuElement = angular.element("<div class='menu-popup text-list'></div>");
		var menuList = angular.element("<ul></ul>");
		
		menuElement.append(menuList);
		angular.element("body").append(menuElement);
		
		$window.click(function() {
			$timeout(function() {
				$animate.removeClass(menuElement, "animate-fade");
			});
		});
		
		element.addClass("clickable");

		element.click(function(event) {
			event.preventDefault();
			event.stopPropagation();
			
			// If the menu element exists, fade it out and stop here
			if (menuElement.is(":visible")) {
				$timeout(function() {
					$animate.removeClass(menuElement, "animate-fade");
				});
				return;
			}

			// Position menu and fade in
			var elementPos = element.offset();
			
			elementPos.top += element.outerHeight() + 15;
			elementPos.left -= menuElement.outerWidth() - Math.floor(element.outerWidth() / 2) - 22;
				
			menuElement.css({ top: elementPos.top + "px", left: elementPos.left + "px" });
			$timeout(function() {
				$animate.addClass(menuElement, "animate-fade");
			});
		});
		
		// Rebuild our list whenever the model changes
		ngModel.$render = function() {
			menuList.empty();
			
			angular.forEach(ngModel.$viewValue, function(value, key) {
				var classDisabled = value.disabled? " class='disabled'" : "";
				var actionClick = (value.click && !value.disabled)? " data-click='" + value.click + "()'" : "";
				
				if (value.title)
					menuList.append("<li" + classDisabled + actionClick + ">" + value.title + "</li>");
				else
					menuList.append("<li class='seperator'></li>");
			});
			
			menuList.find("li").each(function() {
				var $this = $(this);
				
				$this.unbind("click");
				
				if ($this.data("click")) {
					$this.click(function() {
						$scope.$eval($this.data("click"));
						$timeout(function() {
							$animate.removeClass(menuElement, "animate-fade");
						});
					});
				}
			});
		};
	};

	return {
		restrict: "A",
		require: "^ngModel",
		link: link
	};
}]);
