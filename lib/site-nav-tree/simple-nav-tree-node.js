'use strict';

const AbstractNavTreeNode       = require('./abstract-nav-tree-node');

/**
 * Represents a Nav Tree Node where the item is a normal menu item.
 */
class SimpleNavTreeNode extends AbstractNavTreeNode {

      /**
     * Creates a new instance of a NavTreeNode
     * @param {*} url The URL of the menu item.  (Some may not exist because the node is hidden)
     * @param {*} level Depth of this navigation item in the tree.  The homepage/root of the tree is level 0 
     * @param {*} navIndexCode The index/path of this node.  e.g. 1.2.3.4
     * @param {*} navTitle The title of the navon / or page
     * @param {*} leafPages The number of non-landing page pages in the folder
     */
    constructor(url, level, navIndexCode, navTitle, leafPages) {
      //These always show in nav and have a landing page.
      super(url, level, navIndexCode, true, navTitle, false, true, leafPages); 
    }

}

module.exports = SimpleNavTreeNode;