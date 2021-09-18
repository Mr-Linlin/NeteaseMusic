$(function() {
    // 接收传过来的值
    let obj = localStorage.getItem('lyric');
    let data = JSON.parse(obj);
    // console.log(data.picUrl);

    // 初始化页面
    init();

    function init() {
        $('.picUrl').attr('src', data.picUrl);
        // 根据id获取音乐
        // getMusic(data.id)

        // 根据id获取歌词信息
        getLyrics(data.id);

        q.id = data.id;
        // 根据id获取歌曲评论等信息
        getLyricsCommt(q);

        let strHtml = template('singer', data);
        $('.g-wrap4').html(strHtml);
    }

})

// 根据id获取音乐
function getMusic(id) {
    axios({
        url: '/song/url',
        params: { id: id }
    }).then(res => {
        console.log(res.data);
    })
}

// 根据id获取歌词信息
function getLyrics(id) {
    axios({
        url: '/lyric',
        params: { id: id }
    }).then(res => {
        console.log(res.data.lrc);
        let lrc = res.data.lrc.lyric;
        if (res.data.code !== 200) return alert('获取数据失败！');
        let arr = lrc.split('[');
        let str = '';
        // 将所有数组利用循环分割好
        arr.forEach(lyr => {
            let lyric = lyr.split(']');
            let ly = lyric[1];
            if (ly) {
                str = '<p>' + ly + '</p>';
            }
            // 将歌词渲染到页面去
            $('.lyric-content')[0].innerHTML += str;;

        });
    })
}

// 根据id获取歌曲评论等信息
function getLyricsCommt(obj) {
    q.id = obj.id;
    axios({
        url: '/comment/music',
        params: q
    }).then(res => {
        console.log(res.data);
        if (res.data.code !== 200) return alert('数据获取失败！');
        let strHtml = template('lyric-cmmt', res.data);
        $('.g-wrap3').html(strHtml);
        renderPage(res.data.total, q => {});
    })
}



// 定义一个查询对象
let q = {
        id: 0,
        limit: 20,
        offset: 1,
        pageNum: 1
    }
    // 使用分页模块
function renderPage(total) {

    $('.m-pl-pager').show();
    let cunt = Math.ceil(total / q.limit); //总页数
    $('#cunt').html('第' + q.pageNum + '/' + cunt + '页');

    if (q.pageNum == 1) {
        $('.prv-page').addClass('toggle-page');
    } else if (q.pageNum == cunt) {
        $('.nxt-page').addClass('toggle-page');
    }
    // 点击下一页
    $('.nxt-page').on('click', function() {
            if (q.pageNum >= cunt) {
                $('.nxt-page').addClass('toggle-page');
                return;
            }
            q.offset = ++q.pageNum * q.limit;
            // console.log(q.pageNum);
            getLyricsCommt(q);
        })
        // 点击上一页
    $('.prv-page').on('click', function() {
        if (q.pageNum <= 1) {
            $('.prv-page').addClass('toggle-page');
            return;
        }
        q.offset = --q.pageNum * q.limit;
        // console.log(q.pageNum);
        getLyricsCommt(q)
    })

}

// 过滤器，过滤时间
template.defaults.imports.getTime = time => {
    let t = new Date(time);
    let month = t.getMonth() + 1;
    let day = t.getDay();
    return month + '月' + day + '日';
};

// 过滤详细的时间
template.defaults.imports.Time = time => {
    let t = new Date(time);
    let month = t.getMonth() + 1;
    let day = t.getDay();
    let h = t.getHours();
    h = h < 10 ? '0' + h : h;
    let minteus = t.getMinutes();
    minteus = minteus < 10 ? '0' + minteus : minteus;
    return month + '月' + day + '日 ' + h + ':' + minteus;

};