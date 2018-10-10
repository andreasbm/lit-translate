const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {CreateWebpackConfig, defaultDevServerConfig} = require("./node_modules/@appnest/web-config/create-webpack-config");

const folderPath = {
	SRC: path.resolve(__dirname, "src/demo"),
	SRC_ASSETS: path.resolve(__dirname, "src/demo/assets"),
	DIST: path.resolve(__dirname, "dist"),
	DIST_ASSETS: path.resolve(__dirname, "dist/assets")
};

const fileName = {
	MAIN: "./main.ts",
	POLYFILLS: "./polyfills.js",
	MANIFEST: "./manifest.json",
	INDEX_HTML: "./index.html"
};

const devServer = defaultDevServerConfig(folderPath.DIST);
devServer.port = "1338";

module.exports = CreateWebpackConfig({
	context: folderPath.SRC,
	indexTemplate: fileName.INDEX_HTML,
	outputFolder: folderPath.DIST,
	devServer,
	entry: {
		"polyfills": fileName.POLYFILLS,
		"main": fileName.MAIN
	},
	output: {
		path: folderPath.DIST,
		filename: "[name].[hash].js"
	},
	plugins: [
		new CopyWebpackPlugin([{
			from: folderPath.SRC_ASSETS,
			to: folderPath.DIST_ASSETS
		}, {
			from: path.join(folderPath.SRC, fileName.MANIFEST),
			to: path.join(folderPath.DIST, fileName.MANIFEST)
		}])
	],
	prodPlugins: [
		new CopyWebpackPlugin([])
	]
});

