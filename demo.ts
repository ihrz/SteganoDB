import { SteganoDB } from "./lib"

const db = new SteganoDB('./default.png');

db.set('test', 'John Doe');

// const userName = steganoDB.get('user22');
// console.log('User name:', userName); 

db.set("user22.test", "test ta mère");

console.log(db.all());

console.log(db.get("test"));

console.log(db.get("user22.test"));