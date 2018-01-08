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
let sections = [];

for(let i = 0; i < root.children.length; i++) {
    let dataSource = root.children[i].asOrgChartObject();
    let filename = `section-${root.children[i].navIndexCode}.html`;
    let filepath = `./docs/${filename}`;
    let title = `Section ${root.children[i].navIndexCode} - ${root.children[i].navTitle}`;
    sections.push({
        title: title,
        file: filename
    });
    outputFile(filepath, title, dataSource);
}

outputIndex(sections);

function outputIndex(pages) {
    let stream = fs.createWriteStream('./docs/index.html');
    
        stream.once('open', fd => {
            stream.write(`<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <title>Index</title>          
              <link rel="stylesheet" href="css/font-awesome.min.css">
              <link rel="stylesheet" href="css/jquery.orgchart.css">
              <link rel="stylesheet" href="css/style.css">
              <style type="text/css">
                #chart-container { height:  620px; }
                .orgchart { background: white; }
              </style>
            </head>
            <body>
              <script type="text/javascript" src="js/jquery.min.js"></script>
              <ul>
            `);

            pages.forEach(page => {
                stream.write(`<li><a href="${page.file}">${page.title}</a></li>`)
            })

            stream.end(`
                </ul>
                </body>
              </html>            
            `);
            
        })    
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

            var nodeTemplate = function(data) {
                var title = \`\${data.navIndexCode} \${data.title}\`;
                
                if (data.leafPages > 0) {
                    title = title + \`<span class="leaf-pages">\${data.leafPages}</span>\`;
                }

                return \`
                    <div class="title">\${title}</div>
                    <div class="content">\${data.url}</div>
                \`;
            };

            $('#chart-container').orgchart({
                'data' : datascource,
                //'nodeContent': 'title',
                'nodeTemplate': nodeTemplate,
                'verticalDepth': 3,
                'depth': 4,
                'parentNodeSymbol': false
              });
          
            });
            </script>
            </body>
          </html>            
        `);
        
    })
}


