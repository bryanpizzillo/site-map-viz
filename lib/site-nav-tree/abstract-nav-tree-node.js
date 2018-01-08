'use strict';


/**
 * Base class representing the Navigation Tree
 */
class AbstractNavTreeNode {

    /**
     * Creates a new instance of a NavTreeNode
     * @param {*} url The URL of the menu item.  (Some may not exist because the node is hidden)
     * @param {*} level Depth of this navigation item in the tree.  The homepage/root of the tree is level 0 
     * @param {*} navIndexCode The index/path of this node.  e.g. 1.2.3.4
     * @param {*} showsInNav Is this item marked to show in navigation?
     * @param {*} navTitle The title of the navon
     * @param {*} hasSectionNav Does this item have a section nav?
     * @param {*} hasLandingPage Does this item have a landing page (in a publishable state)
     * @param {*} leafPages The number of non-landing page pages in the folder
     */
    constructor(url, level, navIndexCode, showsInNav, navTitle, hasSectionNav, hasLandingPage, leafPages) {

        if (this.constructor === AbstractNavTreeNode) {
            throw new TypeError("Cannot construct AbstractNavTreeNode");
        }

        //if (this.read === AbstractNavTreeNode.prototype.read) {
        //    throw new TypeError("Must implement abstract method read");
        //}

        this.url = url;
        this.level = level;
        this.navIndexCode = navIndexCode;        
        this.showsInNav = showsInNav;
        this.navTitle = navTitle;
        this.hasSectionNav = hasSectionNav;
        this.hasLandingPage = hasLandingPage;
        this.leafPages = leafPages;

        this.navIndexArray = AbstractNavTreeNode.navIndexCodeToArray(navIndexCode);
        this.children = [];
    }

    /**
     * Output as an OrgChart datasource object
     */
    asOrgChartObject() {
        let rtnObj = {
            navIndexCode: this.navIndexCode,
            title: this.navTitle,
            url: this.url,
            nodeType: this.constructor.name,
            leafPages: this.leafPages
        }
        if (this.children.length > 0) {
            rtnObj['children'] = [];
            this.children.forEach(child => {
                rtnObj.children.push(child.asOrgChartObject());
            });
        }
        return rtnObj;
    }

    /**
     * Gets the parent nav index based on this nodes navIndex.
     */
    getParentNavIndex() {
        if (this.navIndexArray.length <= 1) {
            throw new Error("getParentNavIndex: Out of range")
        }

        return this.navIndexArray.slice(0, -1).join('.');
    }

    /**
     * Finds a node in the tree given the navIndexCode
     * @param {*} navIndexCode 
     */
    findNode(codeToFind) {

        //The code is this node
        if (this.navIndexCode == codeToFind) {
            return this;
        }

        let codeToFindArr = AbstractNavTreeNode.navIndexCodeToArray(codeToFind)

        //Check to make sure that the code is actually under this node.
        //If this index we are looking for is less deep or the same depth as this node
        //then it must not be part of this tree.  (Same length would be this
        //node and this code would not be hit)
        if (codeToFindArr.length <= this.navIndexArray.length) {
            return null;
        }

        //Now lets see if navIndexArray is the beginning of codeToFindArr
        //if it is not, then we are not in the right path of the tree.
        let beginningToFind = codeToFindArr.slice(0, this.navIndexArray.length);
        if (beginningToFind.join('.') != this.navIndexCode) {
            return null;
        }
        
        //Otherwise the node we are looking for is under this node.
        for(let i=0; i < this.children.length; i++) {
            let node = this.children[i].findNode(codeToFind);
            
            if (node) {
                return node;
            }
        }

        //None of the children had it, so it is probably not actually in the path.
        //(e.g. looking for 1.2.3.4 but only 1.2.3.1, 1.2.3.2, 1.2.3.3 are the children of 1.2.3)
        return null;
    }

    /**
     * Converts a navIndexCode to an array of ints
     * @param {*} navIndexCode 
     */
    static navIndexCodeToArray(navIndexCode) {
        return navIndexCode.split(/\./).map(n => { return Number.parseInt(n) })
    }

    /**
     * Compares two Nav Tree Nodes to determine order based on the NavIndexCode  
     * @param {AbstractNavTreeNode} a 
     * @param {AbstractNavTreeNode} b 
     */
    static navIndexComparer(a, b) {
        let aPath = a.navIndexArray;
        let bPath = b.navIndexArray;

        //Only compare the max number of elements possible in either array
        let length = aPath.length;
        if (length > bPath.length) {
            length = bPath.length;
        }

        //Loop over and check what is what.  Each part should indicate 
        for(let i = 0; i < length; i++) {
            if (aPath[i] < bPath[i]) {
                return -1;
            } else if (aPath[i] > bPath[i]) {
                return 1;
            }
        }

        //We are the same, so lets figure out if this is a case of
        //1.1.2 and 1.1.2.3.
        if (aPath.length > bPath.length) {
            return 1;
        } else if (aPath.length < bPath.length) {
            return -1;
        }

        return 0; //Equal and this should not happen.
    }

}



module.exports = AbstractNavTreeNode;