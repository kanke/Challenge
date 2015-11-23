/******************************************************************************************

Automated building of JavaScript and LESS files courtesy of Gulp

******************************************************************************************/

var package = require("./package.json");
var path = require("path");
var gulp = require("gulp");
var gulpsync = require("gulp-sync")(gulp);
var clean = require("gulp-clean");
var less = require("gulp-less");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var gulpif = require("gulp-if");
var rename = require("gulp-rename");
var filesize = require("gulp-filesize");
var foreach = require("gulp-foreach");
var inject = require("gulp-inject-string");
var ngtemplates = require("gulp-ng-templates");
var minifyhtml = require("gulp-minify-html");
var buffer = require("vinyl-buffer");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var LessPluginCleanCSS = require("less-plugin-clean-css");
var cleancss = new LessPluginCleanCSS({ advanced: true, verbose: true, debug: true });
var compress = true;

// Source and destination dirs
var paths = {
	static: {
		source: "./src/",
		target: "./static/"
	},
	build: {
		source: "./build/source/",
		target: "./build/dest/"
	},
	copy: [
		"fonts/**/*.*",
		"img/**/*.*",
	]
};

// Default options
var options = {
	browserify: {
		insertGlobals: false,
		detectGlobals: false,
		debug: true,
		basedir: paths.build.source
	},
	uglify: {
		compress: {
			drop_console: true,
			sequences: true, // join consecutive statemets with the “comma operator”
			properties: true, // optimize property access: a["foo"] ? a.foo
			dead_code: true, // discard unreachable code
			drop_debugger: true, // discard “debugger” statements
			unsafe: false, // some unsafe optimizations (see below)
			conditionals: true, // optimize if-s and conditional expressions
			comparisons: true, // optimize comparisons
			evaluate: true, // evaluate constant expressions
			booleans: true, // optimize boolean expressions
			loops: true, // optimize loops
			unused: false, // drop unused variables/functions
			hoist_funs: true, // hoist function declarations
			hoist_vars: false, // hoist variable declarations
			if_return: true, // optimize if-s followed by return/continue
			join_vars: true, // join var declarations
			cascade: true, // try to cascade `right` into `left` in sequences
			side_effects: true, // drop side-effect-free statements
			warnings: true
		},
		mangle: {
		},
		beautify: {
			"ascii_only": true
		}
	},
	minifiy: {
		empty: true,
		spare: true,
		quotes: true
	}
};

// List of JS files used and to be watched in various bundles
var lists = {
	css: {
		build: [
			"less/css.less"
		],
		watch: [
			"less/*.less"
		]
	},
	main: {
		build: [
			"./js/common/main.js"
		],
		watch: [
			"js/common/**/*.js",
			"js/libs/**/*.js",
			"js/libs-angular/**/*.js"
		]
	},
	apps: {
		build: [
			"./js/apps/**/*-main.js"
		],
		partials: [
			"./js/apps/**/partials"
		],
		watch: [
			"./js/apps/**/*.js",
			"./js/apps/**/*.html",
			"js/common/**/*.js",
			"js/libs/**/*.js",
			"js/libs-angular/**/*.js"
		]
	}
};

// Script building utility function
function buildPathArray(prefix, paths) {
	var list = [];
	prefix = prefix || "";
	
	for (var u = 0; u < paths.length; u++)
		list.push(prefix + paths[u]);

	return list;
};

// Return root path for minifify
var compressPath = function (p) {
	return p;
	// Despite the docs saying this works, Chrome seems to show it doesn't
	return path.relative(paths.build.source, p);
};

// Set the build output to be uncompressed and unminified
gulp.task("uncompressed", function() {
	compress = false;
	options.browserify.debug = false;
});

// Clean copied source directories          
gulp.task("clean-source", function() {
	return gulp.src(paths.build.source, { read: false })
		.pipe(clean());
});

// Clean build directories
gulp.task("clean-target", function() {
	return gulp.src(paths.build.target, { read: false })
		.pipe(clean());
});

// Clean all directories
gulp.task("clean", ["clean-source", "clean-target"]);

// Copy from source dir to build directory
gulp.task("copyfrom", ["clean"], function() {
	return gulp.src(paths.static.source + "**")
		.pipe(gulp.dest(paths.build.source));
});

// Copy static files to build dest directory
gulp.task("copystatic", function() {
	return gulp.src(buildPathArray(paths.build.source, paths.copy), { base: paths.build.source })
		.pipe(gulp.dest(paths.build.target));
});

// Copy built files to release directory
gulp.task("copyto", ["copystatic"], function() {
	return gulp.src(paths.build.target + "**/*.*", { base: paths.build.target })
		.pipe(gulp.dest(paths.static.target));
});

// Compile CSS
gulp.task("css", function() {
	return gulp.src(buildPathArray(paths.build.source, lists.css.build))
		.pipe(sourcemaps.init({ loadMaps: true, debug: true }))
		.pipe(less({
			plugins: [
				cleancss
			]
		}))
		.pipe(rename("main.min.css"))
		.pipe(filesize())
		.pipe(sourcemaps.write("../maps"))
		.pipe(gulp.dest(paths.build.target + "css/"));
});

// Compile main app partials
gulp.task("apps-partials", function() {
	return gulp.src(buildPathArray(paths.build.source, lists.apps.partials))
		.pipe(foreach(function(stream, file) {
			var pathArray = file.path.split("/");
			pathArray.pop();
			var basename = pathArray.pop();
			
			return gulp.src(file.path + "/**/*.html")
				.pipe(minifyhtml(options.minifiy))
				.pipe(ngtemplates({
					module: basename + ".partials",
					path: function (path, base) {
						return path.replace(base, "").replace("partials/", "");
					}
				}))
				.pipe(uglify(options.uglify))
				.pipe(rename("app-partials.js"))
				.pipe(filesize())
				.pipe(gulp.dest(paths.build.source + "js/apps/" + basename));
		}))
});

// Compile app scripts
gulp.task("apps-scripts", ["apps-partials"], function() {
	return gulp.src(buildPathArray(paths.build.source, lists.apps.build))
		.pipe(foreach(function(stream, file) {
			var pathArray = file.path.split("/");
			pathArray.pop();
			var basename = pathArray.pop();
			
			var bundler = new browserify(options.browserify);
			bundler.add(file.path);
			bundler.external("moment");

			return bundler
				.bundle()
				.pipe(source(basename + ".min.js"))
				.pipe(buffer())
				.pipe(inject.after("gulpBuildConfig = {", "version: '" + package.version + "', builddate: new Date(" + new Date().getTime() + ")"))
				.pipe(sourcemaps.init({loadMaps: true}))
				.pipe(gulpif(compress, uglify(options.uglify)))
				.pipe(sourcemaps.write("../maps"))
				.pipe(gulp.dest(paths.build.target + "js/"));
		}))
});

// Compile main scripts
gulp.task("main-scripts", function() {
	var bundler = new browserify(options.browserify);

	bundler.add(lists.main.build[0]);

	return bundler
		.bundle()
		.pipe(source("main.min.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(gulpif(compress, uglify(options.uglify)))
		.pipe(sourcemaps.write("../maps"))
		.pipe(gulp.dest(paths.build.target + "js/"));
});


// Main release build chain
gulp.task("build", gulpsync.sync(["copyfrom", "css", ["main-scripts", "apps-scripts"], "copyto"], "sync release"));
// Uncompressed release build chain
gulp.task("dev", gulpsync.sync(["uncompressed", "build"], "sync dev"));
gulp.task("build-dev", ["dev"]);

// Main only build chain
gulp.task("main", gulpsync.sync(["copyfrom", "main-scripts", "copyto"], "sync main"));
// Less only build chain
gulp.task("less", gulpsync.sync(["copyfrom", "css", "copyto"], "sync css"));
// App scripts only build chain
gulp.task("apps", gulpsync.sync(["uncompressed", "copyfrom", "apps-scripts", "copyto"], "sync apps"));

// Watch files and trigger minimal builds
gulp.task("watch", function() {
	gulp.watch(buildPathArray(paths.static.source, lists.css.watch), ["less"]);
	gulp.watch(buildPathArray(paths.static.source, lists.main.watch), ["main"]);
	gulp.watch(buildPathArray(paths.static.source, lists.apps.watch), ["apps"]);
});

// Present help info
gulp.task("help", function() {
	console.log("options:\nbuild - standard build\ndev - unminified build\nless - only build CSS files\nmain - only build main bundle\napp - only build app bundles\nwatch - build on changes");
});

// Default build task
gulp.task("default", ["build"]);
