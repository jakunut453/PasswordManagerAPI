const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
var CryptoJS = require('crypto-js');
var masterPassword = 'your secret key';

var con = mysql.createConnection({
    host: "your host name",
    user: "your user name",
    password: "your password",
    database: "your db name"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database");
});

app.use(bodyParser.urlencoded({extended: true}))

app.post('/app/user', function(req, res){
    var countSql = "select count(*) as totalCount from users";
    con.query(countSql, function (err, result, fields) {
        if (err){
            res.send({
                'status': 'failed'
            })
            throw err;
        } 
        var newUserId = result[0].totalCount;
        var cipherpassword = CryptoJS.AES.encrypt(req.body.password, masterPassword).toString();
        var insertSql = "insert into users (username, password, userid) values ?";
        var values = [
            [req.body.username, cipherpassword, newUserId]
          ];
          con.query(insertSql, [values], function (err, result) {
            if (err){
                res.send({
                    'status': 'failed'
                })
                throw err;
            } 
          });
    });
    res.send({
        'status': 'account created'
    })
})

app.post('/app/user/auth', function(req, res){
    var searchSql = "select password, userid from users where username = ?";
    con.query(searchSql, [req.body.username], function (err, result) {
        if (err) throw err;
        var bytes  = CryptoJS.AES.decrypt(result[0].password, masterPassword);
        var originalpassword = bytes.toString(CryptoJS.enc.Utf8);
        if(originalpassword == req.body.password){
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
    var searchSql = "select website, username, password from entry where userid = ?";
    con.query(searchSql, [req.query.user], function (err, result) {
        if (err){
            res.send({
                'status': 'fail'
            })
            throw err;
        }else{
            console.log(result);
            for(var i=0;i<result.length;i++){
                var bytes  = CryptoJS.AES.decrypt(result[i].password, masterPassword);
                var originalpassword = bytes.toString(CryptoJS.enc.Utf8);
                result[i].password = originalpassword;
            }
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
    //         'userName': 'bcd',
    //         'password': 456 
    //     }
    // ])
})

app.post('/app/sites', function(req, res){
    var userId = req.query.user;
    var cipherpassword = CryptoJS.AES.encrypt(req.body.password, masterPassword).toString();
    var insertSql = "insert into entry (userid, website, username, password) values ?";
    var values = [
        [userId, req.body.website, req.body.username, cipherpassword]
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
    });
})

app.listen(3000);