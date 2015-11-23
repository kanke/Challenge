/******************************************************************************************

Angular Directives for resizing controls

******************************************************************************************/

var app = angular.module("resize.directives", []);

// The auto-resize-form watches models for changes and resizes content to fit, usually used where a textarea exists
// Usage: <div auto-resize-form resize-watches="comment,someFunc()" resize-sources="textarea,button"></div>
//	this will watch $scope.comment and $scope.someFunc() then resize the div to fit using the heights of all textarea and button elements
// NB: textareas should have ngTrim set to false
app.directive("autoResizeForm", ["$timeout", function($timeout) {
	var link = function($scope, element, attrs, ngModel) {
		if (!attrs.resizeWatches)
			return console.log("Nothing for auto-resize-form to watch :(");
		
		var resizeWatches = (attrs.resizeWatches || "comment").split(",");
		var resizeSources = (attrs.resizeSources || "textarea").split(",");
		var minAreaHeight = 10;
		var timerShrinkTextAreas = null;
		
		var resizeElements = function(newValue, oldValue) {
			// If its a string that has changed, it could be the textarea, which may need shrinking
			if ((typeof(newValue) == "string") && (typeof(oldValue) == "string")) {
				if (newValue.length < oldValue.length) {
					if (timerShrinkTextAreas)
						$timeout.cancel(timerShrinkTextAreas);
					
					timerShrinkTextAreas = $timeout(function() {
						timerShrinkTextAreas = null;

						angular.forEach(resizeSources, function(value, key) {
							if (value.prop("tagName") == "TEXTAREA") {
								value.height(minAreaHeight);
								value.height(value.prop("scrollHeight") - (value.outerHeight() - value.height()));
							}
						});
					}, 500);
				}
			}

			// This ensures elements are updated and DOM should be up to date
			$timeout(function() {
				var newHeight = 0;
				
				angular.forEach(resizeSources, function(value, key) {
					if (value.prop("tagName") == "TEXTAREA") {
						var areaOldHeight = value.height();
						var areaScrollHeight = value.prop("scrollHeight");
						var areaNewHeight = areaScrollHeight - (value.outerHeight() - areaOldHeight);

						newHeight += areaScrollHeight;
						
						if (areaOldHeight != areaNewHeight)
							value.height(areaNewHeight);
					}
					else {
						newHeight += value.outerHeight();
					}
				});
				
				element.stop();
				if (newHeight < element.height())
					element.animate({ height: newHeight });
				else
					element.height(newHeight);
			}, 0);
		};
		
		angular.forEach(resizeWatches, function(value, key) {
			$scope.$watch(value, resizeElements);
		});
		
		angular.forEach(resizeSources, function(value, key) {
			resizeSources[key] = element.find(value);
			if (resizeSources[key].prop("tagName") == "TEXTAREA")
				minAreaHeight = resizeSources[key].height();
		});
	};

	return {
		restrict: "A",
		link: link
	};
}] );
