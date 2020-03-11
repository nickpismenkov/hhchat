import Helpers from "./Helpers";

export class BrowserStorage {

    static load(name: string): any {
        return new Promise((resolve) => {
            chrome.storage.local.get(name, (storage) => {
                resolve(storage[name]);
            });
        });
    }

    static observe(name: string, callback: (changes: any) => void): any {
        chrome.storage.onChanged.addListener((changes: any, areaName: string) => {
            if (areaName === "local" && !!changes[name]) {
                callback(changes[name].newValue);
            }
        });
    }

    static loadTyped<T>(name: string): Promise<T>{
        return new Promise<T>(async (resolve, reject) => {
            await chrome.storage.local.get(name, (data: any) => {
                resolve(data[name]);
            });
        });
    }

    static async save(name: string, data: any) {
        return new Promise((resolve) => {
            let tempObj: any = {};
            if (name === null) {
                tempObj = Object.assign({}, data)
            } else {
                tempObj[name] = data;
            }
            chrome.storage.local.set(tempObj, () => {
                resolve();
            });
        });
    }
}