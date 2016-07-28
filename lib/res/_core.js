(function() {
    var configCallbacks = {count:0, ready:0};
    var startedCallbacks = [];
    var configuredCallbacks = [];
    var isConfigured = false;
    
	window.plugins = {

        flags: {},

        initialize: function() {
            
            plugins.createLink("_plugins");

            plugins.createScript({
                "src": "_templates.js"
            });

            plugins.configured(function() {

                plugins.createScript({
                    "src": "_plugins.js"
                });

                setTimeout(function() {
                    for (var i = 0, l = startedCallbacks.length; i < l; i++) {
                        try {
                            startedCallbacks[i]();
                        } catch(e) {}
                    }
                }, 250);
                
            });
            
            plugins.createScript({
                "src": "_config.js"
            });

        },
        
        config: function(callback) {
        	if (isConfigured) {
        		return;
        	}
            configCallbacks.count++;
            setTimeout(function() {
                callback(function() {
                    configCallbacks.ready = configCallbacks.ready !== undefined ? ++configCallbacks.ready : 1;
                    if (configCallbacks.ready !== configCallbacks.count) return;
                    for (var i = 0, l = configuredCallbacks.length; i < l; i++) {
                        try {
                            configuredCallbacks[i]();
                        } catch(e) {}
                    }
                    isConfigured = true;
                })
            },0);

        },

        configured: function(callback) {
            configuredCallbacks.push(callback);
        },

        started: function(callback) {
        	startedCallbacks.push(callback);
        },

        waitFor: function(test, callback) {
        	var repeater = function() {
	        	setTimeout(function() {
					if (!test()) return repeater();
					callback();
				}, 10);
			};
			repeater();
        },

        createLink: function(attributes) {
            if (attributes instanceof Array) {
                for (var i = 0, l = attributes.length; i < l; i++) {
                    plugins.createLink(attributes[i]);
                }
                return;
            }
        	var style = document.createElement("link");
            switch (typeof attributes) {
            case "string":
                style.setAttribute("href", attributes+".css");
                break;
            case "object":
            	for (var k in attributes) {
            		style.setAttribute(k, attributes[k]);	
            	}
                break;
            }
            style.setAttribute("rel", "stylesheet");
			document.getElementsByTagName("head")[0].appendChild(style);
        },

        createScript: function(attributes, content) {
        	var script = document.createElement("script");
        	for (var k in attributes) {
        		script.setAttribute(k, attributes[k]);	
        	}
        	if (content) script.innerHTML = content;
			document.getElementsByTagName("head")[0].appendChild(script);
        },

        templates: {}

    }; 

    plugins.initialize();

})();