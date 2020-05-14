const fs = require('fs');
const http = require('http');
const url = require('url');


const server = http.createServer((req, res)=>{
    const pathName = req.url;
    if(pathName === '/' || pathName === '/overview'){
        res.end('This is the overview');
    }else if(pathName==='/product'){
        res.end('this is the product');
    }else if(pathName === '/api'){
        fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8', (err, data)=>{
            const productData = JSON.parse(data);
            res.writeHead(200,{
                'Content-type':'application/json'
            });
            res.end(data);
        });
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