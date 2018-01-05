'use strict';

const ExcelTreeNodeReader           = require('./lib/site-nav-tree/excel-tree-node-reader');
const winston                       = require('winston');
const fs                            = require('fs');

//Setup the logger.
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
})

let reader = new ExcelTreeNodeReader(logger, './data/nav0103.xlsx');
let root = reader.read();

for(let i = 0; i < root.children.length; i++) {
    let dataSource = root.children[i].asOrgChartObject();
    let filename = `./docs/section-${root.children[i].navIndexCode}.html`;
    let title = `Section ${root.children[i].navIndexCode} - ${root.children[i].navTitle}`;
    outputFile(filename, title, dataSource);
}

function outputFile(filename, title, dataSource) {
    let stream = fs.createWriteStream(filename);

    stream.once('open', fd => {
        stream.end(`<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>${title}</title>          
          <link rel="stylesheet" href="css/font-awesome.min.css">
          <link rel="stylesheet" href="css/jquery.orgchart.css">
          <link rel="stylesheet" href="css/style.css">
          <style type="text/css">
            #chart-container { height:  620px; }
            .orgchart { background: white; }
          </style>
        </head>
        <body>
          <div id="chart-container"></div>
          <script type="text/javascript" src="js/jquery.min.js"></script>
          <script type="text/javascript" src="js/jquery.orgchart.js"></script>
          <script type="text/javascript">
            $(function() {
        
            var datascource = ${JSON.stringify(dataSource)};

            $('#chart-container').orgchart({
                'data' : datascource,
                'nodeContent': 'title',
                'verticalDepth': 3,
                'depth': 4
              });
          
            });
            </script>
            </body>
          </html>            
        `);
        
    })
}


