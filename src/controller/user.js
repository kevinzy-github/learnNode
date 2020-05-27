const loginCheck = (username,password) => {
    // mock数据
    if(username === 'zhangsan' && password ==='123'){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    loginCheck
}