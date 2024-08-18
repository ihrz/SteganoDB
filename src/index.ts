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

export interface MainClassOptions {
    driver: "png" | "json"; // Soon (mp3)
    filePath: string;
    data?: any;
    currentTable?: string;
};

class SteganoDB {
    private filePath: string;
    private options: MainClassOptions;
    private data: any;
    private currentTable: string;

    constructor(options: MainClassOptions | string = "./steganodb.png") {
        if (typeof options === "string") {
            this.filePath = options;
            this.options = { filePath: options, driver: "png" };
            this.data = { json: {} };
            this.currentTable = "json";
        } else {
            this.filePath = options.filePath || "./steganodb.png";
            this.options = options;
            this.data = options.data || { json: {} };
            this.currentTable = options.currentTable || "json";
        }

        if (!existsSync(this.filePath)) {
            if (this.options.driver === "png") {
                // Init the database with a real image if it doesn't exist
                writeFileSync(this.filePath, readFileSync(__dirname + "/../src/picture/default.png"));
            } else if (this.options.driver === "json") {
                // Init the database with an empty JSON if it doesn't exist
                writeFileSync(this.filePath, JSON.stringify(this.data));
            }
        } else {
            this.fetchDataFromFile();
        }
    }

    private fetchDataFromFile() {
        try {
            if (this.options.driver === "png") {
                const image = readFileSync(this.filePath);
                const revealed = steggy.reveal(image);
                this.data = JSON.parse(revealed.toString());
            } else if (this.options.driver === "json") {
                const content = readFileSync(this.filePath, 'utf8');
                this.data = JSON.parse(content);
            }
        } catch (error) {
            this.data = { json: {} };
        }
    }

    private saveDataToFile() {
        if (this.options.driver === "png") {
            const original = readFileSync(this.filePath);
            const concealed = steggy.conceal(original, JSON.stringify(this.data, null, 2));
            writeFileSync(this.filePath, concealed);
        } else if (this.options.driver === "json") {
            writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
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

    public table(tableName: string) {
        if (!this.data[tableName]) {
            this.data[tableName] = {};
        }
        return new SteganoDB(this.options);
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