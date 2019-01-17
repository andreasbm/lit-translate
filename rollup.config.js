import path from "path";
import pkg from "./package.json";
import {
	defaultExternals,
	defaultOutputConfig,
	defaultPlugins,
	defaultProdPlugins,
	defaultServePlugins,
	isLibrary,
	isProd,
	isServe
} from "@appnest/web-config";

const folders = {
	dist: path.resolve(__dirname, "dist"),
	src: path.resolve(__dirname, "src/demo"),
	src_assets: path.resolve(__dirname, "src/demo/assets"),
	dist_assets: path.resolve(__dirname, "dist/assets")
};

const files = {
	main: path.join(folders.src, "main.ts"),
	src_index: path.join(folders.src, "index.html"),
	dist_index: path.join(folders.dist, "index.html")
};

export default {
	input: {
		main: files.main
	},
	output: [
		defaultOutputConfig({
			format: "esm",
			dir: folders.dist
		})
	],
	plugins: [
		...defaultPlugins({
			cleanerConfig: {
				targets: [
					folders.dist
				]
			},
			copyConfig: {
				resources: [[folders.src_assets, folders.dist_assets]],
			},
			htmlTemplateConfig: {
				template: files.src_index,
				target: files.dist_index,
				include: /main(-.*)?\.js$/
			},
			importStylesConfig: {
				globals: ["global.scss"]
			}
		}),

		// Serve
		...(isServe ? [
			...defaultServePlugins({
				serveConfig: {
					port: 1338,
					contentBase: folders.dist
				},
				livereloadConfig: {
					watch: folders.dist
				}
			})
		] : []),

		// Production
		...(isProd ? [
			...defaultProdPlugins({
				dist: folders.dist,
				minifyLitHtmlConfig: {
					verbose: false
				},
				visualizerConfig: {
					filename: path.join(folders.dist, "stats.html")
				},
				licenseConfig: {
					thirdParty: {
						output: path.join(folders.dist, "licenses.txt")
					}
				}
			})
		] : [])
	],
	external: [
		...(isLibrary ? [
			...defaultExternals(pkg)
		] : [])
	],
	treeshake: isProd,
	context: "window"
}
