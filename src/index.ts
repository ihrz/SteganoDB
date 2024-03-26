import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const steggy = require('steggy-noencrypt')

const setNestedProperty = (object: any, key: string, value: any) => {
    const properties = key.split('.');
    let currentObject = object;

    for (let i = 0; i < properties.length - 1; i++) {
        const property = properties[i];
        currentObject[property] = currentObject[property] || {};
        currentObject = currentObject[property];
    }

    currentObject[properties[properties.length - 1]] = value;
};


const getNestedProperty = (object: any, key: string) => {
    const properties = key.split('.');
    let index = 0;

    for (; index < properties.length; ++index) {
        object = object && object[properties[index]];
    }

    return object;
};

class SteganoDB {
    private pngFilePath: string;
    private options: any;
    private data: any;

    constructor(filePath?: string, options?: any) {
        this.pngFilePath = filePath || "./steganodb.png";
        this.options = options || {};

        this.data = {};

        if (!existsSync(this.pngFilePath)) {
            writeFileSync(this.pngFilePath, readFileSync(__dirname + "/../src/picture/default.png"));
        } else {
            this.fetchDataFromImage();
        }
    }

    private fetchDataFromImage() {
        try {
            const image = readFileSync(this.pngFilePath)

            const revealed = steggy.reveal(image)
            this.data = JSON.parse(revealed.toString());
        } catch (error) {
            this.data = {}
        }
    }

    private saveDataToFile() {
        const original = readFileSync(this.pngFilePath);
        const concealed = steggy.conceal(original, JSON.stringify(this.data, null, 2))
        writeFileSync(this.pngFilePath, concealed)
    };

    public table(tableName: string) {
        const tableFilePath = path.join(
            path.dirname(this.pngFilePath),
            `${path.basename(this.pngFilePath, path.extname(this.pngFilePath))}_table_${tableName}.png`
        );

        return new SteganoDB(tableFilePath, this.options);
    };

    public get(key: string) {
        return getNestedProperty(this.data, key);
    }

    public has(key: string) {
        return Boolean(getNestedProperty(this.data, key));
    }

    public set(key: string, value: any) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        setNestedProperty(this.data, key, value);
        this.saveDataToFile();
    }

    public delete(key: string) {
        delete this.data[key];
        this.saveDataToFile();
    }

    public cache(key: string, value: any, time: number) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        if (!time || isNaN(time)) {
            throw new SyntaxError("The time needs to be a number. (ms)");
        };

        setNestedProperty(this.data, key, value);
        this.saveDataToFile();

        setTimeout(() => {
            delete this.data[key];
        }, time);
    }

    public add(key: string, count: number) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        if (isNaN(count)) {
            throw new SyntaxError("The value is NaN.");
        }

        if (!this.data[key]) {
            this.data[key] = 0;
        }

        this.data[key] += count;
        this.saveDataToFile();
    }

    public sub(key: string, count: number) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        if (isNaN(count)) {
            throw new SyntaxError("The value is NaN.");
        }

        if (!this.data[key]) {
            this.data[key] = 0;
        }

        this.data[key] -= count;
        this.saveDataToFile();
    }

    public push(key: string, element: any) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        const keys = key.split('.');
        const nestedKey = keys.pop();

        let currentObject = this.data;

        for (const currentKey of keys) {
            if (!currentObject[currentKey]) {
                currentObject[currentKey] = {};
            }
            currentObject = currentObject[currentKey];
        }

        if (!Array.isArray(currentObject[nestedKey])) {
            currentObject[nestedKey] = [];
        }

        currentObject[nestedKey].push(element);

        this.saveDataToFile();
    }

    public clear() {
        this.data = {};
        this.saveDataToFile();
    }

    public all() {
        return Object.keys(this.data).map((key) => {
            return {
                key,
                data: this.data[key],
            };
        });
    }
}

export { SteganoDB };