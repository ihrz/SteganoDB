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
const { SteganoDB } = require('stegano.db');

const db = new SteganoDB('./default.png');

// Définissez des données
db.set('test', 'John Doe');

// Obtenez des données
const testData = db.get('test');
console.log('Données de test:', testData); // Résultat : John Doe
```

## Créateurs

- [Kisakay](https://github.com/Kisakay) (Anaïs)
- [Sown](https://github.com/sown-discord)  (Ylies) 
