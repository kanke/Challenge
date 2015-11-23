"use strict";

/******************************************************************************************

Version controller

******************************************************************************************/

var app = angular.module("version.controller", ["ngRoute"]);

// The version controller
app.controller("ctrlVersion", ["$rootScope", "$scope", function VersionCtrl($rootScope, $scope) {
	// Update the headings
	$rootScope.mainTitle = "About this web application";
	$rootScope.mainHeading = "About this web application";
	
	if (!$rootScope.tabSections.version) {
		$rootScope.tabSections.version = [
			{ title: "Version", app: "version" }
		];
	}
	
	// Update the tab sections
	$rootScope.selectTabSection("version", 0);
	
	console.log(angular.version, angular.version.full);
	console.log($rootScope.config.version);
	console.log($rootScope.config.builddate);
}]);
