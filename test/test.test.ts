import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { SteganoDB } from '../lib';

describe('SteganoDB', () => {
    const testFilePath = './test-steganodb.png';

    beforeAll(() => {
        if (existsSync(testFilePath)) {
            unlinkSync(testFilePath);
        }
        writeFileSync(testFilePath, readFileSync(__dirname + '/../src/picture/default.png'));
    });

    afterAll(() => {
        if (existsSync(testFilePath)) {
            unlinkSync(testFilePath);
        }
    });

    let db: SteganoDB;

    beforeEach(() => {
        db = new SteganoDB(testFilePath);
        db.deleteAll();
    });

    test('should set and get a value', () => {
        db.set('user.name', 'Alice');
        expect(db.get('user.name')).toBe('Alice');
    });

    test('should add a value to a nested key', () => {
        db.set('user.age', 30);
        db.add('user.age', 5);
        expect(db.get('user.age')).toBe(35);
    });

    test('should subtract a value from a nested key', () => {
        db.set('user.age', 30);
        db.sub('user.age', 5);
        expect(db.get('user.age')).toBe(25);
    });

    test('should delete a nested key', () => {
        db.set('user.name', 'Alice');
        db.delete('user.name');
        expect(db.get('user.name')).toBeUndefined();
    });

    test('should cache a value and delete it after the specified time', (done) => {
        db.cache('session.token', 'abc123', 1000);
        expect(db.get('session.token')).toBe('abc123');

        setTimeout(() => {
            expect(db.get('session.token')).toBeUndefined();
            done();
        }, 1100);
    });

    test('should add to a non-existing key', () => {
        db.add('counter', 5);
        expect(db.get('counter')).toBe(5);
    });

    test('should subtract from a non-existing key', () => {
        db.sub('counter', 5);
        expect(db.get('counter')).toBe(-5);
    });

    test('should push an element to an array', () => {
        db.push('tasks', 'task1');
        db.push('tasks', 'task2');
        expect(db.get('tasks')).toEqual(['task1', 'task2']);
    });

    test('should return all key-value pairs', () => {
        db.set('user.name', 'Alice');
        db.set('user.age', 30);
        const all = db.all();
        expect(all).toEqual([
            {
                id: "user",
                value: {
                    name: "Alice",
                    age: 30,
                },
            },
        ]);
    });


    test('should delete all data in the current table', () => {
        db.set('user.name', 'Alice');
        db.deleteAll();
        expect(db.get('user.name')).toBeUndefined();
    });

    test('should switch between tables', () => {
        db.set('user.name', 'Alice');
        db.table('otherTable').set('user.name', 'Bob');

        expect(db.get('user.name')).toBe('Alice'); // Default table
        expect(db.table('otherTable').get('user.name')).toBe('Bob');
    });

    test('should handle missing keys gracefully', () => {
        expect(db.get('user.nonexistent')).toBeUndefined();
        expect(() => db.add('user.nonexistent.age', 5)).not.toThrow();
        expect(db.get('user.nonexistent.age')).toBe(5);
    });

    test('should throw an error for invalid operations', () => {
        db.set('user.name', 'Alice');
        expect(() => db.add('user.name', 5)).toThrow(TypeError);
        expect(() => db.sub('user.name', 5)).toThrow(TypeError);
    });

    test('should handle deeply nested properties', () => {
        db.set('level1.level2.level3', 'deepValue');
        expect(db.get('level1.level2.level3')).toBe('deepValue');

        db.add('level1.level2.level3.number', 10);
        expect(db.get('level1.level2.level3.number')).toBe(10);

        db.sub('level1.level2.level3.number', 2);
        expect(db.get('level1.level2.level3.number')).toBe(8);

        db.delete('level1.level2.level3.number');
        expect(db.get('level1.level2.level3.number')).toBeUndefined();
    });

    test('should pull method work', () => {
        db.set('array1', [1, 2, 3]);
        expect(db.get('array1')).toEqual([1, 2, 3]);

        db.pull('array1', 10);
        expect(db.get('array1')).toEqual([1, 2, 3]);

        db.pull('array1', 2)
        expect(db.get('array1')).toEqual([1, 3]);
        db.pull('array1', 1)
        expect(db.get('array1')).toEqual([3]);

        db.delete('array1');
        expect(db.get('array1')).toBeUndefined();
    });
});
