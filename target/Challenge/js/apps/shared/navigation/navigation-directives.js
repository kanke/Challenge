/******************************************************************************************

Angular Directives for the navigation app

******************************************************************************************/

var app = angular.module("navigation.directives", []);

// The bookmarklist directive adds a clickable bookmark list to an element
// Usage: <div bookmarklist></div>
//	this will fill the list with an unordered list of clickable bookmark elements taken from any h3's directly decended from the content container
app.directive("bookmarklist", ["$compile", function($compile) {
	var link = function($scope, element, attrs, ngModel) {
		var contentList = angular.element("<ul></ul>");
		var contentSections = [];
		var searchContainer = angular.element("#content > ng-view").last().children("div");
		
		// Scroll to a specific page section
		$scope.scrollToSection = function(index) {
			angular.element("body, html").animate({ scrollTop: contentSections[index].element.offset().top - angular.element(".top-navigation-bar").outerHeight() - 20 }, 500);
		};

		// Build the section list
		var buildSectionList = function() {
			contentList.empty();
			contentSections = [];

			angular.forEach(searchContainer.children("h3"), function(value, key) {
				var $this = angular.element(value);
				var listItem = angular.element("<li class='clickable' ng-click='scrollToSection(" + contentSections.length + ")'>" + $this.text().replace(/\([^)]*\)/g, "") + "</li>");
				
				contentList.append(listItem);
				contentSections.push({ text: $this.text(), element: $this });
			});
		};
		
		$scope.$on("navigation-updatelinks", buildSectionList);
		buildSectionList();
		
		// Add the list to the DOM
		$compile(contentList.contents())($scope);
		element.append(contentList);
	};

	return {
		restrict: "A",
		link: link
	};
}] );


// The searchbar directive shows and hides the search box
// Usage: <div class="icon clickable" searchbar="#search-bar"><i class="fa fa-search"></i></div>
//	this would show and hide the search bar when clicking this element
app.directive("searchbar", ["$timeout", function($timeout) {
	var getSearchWidth = function(searchBar) {
		var heading = angular.element(".top-navigation-bar > .navigation-container h1");

		return angular.element(".top-navigation-bar > .navigation-container").outerWidth()
			/*- angular.element(".top-navigation-bar > .navigation-container .logo").outerWidth()
			- parseInt(angular.element(".top-navigation-bar > .navigation-container .logo").css("marginRight"), 10)*/
			- heading.outerWidth()
			- parseInt(heading.css("marginLeft"), 10)
			- parseInt(heading.css("marginRight"), 10)
			- parseInt(searchBar.css("right"), 10);
	};

	var link = function($scope, element, attrs) {
		var $window = angular.element(window);
		var searchBar = angular.element(attrs.searchbar || "#search-bar");
		var searchButton = element;
		var searchHideButton = searchBar.find(".icon");
		var mainLogo = angular.element(".top-navigation-bar div.logo");
		var mainLogoWidth = parseInt(mainLogo.css("width"), 10);
		
		var showSearchBar = function() {
			searchButton.hide();
			searchBar.show();
			
			$timeout(function() {
				$scope.mainTitle = "Search";
				
				$timeout(function() {
					mainLogo.animate({ width: 0 }, 500, "linear");
					searchBar.animate({ width: getSearchWidth(searchBar) }, 500, "linear", function() {
						searchBar.find("input").focus();
					});
				}, 0);
			}, 0);
		};
		
		var hideSearchBar = function() {
			searchBar.find("input").blur();
			searchBar.animate({ width: 42 }, 500, "linear", function() {
				searchBar.fadeOut();
				searchButton.show();
			});
			mainLogo.animate({ width: mainLogoWidth }, 500, "linear");
			
			$timeout(function() {
				delete $scope.mainTitle;
			}, 0);
		};
		
		searchButton.click(function(event) {
			event.preventDefault();
			event.stopPropagation();
			
			showSearchBar();
		});
		
		searchBar.click(function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
		
		searchHideButton.click(function(event) {
			event.preventDefault();
			event.stopPropagation();

			hideSearchBar();
		});
		
		$window.resize(function() {
			searchBar.css({ width: getSearchWidth(searchBar) });
		});
		
		$window.click(function() {
			hideSearchBar();
		});
	};

	return {
		restrict: "A",
		link: link
	};
}]);
