import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const steggy = require('steggy-noencrypt');

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
    private currentTable: string;

    constructor(filePath?: string, options?: any) {
        this.pngFilePath = filePath || "./steganodb.png";
        this.options = options || {};

        this.currentTable = "json";
        this.data = { json: {} };

        if (!existsSync(this.pngFilePath)) {
            // Init the database with a real image if it doesn't exist
            writeFileSync(this.pngFilePath, readFileSync(__dirname + "/../src/picture/default.png"));
        } else {
            this.fetchDataFromImage();
        }
    }

    private fetchDataFromImage() {
        try {
            const image = readFileSync(this.pngFilePath);
            const revealed = steggy.reveal(image);
            this.data = JSON.parse(revealed.toString());
        } catch (error) {
            this.data = { json: {} };
        }
    }

    private saveDataToFile() {
        const original = readFileSync(this.pngFilePath);
        const concealed = steggy.conceal(original, JSON.stringify(this.data, null, 2));
        writeFileSync(this.pngFilePath, concealed);
    }

    public table(tableName: string) {
        return new SteganoDB(this.pngFilePath, { ...this.options, currentTable: tableName, data: this.data });
    }

    private getCurrentTableData() {
        if (!this.data[this.currentTable]) {
            this.data[this.currentTable] = {};
        }
        return this.data[this.currentTable];
    }

    public get(key: string) {
        return getNestedProperty(this.getCurrentTableData(), key);
    }

    public has(key: string) {
        return Boolean(getNestedProperty(this.getCurrentTableData(), key));
    }

    public set(key: string, value: any) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        setNestedProperty(this.getCurrentTableData(), key, value);
        this.saveDataToFile();
    }

    public delete(key: string) {
        delete this.getCurrentTableData()[key];
        this.saveDataToFile();
    }

    public cache(key: string, value: any, time: number) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        if (!time || isNaN(time)) {
            throw new SyntaxError("The time needs to be a number. (ms)");
        }

        setNestedProperty(this.getCurrentTableData(), key, value);
        this.saveDataToFile();

        setTimeout(() => {
            delete this.getCurrentTableData()[key];
            this.saveDataToFile();
        }, time);
    }

    public add(key: string, count: number) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        if (isNaN(count)) {
            throw new SyntaxError("The value is NaN.");
        }

        if (!this.getCurrentTableData()[key]) {
            this.getCurrentTableData()[key] = 0;
        }

        this.getCurrentTableData()[key] += count;
        this.saveDataToFile();
    }

    public sub(key: string, count: number) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        if (isNaN(count)) {
            throw new SyntaxError("The value is NaN.");
        }

        if (!this.getCurrentTableData()[key]) {
            this.getCurrentTableData()[key] = 0;
        }

        this.getCurrentTableData()[key] -= count;
        this.saveDataToFile();
    }

    public push(key: string, element: any) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        const keys = key.split('.');
        const nestedKey = keys.pop();

        let currentObject = this.getCurrentTableData();

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
        this.data[this.currentTable] = {};
        this.saveDataToFile();
    }

    public all() {
        return Object.keys(this.getCurrentTableData()).map((id) => {
            return {
                id,
                value: this.getCurrentTableData()[id],
            };
        });
    }
}

export { SteganoDB };