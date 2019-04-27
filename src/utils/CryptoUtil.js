import CryptoJS from "crypto-js";

export default {
    encryptString(str) {
        return CryptoJS.AES.encrypt(str, "secret").toString();
    },
    decryptString(str) {
        const bytes = CryptoJS.AES.decrypt(str, "secret");
        return bytes.toString(CryptoJS.enc.Utf8);
    }
};
