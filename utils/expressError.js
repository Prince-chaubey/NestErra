class expressError extends Error {
    constructor(status, message) {
        super(message); // Pass the message to the Error constructor
        this.status = status;
    }
}

module.exports = expressError;