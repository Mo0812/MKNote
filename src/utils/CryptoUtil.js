import CryptoJS from "crypto-js";
import store from "@/store";

export default {
    encryptString(str) {
        return CryptoJS.AES.encrypt(str, this._getSecret()).toString();
    },
    decryptString(str, secret = null) {
        if (secret === null) {
            secret = this._getSecret();
        }
        const bytes = CryptoJS.AES.decrypt(str, secret);
        return bytes.toString(CryptoJS.enc.Utf8);
    },
    _getSecret() {
        const security = store.getters.getSecurity;
        return security.secret;
    },
    hashString(str) {
        const hash = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
        return hash;
    }
};
