const { SteganoDB } = require('./lib/index');

const steganoDB = new SteganoDB('./default.png');

steganoDB.set('test', 'John Doe');

// const userName = steganoDB.get('user22');
// console.log('User name:', userName); 

steganoDB.set("user22.test", "test ta mère")
console.log(steganoDB.get("test"))
console.log(steganoDB.get("user22.test"))