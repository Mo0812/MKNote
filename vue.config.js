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
    }
};
