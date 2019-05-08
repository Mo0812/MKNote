export default {
    makeToast(self, title, content, variant = "primary", duration = 5000) {
        self.$bvToast.toast(content, {
            title: title,
            variant: variant,
            duration: duration,
            toaster: "b-toaster-bottom-right"
        });
    }
};
