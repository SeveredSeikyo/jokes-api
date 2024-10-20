const express = require('express');
const cors = require('cors');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const app=express();
app.use(cors());
app.use(express.json());

const dbPath=path.join(__dirname,'jokes.db');

let db=null;
const initializeDBAndServer=async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(5000,async()=>{
            console.log('Server is running on port 5000');
        });
    }catch(e){
        console.log(`DB Error ${e.message}`);
    }
};

initializeDBAndServer();

const getJokes=async()=>{
    const getDBQuery=`SELECT * FROM jokes`;
    const jokes= await db.all(getDBQuery);
    return jokes;
}

app.get('/getjokes',async(req,res)=>{
    const jokes=await getJokes();
    res.send(jokes);
})

app.get('/joke',async(req,res)=>{
    const {category, jokeType, count}=req.query;
    let getDBQuery=`SELECT id, setup, delivery from jokes where category='${category}%'`;
    if(jokeType==='nsfw'){
        getDBQuery+=` and nsfw=1 LIMIT ?;`;
    }
    if(jokeType==='sexist'){
        getDBQuery+=` and sexist=1 LIMIT ?;`;
    }
    if(jokeType==='political'){
        getDBQuery+=` and political=1 LIMIT ?;`;
    }
    if(jokeType==='racist'){
        getDBQuery+=` and racist=1 LIMIT ?;`;
    }
    if(jokeType==='explicit'){
        getDBQuery+=` and explicit=1 LIMIT ?;`;
    }
    if(jokeType==='religious'){
        getDBQuery+=` and religious=1 LIMIT ?;`;
    }
    if(jokeType==='safe'){
        getDBQuery+=` and safe=1 LIMIT ?;`;
    }
    if(jokeType===''){
        getDBQuery+=` and LIMIT ?;`;
    }
    const jokes=await db.all(getDBQuery,[Number(count)||0]);
    res.send(jokes);
});
