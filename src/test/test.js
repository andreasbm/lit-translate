const testsContext = require.context(".", true, /\.test\.ts$/);
testsContext.keys().forEach(testsContext);