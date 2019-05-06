export default class AuthentificationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthentificationError";
        this.message = message;
    }
}
