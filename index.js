const fs = require('fs');
const http = require('http');
const url = require('url');
//loading data
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const replaceTemplate = (template, product)=>{
    // using regular expression (/{%PRODUCTNAME%}/g) insted of "{%PRODUCTNAME%}"
    //https://stackoverflow.com/questions/6052616/what-does-the-regular-expression-g-mean
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName); 
    output = output.replace(/{%IMAGE%}/g, product.image); 
    output = output.replace(/{%PRICE%}/g, product.price); 
    output = output.replace(/{%FROM%}/g, product.from); 
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients); 
    output = output.replace(/{%QUANTITY%}/g, product.quantity); 
    //output = output.replace(/{%DESCRIPTION%}/g, product.description); 
    output = output.replace(/{%ID%}/g, product.id); 
    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic'); 
    }

    return output;
}
const server = http.createServer((req, res)=>{
    const pathName = req.url;
    if(pathName === '/' || pathName === '/overview'){
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
    }else if(pathName==='/product'){
        res.writeHead(200,{
            'Content-type':'text/html'
        });
        res.end('this is the product');
    }else if(pathName === '/api'){
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

server.listen(8080, '127.0.0.1', ()=>{
    console.log('Server has been started, Listening to request on port 8080');
});