# SteganoDB

**SteganoDB** is a lightweight TypeScript library that allows you to store and retrieve data within images using steganography. It lets you embed JSON data into images, providing a creative and secure way to store sensitive information or configurations.

## Features

- **Simple Interface**: Easy-to-use methods to set, get, and manage data within images.
- **TypeScript Support**: Written in TypeScript but compatible with both TypeScript and JavaScript projects.
- **Steganography**: Uses steganography techniques to hide JSON data within images.
- **Data Concealment**: Supports hiding JSON data within images without encryption for quick retrieval.
- **Flexible Use**: Suitable for various applications, including storing configurations, sensitive data, or small datasets.

## Installation

You can install SteganoDB via npm:

```bash
npm install stegano.db
```

## Usage

```javascript
const { SteganoDB } = require("stegano.db");

const db = new SteganoDB('./default.png');

(async () => {
  await db.initialize();

  await db.push('server.players', {
    nickname: 'Kisakay',
    team: 'red',
    areMod: false,
    inventory: [
      {
        name: 'ak-47',
        ammo: 30,
        damage: {
          head: 70,
          body: 40,
          leg: 10
        }
      }
    ],
  });

  await db.push('server.players', {
    nickname: 'Sown',
    team: 'red',
    areMod: false,
    inventory: [
      {
        name: 'm4a1-s',
        ammo: 30,
        damage: {
          head: 70,
          body: 30,
          leg: 20
        }
      }
    ],
  });

  const players = await db.get('server.players');
  console.log(players);
  /*
  [
    {
      nickname: "Kisakay",
      team: "red",
      areMod: false,
      inventory: [
        [Object ...]
      ],
    }, {
      nickname: "Sown",
      team: "red",
      areMod: false,
      inventory: [
        [Object ...]
      ],
    }
  ]
  */

  await db.set("server.info", {
    server_name: "Kisakay's Server",
    slot: 3,
    map: 'dust2'
  });

  const server = await db.get('server');
  console.log(server);
  /*
  {
    players: [
      {
        nickname: "Kisakay",
        team: "red",
        areMod: false,
        inventory: [
          [Object ...]
        ],
      }, {
        nickname: "Sown",
        team: "red",
        areMod: false,
        inventory: [
          [Object ...]
        ],
      }
    ],
    info: {
      server_name: "Kisakay's Server",
      slot: 3,
      map: "dust2",
    },
  }
  */

  const serverInfo = await db.get('server.info');
  console.log(serverInfo);
  /*
  {
      server_name: "Kisakay's Server",
      slot: 3,
      map: "dust2",
  }
  */

  await db.add('server.info.slot', 10);
  // Server's slot is now at Current + 10 (2+10) : 12

  await db.sub('server.info.slot', 2);
  // Server's slot is now at Current - 2 (12-2) : 10

  await db.clear();
  // Entirely clear the database !!

  await db.cache('server.info.lock', true, 3000);
  // Lock the server access for 3000 ms; (Erase the value after the time's up)

  const allData = await db.all();
  console.log(allData);
  // Return the database

  const hasLock = await db.has('server.info.lock');
  console.log(hasLock);
  // Return true if the value exists

  await db.delete('server');
  // Remove the object/value

  const anticheatTable = db.table('anticheat');
  // Create another table in the current database (png file)
})();
```

## Methods

### `constructor(filePath?: string, options?: any)`

Initializes a new instance of the SteganoDB class.

- `filePath`: Optional. The path to the image file used for storing data. Defaults to `./steganodb.png`.
- `options`: Optional. Additional options for the database.

### `initialize(): Promise<void>`

Initializes the database, creating the file if it does not exist and loading existing data if the file exists.

### `table(tableName: string): SteganoDB`

Creates and returns a new SteganoDB instance for a specified table.

- `tableName`: The name of the table to create.

### `get(key: string): Promise<any>`

Retrieves the value associated with the specified key.

- `key`: The key whose value should be retrieved. Supports nested keys using dot notation.

### `has(key: string): Promise<boolean>`

Checks if a value exists for the specified key.

- `key`: The key to check for existence. Supports nested keys using dot notation.

### `set(key: string, value: any): Promise<void>`

Sets the value for the specified key.

- `key`: The key to set the value for. Supports nested keys using dot notation. The key cannot be null or contain spaces.
- `value`: The value to set.

### `delete(key: string): Promise<void>`

Deletes the value associated with the specified key.

- `key`: The key whose value should be deleted. Supports nested keys using dot notation.

### `cache(key: string, value: any, time: number): Promise<void>`

Sets a temporary value for the specified key that will be automatically deleted after the specified time.

- `key`: The key to set the temporary value for. Supports nested keys using dot notation. The key cannot be null or contain spaces.
- `value`: The value to set.
- `time`: The time in milliseconds after which the value should be deleted. Must be a number.

### `add(key: string, count: number): Promise<void>`

Increments the value of the specified key by the specified count. If the key does not exist, it will be initialized to 0 before incrementing.

- `key`: The key whose value should be incremented. Supports nested keys using dot notation. The key cannot be null or contain spaces.
- `count`: The number to increment the value by. Must be a number.

### `sub(key: string, count: number): Promise<void>`

Decrements the value of the specified key by the specified count. If the key does not exist, it will be initialized to 0 before decrementing.

- `key`: The key whose value should be decremented. Supports nested keys using dot notation. The key cannot be null or contain spaces.
- `count`: The number to decrement the value by. Must be a number.

### `push(key: string, element: any): Promise<void>`

Pushes an element to an array associated with the specified key. If the key does not exist, an array will be created.

- `key`: The key whose array should be appended to. Supports nested keys using dot notation. The key cannot be null or contain spaces.
- `element`: The element to push into the array.

### `clear(): Promise<void>`

Clears all data in the database.

### `all(): Promise<Array<{ id: string, value: any }>>`

Returns an array of all key-value pairs in the database.

### `fetchDataFromImage(): Promise<void>`

Fetches and loads data from the image file into the database.

### `saveDataToFile(): Promise<void>`

Saves the current state of the database back to the image file.

## Major Changes

- **Asynchronous Operations**: All methods involving file operations (`initialize`, `get`, `set`, `delete`, etc.) are now asynchronous, improving performance and ensuring the file operations do not block the event loop.
- **Initialization Method**: Added an `initialize` method to handle initial file setup and data loading, separating this logic from the constructor.
- **Optimized Data Handling**: Data is fetched from the image file only once during initialization and saved back to the file only when changes are made, reducing redundant operations.
- **Unified Storage**: All tables are now stored within the same image file, allowing for better organization and more efficient data management.

## Creators

- [Kisakay](https://github.com/Kisakay) (Anaïs)
- [Sown](https://github.com/sown-discord) (Ylies)