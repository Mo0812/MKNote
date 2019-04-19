export default {
    processFileUpload(file) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = function() {
                const blob = reader.result;
                resolve(blob);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
};
