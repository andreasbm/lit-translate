const {defaultResolvePlugins, defaultKarmaConfig} = require("@appnest/web-config");

module.exports = (config) => {
	config.set({
		...defaultKarmaConfig({
			rollupPlugins: defaultResolvePlugins()
		}),
		basePath: "src/test",
		logLevel: config.LOG_INFO
	});
};