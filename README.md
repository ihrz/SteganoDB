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
const { SteganoDB } = require('stegano.db');

const db = new SteganoDB('./default.png');

const PlayerOne = {
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
};

const PlayerTwo = {
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

db.set("server.info", {
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

db.clear();
// Entirely clear the database !!

db.cache('server.info.lock', true, 3000);
// Lock the server access for 3000 ms; (Erase the value after the time's up)

console.log(db.all());
// Return the entire database

console.log(db.has('server.info.lock'));
// Return true if the value exists

db.delete('server');
// Remove the object/value

db.table('anticheat');
// Create another database in the current directory where the database (png file) is located (a 'table')
```

## Creators

- [Kisakay](https://github.com/Kisakay) (Anaïs)
- [Sown](https://github.com/sown-discord) (Ylies)
