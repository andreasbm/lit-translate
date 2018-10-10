const path = require("path");
const {defaultExtensions, defaultRules, defaultLitHTMLMinifierConfig} = require("./node_modules/@appnest/web-config/create-webpack-config");

const folderPath = {
	DIST: path.resolve(__dirname, "dist")
};

const webpackConfig = {
	context: path.resolve(__dirname),
	// Work around for empty entry: https://github.com/webpack-contrib/karma-webpack/issues/193
	entry: function () {
		return {}
	},
	// Work around for Webpack 4 compatibility issues: https://github.com/webpack-contrib/karma-webpack/issues/322
	optimization: {
		splitChunks: false,
		runtimeChunk: false,
		minimize: false,
		removeEmptyChunks: false,
		mergeDuplicateChunks: false,
		concatenateModules: false
	},
	output: {
		path: folderPath.DIST
	},
	resolve: {
		extensions: defaultExtensions()
	},
	module: {
		rules: defaultRules(defaultLitHTMLMinifierConfig())
	}
};

module.exports = function (config) {
	const configuration = {
		basePath: "",
		frameworks: ["mocha", "chai"],
		plugins: [
			"karma-mocha",
			"karma-chai",
			"karma-webpack",
			"karma-firefox-launcher",
			"karma-chrome-launcher",
			"karma-safari-launcher"
		],
		files: [
			"src/test/test.js"
		],
		preprocessors: {
			"src/test/test.js": ["webpack"]
		},
		reporters: ["progress"],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ["Chrome"],
		singleRun: true,
		concurrency: Infinity,
		customLaunchers: {
			DockerChrome: {
				base: "Chrome",
				flags: ["--no-sandbox"]
			}
		},
		webpack: webpackConfig,
		webpackMiddleware: {
			noInfo: true,
			stats: {
				chunks: false,
				modules: false,
				chunkModules: false,
				color: true
			}
		}
	};

	if (process.env.INSIDE_DOCKER) {
		configuration.browsers = ["DockerChrome"];
	}

	config.set(configuration);
};