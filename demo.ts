import { SteganoDB } from "./lib";

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

  await db.get('server.players');
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

  await db.get('server');
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

  await db.get('server.info');
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
  // Entierly clear the database !!

  await db.cache('server.info.lock', true, 3000);
  // Lock the server access for 30 000 ms; (Erase the value after the time's up)

  await db.all();
  // Return the database

  await db.has('server.info.lock');
  // Return an true if the value exist

  await db.delete('server');
  // Remove the object/value

  db.table('anticheat');
  // Create an another database in the current directory where are the database (png file) (an 'table')
})();