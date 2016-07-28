events.on("task:handlebars", function(options) {

	var UglifyJS = require("uglify-js");
	var handlebars = require("./res/handlebars-v4.0.5");

	//load all backend/routes
	var globs = new GlobCollection([
		cli.plugins_dirname+"/**/*.hbs",
		cli.plugins_dirname+"/*.hbs",
		"!**/res",
		"!**/root",
		"!**/cfg"
	]);
	var treecontext = new TreeContext({
	    files: true,
	    dirs: true,
	    cache: true
	});
	var tree = treecontext.Tree(".", options.src);
	var modules = tree.mapGlobs(globs);


	var chunks = [];
	var line = 1;

	FileSystem.mkdir(options.build);

	var includes = [];
	var output = "";
	for (var i = 0, l = modules.files.length; i < l; i++) {
		var fileContents = fs.readFileSync(path.join(options.src, modules.files[i].relativeLocation)).toString();
		var name = modules.files[i].relativeLocation;
		name = name.slice(0, name.length-4);
		var javascript = handlebars.precompile(fileContents);
		output+= "plugins.templates[\""+modules.files[i].filename+"\"] = " + javascript + ";\n";
		FileSystem.rm(path.join(options.build, modules.files[i].relativeLocation));
	}

	fs.writeFileSync(path.join(options.build, "_templates.js"), output);

	console.log("Handlebars done.");
	events.emit("task:done", "handlebars");
});


