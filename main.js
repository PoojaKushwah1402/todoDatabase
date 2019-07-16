const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

const mysql = require('mysql');

const jsonParser = bodyParser.json();






//local mysql db connection
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'todo'
});

connection.connect(function(err) {
    if (err) throw err;
});




var todos = [];

app.use(express.static('src'))

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    next();
});

app.listen(port, function() {
    console.log(`Server listening on port ${port}!`);
});




app.delete('/todos/clearCompleted', jsonParser, function (req,res) {
    let sql = `delete from todos where isCompleted = ?`;
    const X = [true];
    connection.query(sql,X, function(err,row){
        if(err){
            console.log("error: ", err);
            result(err, null);
        }
        else{
            const response = {
                success: true,
                msg: "Todo updated Successfull",
                data: null
            }
          res.json(response);
        }


    });

});









app.delete("/todos/:id", jsonParser, function (req, res) {
    const itemId = [req.params.id];
    let sql = `delete from todos where id=?`;
 
    connection.query(sql,itemId, function(err,row){
        if(err){
            console.log("error",err);

        }

        else{
            const response = {
                success: true,
                msg: "Todo deleted successfully",
                data: row
           }
           res.json(response);
        }
    });

});




app.post("/todos",jsonParser, function(req, res) {
    const X = req.body;
    const sql = `insert into todos (name,id,isCompleted) values(?,?,?)`;
    const todo = [X.name,X.id,X.isCompleted];
    connection.query(sql,todo, function(err,row){
        if(err){
            console.log("error: ", err);
            result(err, null);
        }
        else{
            const response = {
                success: true,
                msg: "Todo inserted Successfull",
                data: row
            }
          res.json(response);
        }
    });
  });



app.put('/todos',jsonParser, function (req, res) {
    const X = [req.body.id];
    
    let sql = `UPDATE todos
    SET isCompleted = NOT(isCompleted)
    WHERE id = ?`;
    connection.query(sql,X, function(err,row){
        if(err){
            console.log("error: ", err);
            result(err, null);
        }
        else{
            const response = {
                success: true,
                msg: "Todo updated Successfull",
                data: row
            }
          res.json(response);
        }


    });

});







app.get('/todos', function (req, res) {
    connection.query("select * from todos", function (err, row) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            const response = {
                success: true,
                msg: "Todo Fetched Successfull",
                data: row
            };
        
            res.json(response);
        }
    });
});

app.all('*', function (req, res) {
    res.status(500);
    res.send('Method Not found. No Api for this url.');
});
