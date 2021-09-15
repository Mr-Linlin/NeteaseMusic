$(function() {
    // 初始化首页数据
    getHomePage();


});
// 获得首页数据
function getHomePage() {
    axios({
        method: 'GET',
        url: '/homepage/block/page'
    }).then(res => {
        console.log(res.data);
    })
}