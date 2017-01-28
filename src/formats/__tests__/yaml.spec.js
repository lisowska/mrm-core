'use strict';

jest.mock('fs');

const fs = require('fs');
const yaml = require('../yaml');

fs.writeFileSync('test.yml', `bar: 42
baz:
  foo:
    43
`);

it('should return an API', () => {
	const file = yaml('notfound');
	expect(typeof file.get).toBe('function');
	expect(typeof file.set).toBe('function');
	expect(typeof file.merge).toBe('function');
	expect(typeof file.save).toBe('function');
});

it('get() should return object with all file contents', () => {
	const file = yaml('test.yml');
	expect(file.get()).toEqual({
		bar: 42,
		baz: {
			foo: 43,
		},
	});
});

it('get(path) should return a value', () => {
	const file = yaml('test.yml');
	expect(file.get('bar')).toBe(42);
});

it('get(nested.path) should return a nested value', () => {
	const file = yaml('test.yml');
	expect(file.get('baz.foo')).toBe(43);
});

it('set(path) should set a value', () => {
	const file = yaml('test.yml');
	file.set('foo', 1);
	expect(file.get('foo')).toBe(1);
});

it('set(nested.path) should create a nested value', () => {
	const file = yaml('test.yml');
	file.set('xxx.yyy', 1);
	expect(file.get('xxx')).toEqual({ yyy: 1 });
});

it('merge() should merge an object', () => {
	const file = yaml('test.yml');
	file.merge({ yyy: 1 });
	expect(file.get()).toEqual({
		bar: 42,
		baz: {
			foo: 43,
		},
		yyy: 1,
	});
});

it('should return default value if file does not exist', () => {
	const obj = { zzz: 1 };
	const file = yaml('notfound', obj);
	expect(file.get()).toEqual(obj);
});

it('save() should create file', () => {
	const filename = 'new.yml';
	const file = yaml(filename);
	file.set('foo', 1);
	file.save();
	expect(fs.readFileSync(filename, 'utf8')).toBe('foo: 1\n');
});