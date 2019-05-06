export default class RemoteConnectionError extends Error {
    constructor(message) {
        super(message);
        this.name = "RemoteConnectionError";
        this.message = message;
    }
}
