process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
    // publicPath: pwd,
    devServer: {
        disableHostCheck: true
    },

    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/assets/scss/_variables.scss";
                    @import "@/assets/scss/_mixins.scss";
                `
            }
        }
    },

    pluginOptions: {
        i18n: {
            locale: "en",
            fallbackLocale: "en",
            localeDir: "locales",
            enableInSFC: true
        }
    },

    pwa: {
        name: "My App",
        themeColor: "#4DBA87",
        msTileColor: "#000000",
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "black",
        // configure the workbox plugin
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: "src/service-worker.js"
            // ...other Workbox options...
        }
    }
};
