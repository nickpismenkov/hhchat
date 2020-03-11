import {BrowserStorage} from "./BrowserStorage";

export class Logger {

    static log(message: any) {
        console.log(message);
    }

    static group(message: any) {
        console.group(message);
    }

    static ungroup() {
        console.groupEnd();
    }

    static debug(message: string) {
        console.warn(message);
    }

    static error(message: string) {
        console.error(message);
    }

    static async logError(message: string) {
        let data = await BrowserStorage.loadTyped<string[]>("errorLog");
        if (!data) {
            data = [];
        }
        data.push(message);
        await BrowserStorage.save("errorLog", data);
    }

    static async logAction(entry: ActionLogEntry) {
        let str = `| ${entry.type}`;
        for (let index in entry.data) {
            str += `\n| ${index}=${entry.data[index]}`;
        }
        console.log(str);
        let data = await BrowserStorage.loadTyped<ActionLogEntry[]>("actionLog");
        if (!data) {
            data = [];
        }
        data.push(entry);
        await BrowserStorage.save("actionLog", data);
    }
}

export interface ActionLogEntry {
    taskId?: string;
    time?: number;
    type: string;
    id: string;
    data?: any;
}