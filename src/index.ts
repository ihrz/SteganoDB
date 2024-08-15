import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const steggy = require('steggy-noencrypt');

const setNestedProperty = (object: any, key: string, value: any) => {
    const properties = key.split('.');
    let currentObject = object;

    for (let i = 0; i < properties.length - 1; i++) {
        const property = properties[i];

        if (typeof currentObject[property] !== 'object' || currentObject[property] === null) {
            currentObject[property] = {};
        }

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

    constructor(filePath?: string, options?: any, data?: any, currentTable: string = "json") {
        this.pngFilePath = filePath || "./steganodb.png";
        this.options = options || {};
        this.currentTable = currentTable;
        this.data = data || { json: {} };

        if (!data) {
            if (!existsSync(this.pngFilePath)) {
                // Init the database with a real image if it doesn't exist
                writeFileSync(this.pngFilePath, readFileSync(__dirname + "/../src/picture/default.png"));
            } else {
                this.fetchDataFromImage();
            }
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

    private updateNestedProperty(
        key: string,
        operation: 'get' | 'set' | 'add' | 'sub' | 'delete',
        value?: any
    ) {
        const currentValue = getNestedProperty(this.getCurrentTableData(), key);

        switch (operation) {
            case 'get':
                return currentValue;

            case 'set':
                setNestedProperty(this.getCurrentTableData(), key, value);
                this.saveDataToFile();
                break;

            case 'add':
                if (typeof currentValue !== 'number' && currentValue !== undefined && currentValue !== null) {
                    throw new TypeError("The existing value is not a number.");
                }
                const newValue = (currentValue || 0) + value;
                setNestedProperty(this.getCurrentTableData(), key, newValue);
                this.saveDataToFile();
                break;

            case 'sub':
                if (typeof currentValue !== 'number' && currentValue !== undefined && currentValue !== null) {
                    throw new TypeError("The existing value is not a number.");
                }
                const subValue = (currentValue || 0) - value;
                setNestedProperty(this.getCurrentTableData(), key, subValue);
                this.saveDataToFile();
                break;

            case 'delete':
                const properties = key.split('.');
                let currentObject = this.getCurrentTableData();

                for (let i = 0; i < properties.length - 1; i++) {
                    const property = properties[i];

                    if (!currentObject[property]) {
                        return;
                    }

                    currentObject = currentObject[property];
                }

                delete currentObject[properties[properties.length - 1]];
                this.saveDataToFile();
                break;
        }
    }

    private saveDataToFile() {
        const original = readFileSync(this.pngFilePath);
        const concealed = steggy.conceal(original, JSON.stringify(this.data, null, 2));
        writeFileSync(this.pngFilePath, concealed);
    }

    public table(tableName: string) {
        if (!this.data[tableName]) {
            this.data[tableName] = {};
        }
        return new SteganoDB(this.pngFilePath, this.options, this.data, tableName);
    }

    private getCurrentTableData() {
        if (!this.data[this.currentTable]) {
            this.data[this.currentTable] = {};
        }
        return this.data[this.currentTable];
    }

    public get(key: string) {
        return this.updateNestedProperty(key, 'get');
    }

    public set(key: string, value: any) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        return this.updateNestedProperty(key, 'set', value);
    }

    public add(key: string, count: number) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        if (isNaN(count)) {
            throw new SyntaxError("The value is NaN.");
        }

        this.updateNestedProperty(key, 'add', count);
    }

    public sub(key: string, count: number) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        if (isNaN(count)) {
            throw new SyntaxError("The value is NaN.");
        }

        this.updateNestedProperty(key, 'sub', count);
    }

    public delete(key: string) {
        this.updateNestedProperty(key, 'delete');
    }

    public cache(key: string, value: any, time: number) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }

        if (!time || isNaN(time)) {
            throw new SyntaxError("The time needs to be a number. (ms)");
        }

        this.updateNestedProperty(key, 'set', value);

        setTimeout(() => {
            this.updateNestedProperty(key, 'delete');
        }, time);
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

    public has(key: string) {
        return Boolean(getNestedProperty(this.getCurrentTableData(), key));
    }

    public deleteAll() {
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