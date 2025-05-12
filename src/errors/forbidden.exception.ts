export default class ForbiddenException extends Error {
    statusCode: number;
    message: string;
    constructor(message: string, details: object) {
        super(message);
        this.statusCode = 403;
        this.message = message;
    }
}