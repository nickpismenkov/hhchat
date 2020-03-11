import * as $ from "jquery";

export default class Helpers {

    static timeCoefficient = 1;

    private static _generatedIds: any = [];
    static generateId(length: number = 7):string {
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            out = '';
        for(let i=0, clen=chars.length; i<length; i++){
            out += chars.substr(0|Math.random() * clen, 1);
        }
        return Helpers._generatedIds[out] ? Helpers.generateId(length) : (Helpers._generatedIds[out] = out);
    }

    static wait(time: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, time*1000*Helpers.timeCoefficient);
        });
    }

    static waitFor (selector: string, root: HTMLElement | HTMLDocument) {
        return new Promise((resolve) => {
            let resolved = false;
            let element = $(selector, root).get(0);

            if (element) {
                resolve(element);
            } else {
                let observer = new MutationObserver(function () {
                    if (resolved === false ) {
                        element = $(selector, root).get(0);
                        if (element) {
                            resolve(element);
                            observer.disconnect();
                            resolved = true;
                        }
                    }
                });

                observer.observe(root, {
                    childList: true,
                    subtree: true,
                });
            }
        });
    };

    static uniqueBy(a: any[], cond: (o1: any, o2: any) => boolean) {
        return a.filter((e, i) => a.findIndex(e2 => cond(e, e2)) === i);
    }

    /**
     * Shuffles array in place. ES6 version
     * @param {Array} a items An array containing the items.
     */
    static shuffleArray(a: any[]) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    static spin(text: string) {
        if (text.indexOf("\n") > -1) {
            text = "{" + text.split("\n").join("|") + "}";
        }
        let parts: string[] = [];
        let part = "";
        let level = 0;
        for (let i = 0; i < text.length; i++) {
            switch (text[i]) {
                case "{":
                    level++;
                    if (level == 1) {
                        parts.push(part);
                        part = "";
                    } else {
                        part += text[i];
                    }
                    break;
                case "}":
                    level--;
                    if (level == 0) {
                        parts.push(part);
                        part = "";
                    } else {
                        part += text[i];
                    }
                    break;
                default:
                    part += text[i];
                    break;
            }
        }
        parts.push(part);
        let newText = parts.map(function (val) {
            if (val.indexOf("{") > -1) {
                val = Helpers.spin(val);
            }
            let spl = val.split("|");
            return spl[Helpers.randomIntFromInterval(0, spl.length - 1)];
        }).join("");
        return newText;
    }

    spin2(text: string) {
        var matches, options, random;
        var regEx = new RegExp(/{([^{}]+?)}/);
        let parts: any[] = [];
        while ((matches = regEx.exec(text)) !== null) {
            options = matches[1].split("|");
            options.forEach((part) => {
                parts.push(this.spin2(part));
            })
        }
        return text;
    }

    // {one|{two|three}}
    static getAllBySpin(text: string): any[] {
        if (text.indexOf("\n") > -1) {
            text = "{" + text.split("\n").join("|") + "}";
        }
        let parts: any[] = [];
        let part = "";
        let level = 0;
        for (let i = 0; i < text.length; i++) {
            switch (text[i]) {
                case "{":
                    level++;
                    if (level == 1) {
                        parts.push(part);
                        part = "";
                    } else {
                        part += text[i];
                    }
                    break;
                case "}":
                    level--;
                    if (level == 0) {
                        parts.push(part);
                        part = "";
                    } else {
                        part += text[i];
                    }
                    break;
                default:
                    part += text[i];
                    break;
            }
        }
        parts.push(part);
        let newParts = parts.map(function (val) {
            if (val.indexOf("{") > -1) {
                val = Helpers.spin(val);
            }
            let spl = val.split("|");
            return spl;
        });
        return newParts;
    }

    static randomIntFromInterval(min: number, max: number)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
}