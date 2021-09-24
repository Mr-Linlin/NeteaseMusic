$(function() {

    // 初始化页面
    init()

    function init() {
        // 获取各类榜单内容
        getToplist();
        localStorage.removeItem('lyric');
    }
    // 获取嵌套框架的父页面
    let doc = window.parent.document;
    // 点击各类榜单进行切换
    $('.f-cb').on('click', 'li', function() {
        let id = $(this).attr('data-detail');
        playlistDetail(id);
        // 获取歌单评论
        q.id = id;
        q.pageNum = 0;
        getPlaylistComment(q);

    })

    // 点击歌曲进入歌曲的详细页面，获取歌词评论
    $('.g-wrap2').on('click', '#btn-lyric', function(e) {
        e.preventDefault();
        let data = $(this).attr('data-type');
        let obj = JSON.parse(data);
        let ly = {};
        let nikenames = singer(obj.ar);
        ly.id = obj.id;
        ly.nikenames = nikenames;
        ly.picUrl = obj.al.picUrl;
        ly.name = obj.name;
        localStorage.setItem('lyric', JSON.stringify(ly));
        location.href = 'lyrics_page.html'

    })

    // 点击歌曲进行播放
    $('.g-wrap2').on('click', '#ply', function() {
        let json = JSON.parse($(this).attr('data-type'));
        let data = {
            id: json.id,
            name: json.name,
            picUrl: json.al.picUrl,
            ar: json.ar,
            dt: json.dt
        };
        doc.querySelector('.msk').children[0].setAttribute('src', data.picUrl);
        let musicHtml = template('music-btmbar', data);
        doc.querySelector('.play').innerHTML = musicHtml;
        // 点击后自动播放歌曲
        doc.querySelector('#ply').click();
        // 根据id获取歌曲
        getMusicPly(data.id);
    });
})

// 根据id获取歌曲，将歌曲进行播放
function getMusicPly(id) {
    axios({
        url: '/song/url',
        params: { id: id }
    }).then(res => {
        console.log(res.data);
        if (res.data.code !== 200) return alert('数据获取失败！');
        let doc = window.parent.document;
        doc.querySelector('#audio').setAttribute('src', res.data.data[0].url);
    })
}
// 获取所有榜单
function getToplist() {
    axios({
        url: '/toplist'
    }).then(res => {
        // console.log(res.data);
        if (res.data.code !== 200) return alert('获取数据失败！');
        let str = template('toplist-id', res.data);
        $('.f-cb').html(str);
        let id = res.data.list[29].id;

        // 获取榜单详细内容
        playlistDetail(id);
        // 获取歌单评论
        q.id = id;
        getPlaylistComment(q);


    })
}
// 根据id获取对应榜单的内容
function playlistDetail(id) {
    axios({
        url: '/playlist/detail',
        params: { id: id }
    }).then(res => {
        console.log(res.data);
        if (res.data.code !== 200) return alert('获取数据失败！');
        let str = template('detail', res.data.playlist);
        let list = template('playlist', res.data);
        $('.m-info').html(str);
        $('.g-wrap2').html(list);
    })
}

// 根据id获取歌单评论
function getPlaylistComment(obj) {
    q.id = obj.id;
    axios({
        url: '/comment/playlist',
        params: q,
    }).then(res => {
        console.log(res.data);
        if (res.data.code !== 200) return alert('获取数据失败！');
        let cmmt = template('playlistcomment', res.data);
        $('.g-wrap3').html(cmmt);
        // 调用分页功能
        renderPage(res.data.total);

    })
}
// 定义一个查询对象
let q = {
        id: 0,
        limit: 20,
        offset: 1,
        pageNum: 0
    }
    // 使用分页模块
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
            getPlaylistComment(q);
        })
        // 点击上一页
    $('.prv-page').on('click', function() {
        if (q.pageNum <= 0) {
            $('.prv-page').addClass('toggle-page');
            return;
        }
        q.offset = --q.pageNum * q.limit;
        // console.log(q.pageNum);
        getPlaylistComment(q)
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

// 音乐时长转换为秒数
template.defaults.imports.Duration = duration => {
        var dt = duration / 1000;
        // 计算分钟
        var minutes = parseInt(dt / 60 % 60);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        // 计算秒数
        var seconds = parseInt(dt % 60);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return minutes + ':' + seconds
    }
    // 将所有歌手的名字显示出来
template.defaults.imports.Singer = singer;

function singer(singer) {
    let arr = [];
    singer.forEach(val => {
        arr.push(val.name);
    });
    let names = arr.join('/');
    return names;
}