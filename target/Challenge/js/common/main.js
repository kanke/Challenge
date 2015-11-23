/******************************************************************************************

Main Javascript functionality on every page

******************************************************************************************/

// Substitute fake console object for IE9 or lower
if (!window.console)
	window.console = {};
if (!window.console.log)
	window.console.log = function () { };

// General libraries
window.$ = window.jQuery = require("../libs/jquery/jquery-2.1.1.min.js");
window.jQuery = window.$;
window._ = require("../libs/underscore/underscore-min.js");
require("../libs/jqueryui/jquery-ui.min.js");
require("../libs/jquerykeyframes/jquery.keyframes.min.js");

// Commonly used third party Angular modules
require("../libs-angular/angular/angular.min.js");
require("../libs-angular/angular/angular-route.min.js");
require("../libs-angular/angular/angular-animate.min.js");
require("../libs-angular/angular/angular-sanitize.min.js");
require("../libs-angular/restangular/restangular.min.js");
require("../libs-angular/uidate/date.js");

// Commonly used custom Angular modules
require("./angular.directives.js");
require("./angular.filters.js");
require("./angular.animations.js");

// These things are done on every page if required, such as error popups
$(document).ready(function() {
});
