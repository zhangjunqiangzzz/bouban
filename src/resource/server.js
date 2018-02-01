let express = require('express');
let app = express();
let fs = require('fs');
let session = require('express-session');
app.listen(3000);
let bodyParser = require('body-parser');
app.use(bodyParser.json());//

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    if (req.method == "OPTIONS") res.send();
    else next();
});

let read = (p, fn) => {
    fs.readFile(p, 'utf-8', (err, data) => {
        if (err) {
            fn({code: 0, err: 'file does not exist!'})
        } else {
            fn(JSON.parse(data))
        }
    })
};


let home = require('./mock/home');
app.get('/mock/home', (req, res) => {
    read('./mock/home.json', (data) => {
        res.end(JSON.stringify(data))
    })
});


app.get('/book', (req, res) => {
    read('./mock/book.json', (data) => {
        res.end(JSON.stringify(data))
    })
});
app.get('/book/:id', (req, res) => {

    let {id} = req.params;
    read('./mock/book.json', (data) => {

        data.forEach(item =>{
            let itemdata= item.bookItems.find(item=>item.bookId === id) || {};
            if (JSON.stringify(itemdata)!=="{}"){
                res.end(JSON.stringify(itemdata))
            }
        })
    })
});

app.get('/movie', (req, res) => {

    read('./mock/movie.json', (data) => {
        res.end(JSON.stringify(data))
    })
});
app.get('/movie/:id', (req, res) => {

    let {id} = req.params;
    read('./mock/movie.json', (data) => {

        data.forEach(item =>{
           let itemdata= item.moiveItems.find(item=>item.movieId === id) || {};
            if (JSON.stringify(itemdata)!=="{}"){
                res.end(JSON.stringify(itemdata))
            }
        })
    })
});

let radio = require('./mock/radio');
app.get('/mock/radio', (req, res) => {
    read('./mock/radio.json', (data) => {
        res.end(JSON.stringify(data),)
    })
});

let group = require('./mock/group');
app.get('/mock/group', (req, res) => {
    read('./mock/group.json', (data) => {
        res.end(JSON.stringify(data))
    })
});




let userList = []; // 用户信息
let crypto = require('crypto');
// 先注册在登录 {user:null,msg:'账号重复',success:'成功后的提示',err:0}
app.post('/reg',function (req,res) { // {username:'123',password:'456'}
    let {username,password} = req.body;
    let user = userList.find(item=>item.username==username);
    if(user){
        res.json({user:null,msg:'用户已存在!!',success:'',err:1});
    }else{
        // 摘要算法 md5： 不可逆  加密后的长度全部一样 如果有一点不一样加密出的结果也不一样
        password = crypto.createHash('md5').update(password).digest('base64');
        userList.push({username,password});
        res.json({user:null,msg:'',success:'恭喜你注册成功',err:0});
    }
});
app.post('/login',function (req,res) { // {username,123456}
    let {username,password} = req.body;
    password = crypto.createHash('md5').update(password).digest('base64');
    let user = userList.find(item=>(item.username===username)&&(item.password===password));
    if(user){ // 有这个用户
        req.session.user = username; //相当于登录成功后将用户名保存在session中了
        res.json({user:username,msg:'',success:'恭喜登录成功',err:0});
    }else{ // 用户不存在
        res.json({user:null,msg:'用户名或密码不正确',success:'',err:1});
    }
});
app.get('/validate',function (req,res) {
    // 用于校验用户是否登录
    res.json({user:req.session.user,msg:'',err:0,success:''});
});


