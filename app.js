const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "your username",
    password: "your password",
    database: "your db"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database");
});

app.use(bodyParser.urlencoded({extended: true}))

app.post('/app/user', function(req, res){
    // console.log(req.body);
    var countSql = "select count(*) as totalCount from users";
    con.query(countSql, function (err, result, fields) {
        if (err){
            res.send({
                'status': 'failed'
            })
            throw err;
        } 
        // console.log(result[0].totalCount);
        var newUserId = result[0].totalCount;
        var insertSql = "insert into users (username, password, userid) values ?";
        var values = [
            [req.body.username, req.body.password, newUserId]
          ];
          con.query(insertSql, [values], function (err, result) {
            if (err){
                res.send({
                    'status': 'failed'
                })
                throw err;
            } 
            // console.log("Number of records inserted: " + result.affectedRows);
          });
    });
    res.send({
        'status': 'account created'
    })
})

app.post('/app/user/auth', function(req, res){
    console.log(req.body);
    var searchSql = "select password, userid from users where username = ?";
    con.query(searchSql, [req.body.username], function (err, result) {
        if (err) throw err;
        console.log(result);
        if(result[0].password == req.body.password){
            res.send({
                'status': 'success',
                'userId': result[0].userid
            })
        }else{
            res.send({
                'status': 'fail'
            })
        }
    });
})

app.get('/app/sites/list/',function(req,res){
    // console.log(req.body);
    console.log(req.query.user);
    var searchSql = "select website, username, password from entry where userid = ?";
    con.query(searchSql, [req.query.user], function (err, result) {
        if (err){
            res.send({
                'status': 'fail'
            })
            throw err;
        }else{
            console.log(result);
            res.send(result);
        }
    });
    // sample output
    // res.send([
    //     {
    //        'userName': 'abc',
    //        'password': 123 
    //     },
    //     {
    //         'userName': 'abc',
    //         'password': 123 
    //     }
    // ])
})

app.post('/app/sites', function(req, res){
    console.log(req.body);
    var userId = req.query.user;
    console.log(userId);
    var insertSql = "insert into entry (userid, website, username, password) values ?";
    var values = [
        [userId, req.body.website, req.body.username, req.body.password]
        ];
        con.query(insertSql, [values], function (err, result) {
        if (err){
            res.send({
                'status': 'failed'
            })
            throw err;
        }else{
            res.send({
                'status': 'success'
            })
        }
        // console.log("Number of records inserted: " + result.affectedRows);
    });
})

app.listen(3000);