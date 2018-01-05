'use strict';

/**
 * Represents the base class for a Site Navigation Tree Reader
 */
class AbstractTreeNodeReader {

    /**
     * Base constructor for creating a new instance of a derived reader
     * @param {*} logger The logger for outputting messages.
     */
    constructor(logger) {
        if (this.constructor === AbstractTreeNodeReader) {
            throw new TypeError("Cannot construct AbstractTreeNodeReader");
        }

        if (this.read === AbstractTreeNodeReader.prototype.read) {
            throw new TypeError("Must implement abstract method read");
        }

        this.logger = logger;
    }

    /**
     * Reads the Site Navigation Tree from the source 
     */
    read() {
        throw new TypeError("Cannot call abstract method read from derrived class");
    }
}

module.exports = AbstractTreeNodeReader;