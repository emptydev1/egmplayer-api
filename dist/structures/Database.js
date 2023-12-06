'use strict';

const { readdirSync, mkdirSync } = require('node:fs');
const SQLiteDatabase = require('./SQLiteDatabase');
const path = require('node:path');

exports.EGMPlayerDatabase = class EGMPlayerDatabase {
    constructor() {
        this.folder = path.resolve('databases', 'main');
        mkdirSync(this.folder, { recursive: true });
        
        const collections = readdirSync(this.folder);
        
        this.collections = (collections.length ? collections : [ 'PRODUCTS (1).sqlite' ])
            .filter((c) => path.extname(c) == '.sqlite')
            .map((c) =>
                new SQLiteDatabase({ root: path.join(this.folder, c) }));
        
        this.collection = this.collections
            .find((c) =>
                parseInt(/(.*?)\s*\((\w+)\)/.exec(c.options.root)?.[2]) == this.collections.length);
    }
    
	  /**
     * Inserts a value into current collection
  	 * @param {String} key  The ID of the film
     * @param {Object} value  The film data 
     */
    insert(key, value) {
        if (typeof key !== 'string') throw new TypeError('The parameter "key" are invalid, must be a string');
        if (this.size >= 100) {
            const size = this.collections.push(new SQLiteDatabase({ root: path.join(this.folder, `PRODUCTS (${this.collections.length + 1})`) }));
            
            this.collection = this.collections[size - 1];
        }
        
        return this.collection.insert(key, value);
    }
    
    /**
     * Performs the basic mathematical operations
     * @param {String} key  The key for use on operation
     * @param {String} signal  The sign that should be used in the expression
     * @param {Number} value  The another value to use
     */
    math(key, signal, value) {
        if (!this.exists(key)) throw new TypeError('Invalid parameters');
        
        return this.collections.find((c) => c.exists(key)).math(key, signal, value);
    }
    
    /**
     * Gets a value from a database element
     * @param {String} key  The key of element
     * @param {*} df  The default value that's be returned
     */
    get(key, df = null) {
        return this.collections.find((c) => c.exists(this.pattern(key)))?.get(key, df) ?? df;
    }
    
    /**
     * Permanently deletes an element from the database
     * @param {String} key  The key of the element that's be deleted
     */
    delete(key) {
        const pattern = this.pattern(key);
        
        if (!this.exists(pattern)) throw new TypeError(`Cannot find a element with id
        "${pattern}"`);
        
        return this.collections.find((c) => c.exists(pattern)).delete(pattern);
    }
    
    /**
     * Verify whether a element exists in the database
     * @param {String} key  The key that's be searched on database collections
     */
    exists(key) {
        return this.collections.some((c) => c.exists(key));
    }
    
    /**
     * This method returns all values belonging to the current collection
     * @returns {Array<Object>}
     */
    values() {
        return this.collection.toArray()
            .map((d) => d.data);
    }
    
    /**
     * Returns all values belonging to currently available collections
     * @returns {Array<Object>}
     */
    totalValues() {
        return this.collections
            .map((c) => c.toArray().map((d) => d.data))
            .flat();
    }
    
    /**
     * Gets the pattern from a key
     * @param {String} key  The key for get pattern
     */
    pattern(key) {
        return key ? null : key.match(/([^\.\[\]]+|\[\d+\])/g)?.[0];
    }
    
    /**
     * Returns the number of elements in current collection
     * @returns {Number}
     */
    get size() {
        return this.collection.toArray().length;
    }
    
    /**
     * Returns the latency, in milliseconds, of the database collections
     * returns {Number}
     */
    get ping() {
        const stt = new Date().getTime();
        
        this.totalValues();
        
        return new Date().getTime() - stt;
    }
};
