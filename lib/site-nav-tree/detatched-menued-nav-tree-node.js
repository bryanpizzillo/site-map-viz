'use strict';

const MenuedNavTreeNode             = require('./menued-nav-tree-node');

/**
 * Represents a Nav Tree Node where the item does not show in navigation, but has a section nav of its own.
 * This happens with sections like NCI Organizations, Key Initiatives and Cancer Types.
 */
class DetatchedMenuedNavTreeNode extends MenuedNavTreeNode {

      /**
     * Creates a new instance of a NavTreeNode
     * @param {*} url The URL of the menu item.  (Some may not exist because the node is hidden)
     * @param {*} level Depth of this navigation item in the tree.  The homepage/root of the tree is level 0 
     * @param {*} navIndexCode The index/path of this node.  e.g. 1.2.3.4
     * @param {*} showsInNav Is this item marked to show in navigation?
     * @param {*} navTitle The title of the navon
     * @param {*} hasLandingPage Does this item have a landing page (in a publishable state)
     * @param {*} leafPages The number of non-landing page pages in the folder
     * @param {*} levelsToShow How many levels does the section nav show
     */
    constructor(url, level, navIndexCode, showsInNav, navTitle, hasLandingPage, leafPages, levelsToShow) {
      super(url, level, navIndexCode, showsInNav, navTitle, hasLandingPage, leafPages, levelsToShow);
    }

}

module.exports = DetatchedMenuedNavTreeNode;