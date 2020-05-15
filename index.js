const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./moduels/replaceTemplate');
//loading data
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res)=>{
    //const pathname = req.url;
    const {query, pathname}=url.parse(req.url, true);
    if(pathname === '/' || pathname === '/overview'){
        /**
         * Loading Template Overview, Content of the 
         * template will be same for each request so we will 
         * load the template at the beganing like we did for the data
         */
        res.writeHead(200,{
            'Content-type':'text/html'
        });
        const cardsHtml = dataObj.map(el=>replaceTemplate(templateCard, el)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }else if(pathname==='/product'){
        const product = dataObj[query.id];
        res.writeHead(200,{
            'Content-type':'text/html'
        });
        const output = replaceTemplate(templateProduct, product);
        res.end(output);
    }else if(pathname === '/api'){
        //Non-blocking or Async way
       /* fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8', (err, data)=>{
            const productData = JSON.parse(data);
            res.writeHead(200,{
                'Content-type':'application/json'
            });
            res.end(data);
        });*/
        //Since all user will asking the same data over and over again, 
        //so we load the data in the beganing when app start
        res.writeHead(200,{
            'Content-type':'application/json'
        });
        res.end(dataObj);

    }
    else{
        // setting  the 404 in the header
        res.writeHead(404,{
            'Content-type':'text/html'
        })
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8070, '127.0.0.1', ()=>{
    console.log('Server has been started, Listening to request on port 8070');
});