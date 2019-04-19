import Jimp from "jimp";

export default {
    async processUploadImage(blob, mime) {
        const image = await Jimp.read(blob);
        image.resize(1200, Jimp.AUTO);
        image.quality(60);
        return image.getBufferAsync(mime);
    }
};
