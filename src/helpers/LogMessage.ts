import * as moment from "moment";

export class LogMessage {
    timestamp: number;
    message: string;
    constructor(message: string, timestamp: number = Date.now()) {
        this.message = message;
        this.timestamp = timestamp;
    }
    toString() {
        return `${moment(this.timestamp).format("DD.MM.YY HH:mm:ss")} ${this.message}`;
    }
}