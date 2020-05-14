const fs = require('fs');
//Blocking, synchronous way
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

const textOut = `This is what we know about the avacoado ${textIn}\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);

//Non-blocking, Asynchronous way

function readFiles(){
    fs.readFile('./txt/start.txt', 'utf-8', (err, data1)=>{
        if(err) return console.log(err);
        fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=>{
            if(err) return console.log(err);
            fs.readFile('./txt/append.txt', 'utf-8', (err, data3)=>{
                if(err) return console.log(err);
                writeFile('./txt/final.txt', `${data2}\n${data3}`);
            });
        });
    });
}

function writeFile(path, data){
    fs.writeFile(path,data,'utf-8',err=>{
        if(err){
            console.log(err);
        }
    })
}
readFiles();



