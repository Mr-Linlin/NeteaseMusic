$(function() {
    init();

    function init() {
        // 获取歌单
        getPlaylistHot();
    }
    // 获取热门歌单
    $('#hotPlayList').on('click', function() {
        q.pageNum = 0;
        q.offset = 1;
        getPlaylistHot(q);
    })
})

// 获取推荐歌单
function getPlaylistHot() {
    axios({
        url: '/top/playlist',
        params: q
    }).then(res => {
        console.log(res.data);
        if (res.data.code !== 200) return alert('数据获取失败！');
        let strHtml = template('playlist-hot', res.data);
        $('.g-wrap2').html(strHtml);
        renderPage(res.data.total);
    })
}

// 查询条件
let q = {
        limit: 35,
        cat: '古风',
        pageNum: 0,
        offset: 1
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
            getPlaylistHot(q);
        })
        // 点击上一页
    $('.prv-page').on('click', function() {
        if (q.pageNum <= 0) {
            $('.prv-page').addClass('toggle-page');
            return;
        }
        q.offset = --q.pageNum * q.limit;
        // console.log(q.pageNum);
        getPlaylistHot(q)
    })

}

// 过滤器，返回一个整数
template.defaults.imports.getInt = num => {
    return Math.ceil(num / 10000);
}