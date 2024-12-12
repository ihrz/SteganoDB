# SteganoDB

**SteganoDB** is a lightweight TypeScript library that allows you to store and retrieve data within images using steganography. It lets you embed JSON data into images, providing a creative and secure way to store sensitive information or configurations.

## Features

-   **Simple Interface**: Easy-to-use methods to set, get, and manage data within images.
-   **TypeScript Support**: Written in TypeScript but compatible with both TypeScript and JavaScript projects.
-   **Steganography**: Uses steganography techniques to hide data within images.
-   **Data Concealment**: Supports hiding JSON data within images without encryption for quick retrieval.
-   **Flexible Use**: Suitable for various applications, including storing configurations, sensitive data, or small datasets.

## Installation

You can install SteganoDB via npm:

```bash
# Install with npm
npm install stegano.db

# Install with yarn
yarn add stegano.db

# Install with bun
bun i stegano.db
```

## Usage

```js
const { SteganoDB } = require('stegano.db');

const db = new SteganoDB('./default.png');

const PlayerOne = {
    nickname: 'Kisakay',
    team: 'red',
    areMod: false
};

const PlayerTwo = {
    nickname: 'Sown',
    team: 'red',
    areMod: false
};

db.push('server.players', PlayerOne);
db.push('server.players', PlayerTwo);

console.log(db.get('server.players'));
/*
[
  {
    nickname: "Kisakay",
    team: "red",
    areMod: false,
  }, {
    nickname: "Sown",
    team: "red",
    areMod: false,
  }
]
*/

db.set('server.info', {
    server_name: "Kisakay's Server",
    slot: 3,
    map: 'dust2'
});

console.log(db.get('server'));
/*
{
  players: [
    {
      nickname: "Kisakay",
      team: "red",
      areMod: false,
    }, {
      nickname: "Sown",
      team: "red",
      areMod: false,
    }
  ],
  info: {
    server_name: "Kisakay's Server",
    slot: 3,
    map: "dust2",
  },
}
*/

console.log(db.get('server.info'));
/*
{
    server_name: "Kisakay's Server",
    slot: 3,
    map: "dust2",
}
*/

db.add('server.info.slot', 10);
// Server's slot is now at Current + 10 (3+10) : 13

db.sub('server.info.slot', 2);
// Server's slot is now at Current - 2 (13-2) : 11

db.deleteAll();
// Entirely clear the database !!

db.cache('server.info.lock', true, 3000);
// Lock the server access for 3000 ms; (Erase the value after the time's up)

console.log(db.all());
// Return the entire database

console.log(db.has('server.info.lock'));
// Return true if the value exists else return false

db.delete('server');
// Remove the object/value

db.table('anticheat');
// Create another table
```

## Methods

### `constructor(filePath?: string, options?: any)`

Initializes a new instance of the SteganoDB class.

-   `filePath`: Optional. The path to the image file used for storing data. Defaults to `./steganodb.png`.
-   `options`: Optional. Additional options for the database.

### `table(tableName: string): SteganoDB`

Creates and returns a new SteganoDB instance for a specified table.

-   `tableName`: The name of the table to create.

### `get(key: string): any`

Retrieves the value associated with the specified key.

-   `key`: The key whose value should be retrieved. Supports nested keys using dot notation.

### `has(key: string): boolean`

Checks if a value exists for the specified key.

-   `key`: The key to check for existence. Supports nested keys using dot notation.

### `set(key: string, value: any): void`

Sets the value for the specified key.

-   `key`: The key to set the value for. Supports nested keys using dot notation. The key cannot be null or contain spaces.
-   `value`: The value to set.

### `delete(key: string): void`

Deletes the value associated with the specified key.

-   `key`: The key whose value should be deleted. Supports nested keys using dot notation.

### `cache(key: string, value: any, time: number): void`

Sets a temporary value for the specified key that will be automatically deleted after the specified time.

-   `key`: The key to set the temporary value for. Supports nested keys using dot notation. The key cannot be null or contain spaces.
-   `value`: The value to set.
-   `time`: The time in milliseconds after which the value should be deleted. Must be a number.

### `add(key: string, count: number): void`

Increments the value of the specified key by the specified count. If the key does not exist, it will be initialized to 0 before incrementing.

-   `key`: The key whose value should be incremented. Supports nested keys using dot notation. The key cannot be null or contain spaces.
-   `count`: The number to increment the value by. Must be a number.

### `sub(key: string, count: number): void`

Decrements the value of the specified key by the specified count. If the key does not exist, it will be initialized to 0 before decrementing.

-   `key`: The key whose value should be decremented. Supports nested keys using dot notation. The key cannot be null or contain spaces.
-   `count`: The number to decrement the value by. Must be a number.

### `push(key: string, element: any): void`

Pushes an element to an array associated with the specified key. If the key does not exist, an array will be created.

-   `key`: The key whose array should be appended to. Supports nested keys using dot notation. The key cannot be null or contain spaces.
-   `element`: The element to push into the array.

### `deleteAll(): void`

Clears all data in the database.

### `all(): Array<{ id: string, value: any }>`

Returns an array of all key-value pairs in the database.

### `pull(key: string, element: any): void`

Pull an element of an array associated with the specified key


## Creators

-   [Kisakay](https://github.com/Kisakay) (Anaïs)
