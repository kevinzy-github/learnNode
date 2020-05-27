const getList = (author,keyword)=>{
    return [{
        id:1,
        title:'标题1',
        content:'内容1',
        createTime:1590555152096,
        author:'zhangsan',
    },{
        id:2,
        title:'标题2',
        content:'内容2',
        createTime:1590555152800,
        author:'lisi',
    }]
}

const getDetail = (id)=>{
    return {
        id:2,
        title:'标题2',
        content:'内容2',
        createTime:1590555152800,
        author:'lisi',
    }
}

const newBlog = (blogData={})=>{
    // blogData 是一个博客对象，包含title content
    return {id:3}
}

// 更新博客
const updateBlog = (id,blogData={})=>{
    return true;
}
// 删除博客
const delBlog = (id)=>{
    return true;
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}