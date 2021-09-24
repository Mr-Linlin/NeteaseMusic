$(function() {

    init();

    function init() {
        // 初始化首页数据
        getHomePage();

        // 获取热门推荐
        getPlaylistHot(q)

        // 获取新碟上架
        getHotDisc();

    }

    // 点击歌单类型切换热门推荐
    $('.tab').on('click', 'a', function() {
        let cat = $(this).attr('data-cat')
        q.cat = cat;
        getPlaylistHot(q);
    })

    //点击下一页切换新碟
    let index = 0;
    $('.click-next').on('click', function() {
            if (index >= 1) {
                $('.roll-flag')[0].style.marginLeft = 0;
                return index--;
            }
            $('.roll-flag')[0].style.marginLeft = -$('.inner')[0].offsetWidth + 'px';
            index++;
        })
        //点击上一页切换新碟
    $('.click-pre').on('click', function() {
        if (index <= -1) {
            $('.roll-flag')[0].style.marginLeft = -$('.inner')[0].offsetWidth + 'px';
            return index++
        }
        $('.roll-flag')[0].style.marginLeft = 0;
        index--;
    })
});


// 获取热门新碟
function getHotDisc() {
    axios({
        url: "/album/newest",
    }).then(res => {
        if (res.data.code !== 200) return alert('数据获取是失败！')
        let hotStr = template('hotDisc', res.data);
        $('.roll-flag').html(hotStr);
    })
}

// 查询条件
let q = {
        limit: 8,
        cat: '古风',
        pageNum: 0,
        offset: 1
    }
    // 获取热门推荐歌单
function getPlaylistHot(obj) {
    axios({
        url: '/top/playlist',
        params: obj
    }).then(res => {
        console.log(res.data);
        if (res.data.code !== 200) return alert('数据获取失败！');
        let strHtml = template('playlist-hot', res.data);
        $('.m-cvrlst').html(strHtml);
    })
}
// 过滤器，返回一个整数
template.defaults.imports.getInt = num => {
        return Math.ceil(num / 10000);
    }
    // 获得首页数据
function getHomePage() {
    axios({
        method: 'GET',
        url: '/homepage/block/page'
    }).then(res => {
        // console.log(res.data);
        if (res.data.code !== 200) return alert('数据获取失败！');
        const data = res.data.data.blocks[0].extInfo;
        let bannerHtml = template('g-banner', data);
        // console.log(data);
        $('#g-focus').html(bannerHtml);
        // 轮播图
        layui.use('carousel', function() {
            var carousel = layui.carousel;
            //建造实例
            carousel.render({
                elem: '#banner',
                width: '100%', //设置容器宽度
                height: '100%',
                arrow: 'always', //始终显示箭头
                interval: 2000
            });
        });
    })
}