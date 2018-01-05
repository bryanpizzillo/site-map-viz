'use strict';

const _             = require('lodash');
//const async         = require('async');
//const colors        = require('colors');
//const cheerio       = require('cheerio');
//const fs            = require('fs');
//const JSONStream    = require('JSONStream');
//const request       = require('request');
//const url           = require('url');
const XLSX          = require('xlsx');

const AbstractTreeNodeReader        = require('./abstract-tree-node-reader');

const AbstractNavTreeNode           = require('./abstract-nav-tree-node');
const DetatchedMenuedNavTreeNode    = require('./detatched-menued-nav-tree-node');
const MenuedNavTreeNode             = require('./menued-nav-tree-node');
const HiddenNavTreeNode             = require('./hidden-nav-tree-node');
const SimpleNavTreeNode             = require('./simple-nav-tree-node');

const DB_NULL = 'NULL';

/**
 * Class to read a site nav tree structure from an excel sheet.
 */
class ExcelTreeNodeReader extends AbstractTreeNodeReader {

    /**
     * Creates a new instance of an ExcelTreeNodeReader
     * @param {*} logger A logger (winston)
     * @param {*} filePath The path to the spreadsheet
     */
    constructor(logger, filePath) {
        super(logger);

        this.filePath = filePath;
    }

    /**
     * Reads the Site Navigation Tree from the source 
     */
    read() {
        this.logger.info(`Begin reading ${this.filePath}`);

        let workbook = XLSX.readFile(this.filePath);
        
        let worksheet = workbook.Sheets["Sheet1"];
        let sheetObj = XLSX.utils.sheet_to_json(worksheet);
        
        let flatNodes = sheetObj.map(this.createNavTreeNodeFromRow.bind(this));
        let rootNode = this.buildTree(flatNodes);
        
        this.logger.info(`Completed reading ${this.filePath}`);
        return rootNode;
    }

    /**
     * Creates an instance of the appropriate NavTreeNode based on the sheet row. (Private)
     * @param {*} item 
     */
    createNavTreeNodeFromRow(item) {
        let url = item.path;
        let level = Number.parseInt(item.level);
        let navIndexCode = item.NavIndexCode.replace("'", "").replace("'", "");
        let showInNav = item.SHOW_IN_NAV == '1' ? true : false;
        let hasLandingPage = item.Has_Landingpage == '1' ? true : false;
        //TODO: convert to int
        let leafPages = item.nonLandingpage_count == DB_NULL ? 0 : Number.parseInt(item.nonLandingpage_count);
        
        let hasSectionNav = item.Has_Sectionnav == '1' ? true : false;
        //TODO: convert to int
        let levelsToShow = item.LEVELS_TO_SHOW == DB_NULL ? 0 : Number.parseInt(item.LEVELS_TO_SHOW);

        let navTitle = item.nav_title; 
        if (navTitle == DB_NULL) {
            //TODO: Probably should use short title of landing page
            navTitle = item.landingpage;
        }

        let node = undefined;

        if (hasSectionNav && (!hasLandingPage || !showInNav)) {
            //Disconnected
            node = new DetatchedMenuedNavTreeNode(url, level, navIndexCode, showInNav, navTitle, hasLandingPage, leafPages, levelsToShow);
        } else if (!hasLandingPage || !showInNav) {
            //Hidden
            node = new HiddenNavTreeNode(url, level, navIndexCode, showInNav, navTitle, hasLandingPage, leafPages)
        } else if (hasSectionNav) {
            //Menued item, primarily the 2nd level nav items
            node = new MenuedNavTreeNode(url, level, navIndexCode, showInNav, navTitle, hasLandingPage, leafPages, levelsToShow);
        } else {
            //Nothin special
            node = new SimpleNavTreeNode(url, level, navIndexCode, navTitle, leafPages);
        }
        
        return node;
    }    

    /**
     * Builds up the tree (Private)
     * @param {*} nodeList 
     */
    buildTree(nodeList) {
        //let sortedList = _.sortBy(nodeList, ['level', 'navIndexCode']);

        //Sort the array
        nodeList.sort(AbstractNavTreeNode.navIndexComparer)
        
        let rootNode = nodeList.filter(node => node.level == 0);
        
        if (rootNode.length == 0) {
            throw new Error("No Root Node Found")
        } else if (rootNode.length > 1) {
            throw new Error("Multiple root nodes found");
        }

        // There is only one root, so pull it out.
        rootNode = rootNode[0];

        //Build the tree
        nodeList.forEach(node => {     
            if (node === rootNode) {
                return; //Continue if root
            }


            let parent = rootNode.findNode(node.getParentNavIndex());

            if (parent) {
                parent.children.push(node);
            } else {
                throw new Error(`Parent not found for code ${node.navIndexCode}`);
            }
//            console.log(`Finished with ${node.navIndexCode} - parent, ${parent.navIndexCode} now has ${parent.children.length} children`);
        });
        
        
        // nodeList            
        //     .forEach(node => {
        //         console.log(`${node.navIndexCode} - children ${node.children.length}`);
        //     });
        return rootNode;        
    }

    /**
     * Process the input worksheet and enrich the link records outputting a 
     * new spreadsheet.
     * 
     * @memberOf NonPDQLinkProcessor
     */
    /*
    process() {
      

      // Get worksheet 
      var worksheet = workbook.Sheets["CGOV"];

      let sheetObj = XLSX.utils.sheet_to_json(worksheet);

      //Convert each sheet row into a new object, which we will
      //use to resave the worksheet.
      let links = sheetObj.map( (item) => {

          let linkRecord = {
              url: item['bad link'],
              new_url: item['NEW URL'],
              comment: item['Comment'],
              bp_text: item['Boiler Plate Text'],
              ref_url: item['url used on'],
              ref_contentid: item['contentid'],
              ref_contentType: item['contenttypename'],
              ref_title: item['title'],
              ref_statename: item['statename'],
              'By Cancer Type': item['By Cancer Type'],
              'Stage Subtype': item['Stage Subtype'],
              'By Trial Type': item['By Trial Type'],
              'Trial Phase': item['Trial Phase'],
              'Treatment / Intervention': item['Treatment / Intervention'],
              'Lead Org': item['Lead Org'],
              'Keywords / Phrases': item['Keywords / Phrases'],
              'USA only': item['USA only'],
              'No Results': item['No Results'],
              'protocolsearchid': item['protocolsearchid'],
              'IDstring': item['IDstring'],
              'Type': item['Type']
          };

          //Add in info from linkDB
          let link = this.linkDB.getLink(linkRecord.url);

          if (!link) {
              throw new Error(`No link found for ${linkRecord.url}`);
          }
          
          linkRecord['Pattern'] = this._getPrettyPattern(link);
          linkRecord['cgov_trial_count'] = link.cgov_trial_count;

          return linkRecord;
      });

      this._saveWorkbook(
          links,
          [
              'url', 'Pattern', 'cgov_trial_count', 'new_url',
              'comment', 'bp_text', 'ref_url', 'ref_contentid', 'ref_contentType',
              'ref_title', 'ref_statename', 'By Cancer Type', 'Stage Subtype', 'By Trial Type',                        
              'Trial Phase', 'Treatment / Intervention', 'Lead Org', 'Keywords / Phrases',
              'USA only', 'No Results', 'protocolsearchid', 'IDstring', 'Type'
          ]
      );
  }
}
*/

}

module.exports = ExcelTreeNodeReader;