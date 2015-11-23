"use strict";

/******************************************************************************************

Navigation controllers

******************************************************************************************/

var app = angular.module("navigation.controllers", ["ngRoute"]);

// The main navigation menu appears at the top of the page and generally carries non-page specific links
app.controller("ctrlNavigation", ["$rootScope", "$scope", "$location", function NavigationCtrl($rootScope, $scope, $location) {
	$scope.searching = false;
	$scope.searchtext = "";

	$scope.clickShowSearch = function() {
		$scope.searching = true;
		$scope.oldTitle = $rootScope.mainTitle;
		$rootScope.mainTitle = "Search";
	};
	
	$scope.clickHideSearch = function() {
		$scope.searching = false;
		$rootScope.mainTitle = $scope.oldTitle;
	};
}]);


// The sub navigation menu appears when a page has scrolled down beyond the main menu
app.controller("ctrlSubNavigation", ["$rootScope", "$scope", "$timeout", function SubNavigationCtrl($rootScope, $scope, $timeout) {
	// Rebuild the bookmark section links
	var updateBookmarks = function() {
		// Shift this to the next digest so we know the DOM is loaded
		$timeout(function() {
			$rootScope.contentSections = [];
			
			angular.forEach(angular.element("#content > ng-view").last().children("div").children("h3"), function(value, key) {
				var $this = angular.element(value);
				
				$rootScope.contentSections.push({ text: $this.text().replace(/\([^)]*\)/g, ""), element: $this });
			});
		}, 0);
	};

	$rootScope.$on("$viewContentLoaded", updateBookmarks);
	$scope.$on("navigation-updatelinks", updateBookmarks);

	// Scroll to the top of the page
	$scope.scrollToTop = function(index) {
		angular.element("body, html").animate({ scrollTop: 0 }, 500);
	};
	
	// Scroll to a specific page section
	$scope.scrollToSection = function(index) {
		angular.element("body, html").animate({ scrollTop: $rootScope.contentSections[index].element.offset().top - angular.element(".top-navigation-bar").outerHeight() - 20 }, 500);
	};
	
	// Return the bottom of the section list bookmarks
	$scope.minShowOffset = function() {
		var bookmarkElement = angular.element("#bookmarks");
		
		if (!bookmarkElement.length)
			bookmarkElement = angular.element("#content");

		return bookmarkElement.height() + bookmarkElement.offset().top;
	};
}]);

// The tab navigation menu appears near the top of the page and generally carries page specific links
app.controller("ctrlViewNavigation", ["$rootScope", "$scope", "$location", function ViewNavigationCtrl($rootScope, $scope, $location) {
	// Change main content app
	$scope.changeTabView = function(index) {
		if ($rootScope.currentSection[index].app) {
			$location.path("/" + $rootScope.currentSection[index].app);
		}
	};
}]);
