# SteganoDB

SteganoDB est une librairie légère écrite en TypeScript permettant de stocker et récupérer des données à l'intérieur d'images en utilisant la stéganographie. Elle vous permet d'incorporer des données JSON dans des images, offrant ainsi une manière créative et sécurisée de stocker des informations sensibles ou des configurations.

## Fonctionnalités

- **Interface Simple**: Méthodes faciles à utiliser pour définir, obtenir et gérer des données à l'intérieur des images.
- **Support TypeScript**: Écrit en TypeScript mais compatible avec les projets TypeScript et JavaScript.
- **Stéganographie**: Utilise des techniques de stéganographie pour cacher des données JSON à l'intérieur des images.
- **Chiffrement des Données**: Prise en charge de la dissimulation des données JSON à l'intérieur des images sans chiffrement pour une récupération rapide.
- **Utilisation Flexible**: Convient à diverses applications, notamment pour stocker des configurations, des données sensibles ou de petits ensembles de données.

## Installation

Vous pouvez installer Stegano.db via npm :

```bash
npm install stegano.db
```
# Utilisation

```js
import { SteganoDB } from "./lib";

const db = new SteganoDB('./default.png');

interface GunMetadata {
    name: string;
    ammo: number;
    damage: {
        head: number;
        body: number;
        leg: number;
    };
}

interface PlayerMetadata {
    nickname: string;
    team: 'red' | 'blue';
    areMod: boolean;
    inventory: GunMetadata[];
}

const PlayerOne: PlayerMetadata = {
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

const PlayerTwo: PlayerMetadata = {
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

db.get('server.players');
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

db.get('server');
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

db.get('server.info');
/*
{
    server_name: "Kisakay's Server",
    slot: 3,
    map: "dust2",
}
*/

db.add('server.info.slot', 10);
// Server's slot is now at Current + 1 (2+10) : 12

db.sub('server.info.slot', 2);
// Server's slot is now at Current + 1 (12-2) : 10

db.clear();
// Entierly clear the database !!

db.cache('server.info.lock', true, 3000);
// Lock the server access for 30 000 ms; (Erase the value after the time's up)

db.all();
// Return the database

db.has('server.info.lock');
// Return an true if the value exist

db.delete('server');
// Remove the object/value

db.table('anticheat');
// Create an another database in the current directory where are the database (png file) (an 'table')
```

## Créateurs

- [Kisakay](https://github.com/Kisakay) (Anaïs)
- [Sown](https://github.com/sown-discord)  (Ylies) 
