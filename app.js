const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
// 获取 cookie 的过期时间
const getCookieExpires = () =>{
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}

// 处理postData
const getPostData = (req) => {
    const promise = new Promise((resolve,reject) => {
        if(req.method !=='POST') {
            resolve({});
            return;
        }
        if(req.headers['content-type'] !=='application/json') {
            resolve({});
            return;
        }
        
        let postData = '';
        req.on('data',chunk=>{
            postData += chunk.toString();
        })

        req.on('end',() => {
            if(!postData){
                resolve({});
                return;
            }
            resolve(JSON.parse(postData));
        })
    })
    return promise;
}

// session 数据
let SESSION_DATA = {};

const serverHandle = (req,res) =>{
    res.setHeader('Content-type','application/json');

    // 获取 path
    const url  = req.url; 
    req.path = url.split('?')[0];

    // 解析 query
    req.query = querystring.parse(url.split('?')[1]);

    // 解析 cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(item => {
        if (!item){
            return;
        }
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    })

    // 解析 session
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if (userId) {
        if(!SESSION_DATA[userId]){
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId];

    getPostData(req).then(postData=>{
        req.body = postData;

        // 处理 blog路由
        // const blogData = handleBlogRouter(req,res);
        // if (blogData) {
        //     res.end(JSON.stringify(blogData))
        //     return;
        // }
        const blogResult = handleBlogRouter(req,res);
        if(blogResult){
            blogResult.then(blogData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(blogData))
            })
            return;
        }

        // 处理 user路由
        // const userData = handleUserRouter(req,res);
        // if (userData) {
        //     res.end(JSON.stringify(userData))
        //     return;
        // }

        const userResult = handleUserRouter(req,res)
        if(userResult){
            userResult.then(userData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return;
        }
    
        // 未命中路由 返回404
        res.writeHead(404,{"content-type": "text/plain"});
        res.write('404 not found')
        res.end();
    })
}
module.exports = serverHandle;