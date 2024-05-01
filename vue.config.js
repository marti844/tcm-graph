const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 8080,
    https: false,
  },
});