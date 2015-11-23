/******************************************************************************************

Angular Services for use in common apps

******************************************************************************************/

var app = angular.module("alchemytec.services", []);

// Error box service
app.factory("errorbox", [ function() {
	
	return {
		confirm: function(message, callback) {
			$.popuperror({ message: message, canceltext: "cancel", callback: callback });
		},
		choice: function(message, textokay, textcancel, callbackokay, callbackcancel) {
			$.popuperror({ message: message, submittext: textokay, canceltext: textcancel, callback: callbackokay, cancelcallback: callbackcancel });
		},
		alert: function(message) {
			$.popuperror({ message: message });
		}
	};
}]);


// REST API service
// Usage: $restalchemy.at("vacancies", 23).get().then(callback).error(callback);
//	Makes a get request on the /vacancies/23 endpoint, calling one of two callbacks depending on success or failure
// Usage: var rest = $restalchemy.set("root", "/api");
//		rest.at("vacancies", 23, "lines").get().then(callback);
//	Makes a get request on /api/vacancies/23/lines endpoint
app.factory("restalchemy", [ "$rootScope", "$http", "$q", "$timeout", function($rootScope, $http, $q, $timeout) {
	
	// Get request with built in retry and error handling
	var httpGet = function($this, params) {
		$http.get($this.endpoint, { params: params, cache: false, responseType: "json", timeout: $this.config.timeout }).success(function(data, status, headers, config) {
			if (data._items)
				var items = data._items;
			else
				var items = data;
			
			if (data._info) {
				for (var key in data._info)
					items[key] = data._info[key];
			}
			
			if ($this.config.success)
				$this.config.success(items, status);
		}).error(function(data, status, headers, config) {
			// If status could be temporary, try again the right number of times
			if ((status >= 500) && ($this.attempt < $this.config.retries)) {
				$this.attempt++;
				
				$timeout(function() {
					httpGet($this, params);
				}, $this.config.delay);
			}
			else if ((status == 401) && ($this.config.authenticate)) {
				$this.config.authenticate(function() {
					httpGet($this, params);
				}, function() {
					if ($this.config.error)
						$this.config.error(data, status);
				});
			}
			else if ($this.config.error)
				if ($this.config.error)
					$this.config.error(data, status);
		});
	};
	
	// Post request with built in retry and error handling
	var httpPost = function($this, postdata, params) {
		$http.post($this.endpoint, postdata, { params: params, responseType: "json", timeout: $this.config.timeout }).success(function(data, status, headers, config) {
			if ($this.config.success)
				$this.config.success(data, status);
		}).error(function(data, status, headers, config) {
			// If status could be temporary, try again the right number of times
			if ((status >= 500) && ($this.attempt < $this.config.retries)) {
				$this.attempt++;
				
				$timeout(function() {
					httpPost($this, postdata, params);
				}, $this.config.delay);
			}
			else if ((status == 401) && ($this.config.authenticate)) {
				$this.config.authenticate(function() {
					httpPost($this, postdata, params);
				}, function() {
					if ($this.config.error)
						$this.config.error(data, status);
				});
			}
			else if ($this.config.error)
				if ($this.config.error)				
					$this.config.error(data, status);
		});
	};
	
	// Put request with built in retry and error handling
	var httpPut = function($this, putdata, params) {
		$http.put($this.endpoint, putdata, { params: params, responseType: "json", timeout: $this.config.timeout }).success(function(data, status, headers, config) {
			if ($this.config.success)
				$this.config.success(data, status);
		}).error(function(data, status, headers, config) {
			// If status could be temporary, try again the right number of times
			if ((status >= 500) && ($this.attempt < $this.config.retries)) {
				$this.attempt++;
				
				$timeout(function() {
					httpPut($this, putdata, params);
				}, $this.config.delay);
			}
			else if ((status == 401) && ($this.config.authenticate)) {
				$this.config.authenticate(function() {
					httpPut($this, putdata, params);
				}, function() {
					if ($this.config.error)
						$this.config.error(data, status);
				});
			}
			else if ($this.config.error)
				if ($this.config.error)
					$this.config.error(data, status);
		});
	};
	
	// Delete request with built in retry and error handling
	var httpDelete = function($this, params) {
		$http.delete($this.endpoint, { params: params, responseType: "json", timeout: $this.config.timeout }).success(function(data, status, headers, config) {
			if ($this.config.success)
				$this.config.success(data, status);
		}).error(function(data, status, headers, config) {
			// If status could be temporary, try again the right number of times
			if ((status >= 500) && ($this.attempt < $this.config.retries)) {
				$this.attempt++;
				
				$timeout(function() {
					httpDelete($this, params);
				}, $this.config.delay);
			}
			else if ((status == 401) && ($this.config.authenticate)) {
				$this.config.authenticate(function() {
					httpDelete($this, params);
				}, function() {
					if ($this.config.error)
						$this.config.error(data, status);
				});
			}
			else if ($this.config.error)
				if ($this.config.error)
					$this.config.error(data, status);
		});
	};
	
	return {
		// Configuration settings
		config: {
			root: "/",
			retries: 3,
			delay: 500,
			success: null,
			error: null,
			authenticate: null,
			timeout: null
		},
		
		// Current endpoint
		endpoint: null,
		attempt: 0,
		
		// Create a unique copy of this service's settings
		init: function(config) {
			var $this = angular.copy(this);
			
			for (var key in config)
				$this.config[key] = config[key];

			return $this;
		},

		// Add paths to the endpoint
		at: function() {
			// See if this the start of a new call
			if (this.endpoint == null) {
				var $this = angular.copy(this);
				$this.endpoint = this.config.root;
			}
			else
				$this = this;
			
			for (var u = 0; u < arguments.length; u++)
				$this.endpoint = $this.endpoint.replace(/\/?$/, "/") + arguments[u];
			
			return $this;
		},
		
		// Get from the current endpoint
		get: function(params) {
			var $this = this;

			$timeout(function() {
				httpGet($this, params);
			}, 0);
			
			return this;
		},
		
		// Post data to the current endpoint
		post: function(data, params) {
			var $this = this;

			$timeout(function() {
				httpPost($this, data, params);
			}, 0);
			
			return this;
		},
		
		put: function(data, params) {
			var $this = this;

			$timeout(function() {
				httpPut($this, data, params);
			}, 0);
			
			return this;
		},
		
		delete: function() {
			var $this = this;

			$timeout(function() {
				httpDelete($this, params);
			}, 0);
			
			return this;
		},
		
		// Set the success callback, which receives (data, status) params
		then: function(callback) {
			this.config.success = callback;
			
			return this;
		},
		
		// Set the error callback, which receives (data, status) params
		error: function(callback) {
			this.config.error = callback;
			
			return this;
		},
		
		// Set the authentication callback, which receives (authenticated, error) and should call one of them as a callback
		authenticate: function(callback) {
			this.config.authenticate = callback;
			
			return this;
		},
		
		timeout: function(promise) {
			this.config.timeout = promise;
			
			return this;
		}
	};
}]);


// Authentication service
app.factory("authenticator", [ "$rootScope", "$compile", function($rootScope, $compile) {
	var srcLoginFrame = $("meta[name=servlet-context]").attr("content") + "loginFrame.jsp";
	var htmlLogin = angular.element("<iframe fancybox ng-show='authenticatorDialog' id='loginDialog' frameborder='0'></iframe>");
	var successFuncs = [], failureFuncs = [];

	angular.element("body").append(htmlLogin);
	$compile(htmlLogin)($rootScope);
	
	$rootScope.authenticatorDialog = false;
	$rootScope.$on("fancybox-close", function() {
		$rootScope.$broadcast("authenticator-notlogged-in");
	});
	
	$(window).on("message", function(event) {
		switch (event.originalEvent.data) {
			case "logged-in":
				$rootScope.$broadcast("authenticator-logged-in");
				break;
		}
	});
	
	return {
		showlogin: function(success, failure) {
			// Add callbacks to the queue			
			if (success)
				successFuncs.push(success);
			if (failure)
				failureFuncs.push(failure);
				
			// If the dialog is already open, don't open it again
			if ($rootScope.authenticatorDialog)
				return;
			
			// Register our success closing function
			var unregisterLogged = $rootScope.$on("authenticator-logged-in", function() {
				// Remove our listener and hide our dialog
				unregisterLogged();
				$rootScope.$apply(function() {
					$rootScope.authenticatorDialog = false;
				});
				
				// Execute any callbacks now we are logged in
				while (successFuncs.length)
					successFuncs.shift()();
			});
			
			// Register our closing function
			var unregisterNotLogged = $rootScope.$on("authenticator-notlogged-in", function() {
				// Remove our listener and hide our dialog
				unregisterNotLogged();
				$rootScope.$apply(function() {
					$rootScope.authenticatorDialog = false;
				});
				
				// Execute any callbacks now we have given up logging in
				while (failureFuncs.length)
					failureFuncs.shift()();
			});
			
			// Add our iframe source to load and show the popup
			htmlLogin.attr("src", srcLoginFrame);
			$rootScope.authenticatorDialog = true;
		}
	};
}]);
