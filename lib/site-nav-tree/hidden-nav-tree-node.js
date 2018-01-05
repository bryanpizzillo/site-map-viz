'use strict';

const AbstractNavTreeNode       = require('./abstract-nav-tree-node');

/**
 * Represents a Nav Tree Node where the item does not show in navigation.  This can be because:
 * A) It is marked as showsInNav false,
 * B) It is marked as showsInNav true, but lacks a landing page.
 */
class HiddenNavTreeNode extends AbstractNavTreeNode {

      /**
     * Creates a new instance of a NavTreeNode
     * @param {*} url The URL of the menu item.  (Some may not exist because the node is hidden)
     * @param {*} level Depth of this navigation item in the tree.  The homepage/root of the tree is level 0 
     * @param {*} navIndexCode The index/path of this node.  e.g. 1.2.3.4
     * @param {*} showsInNav Is this item marked to show in navigation?
     * @param {*} navTitle The title of the navon
     * @param {*} hasLandingPage Does this item have a landing page (in a publishable state)
     * @param {*} leafPages The number of non-landing page pages in the folder
     */
    constructor(url, level, navIndexCode, showsInNav, navTitle, hasLandingPage, leafPages) {
      super(url, level, navIndexCode, showsInNav, navTitle, false, hasLandingPage, leafPages);
    }

}

module.exports = HiddenNavTreeNode;