$(function() {

    // 初始化页面
    init();

    function init() {
        // 渲染热门新碟数据
        getHotDisc();

        // 渲染全部新碟
        q.pageNum = 0;
        getNewDisc(q);
    }

})

// 查询条件
let q = {
        limit: 30,
        offset: 0,
        area: "ALL",
        pageNum: 0

    }
    // 获取热门新碟
function getHotDisc() {
    axios({
        url: "/album/newest",
    }).then(res => {
        // console.log(res.data);
        if (res.data.code !== 200) return alert('数据获取是失败！')
        let hotStr = template('hotDisc', res.data);
        $('.m-cvrlst').html(hotStr);
    })
}

// 获取全部新碟
function getNewDisc(obj) {
    axios({
        url: '/album/new',
        params: obj
    }).then(res => {
        console.log(res.data);
        if (res.data.code !== 200) return alert('数据获取失败！');
        let newStr = template('newDisc', res.data);
        // console.log(newStr);
        $('.m-cvrlst-alb2').html(newStr);
        renderPage(res.data.total);

    })
}

// 分页功能
function renderPage(total) {
    $('.m-pl-pager').show();
    let cunt = Math.ceil(total / q.limit); //总页数
    $('#cunt').html('第' + (q.pageNum + 1) + '/' + cunt + '页');
    // console.log(q.pageNum);
    if (q.pageNum <= 0) {
        $('.prv-page').addClass('toggle-page');
    } else if (q.pageNum >= cunt - 1) {
        $('.nxt-page').addClass('toggle-page');
    }
    // 点击下一页
    $('.nxt-page').on('click', function() {
            if (q.pageNum >= cunt - 1) {
                $('.nxt-page').addClass('toggle-page');
                return;
            }
            q.offset = ++q.pageNum * q.limit;
            // console.log(q.pageNum);
            getNewDisc(q);
        })
        // 点击上一页
    $('.prv-page').on('click', function() {
        if (q.pageNum <= 0) {
            $('.prv-page').addClass('toggle-page');
            return;
        }
        q.offset = --q.pageNum * q.limit;
        // console.log(q.pageNum);
        getNewDisc(q)
    })

}