$(function() {
        $('.g-ifarm')[0].height = document.documentElement.clientHeight;


        $('#ply').on('click', function() {
            console.log(flag);
            if (flag) {
                // console.log($('#audio')[0]);
                $('#audio')[0].play();
                totleTime = $('#audio')[0].duration;
                timer = setInterval(animation, 10);
                $(this).toggleClass('pause');
                flag = false;
            } else if (!flag) {
                $('#audio')[0].pause();
                $(this).toggleClass('pause');
                clearInterval(timer);
                flag = true;
            }
        })
        $('body').on('mousedown', '#tdn', function(e) {
            let x1 = e.clientX;
            let left = x1 - $(this)[0].offsetLeft;
            document.body.onmousemove = function(e) {
                    let x2 = e.clientX - left;
                    if (x2 < 0) {
                        x2 = 0;
                    } else if (x2 >= $('#tdn')[0].parentNode.offsetWidth) {

                        x2 = $('#tdn')[0].parentNode.offsetWidth;
                        console.log(x2);
                    }
                    totleTime = $('#audio')[0].duration;
                    mleft = x2;
                    drop(mleft);
                    return false;

                }
                // 鼠标离开时
            document.body.onmouseup = function() {
                document.body.onmousemove = null;
            }
        })

    })
    // 设置变量来控制歌曲的播放和暂停
let flag = true;
let timer;
let totleTime = 0;
let mleft = 0;

// 让进度条动起来
function animation() {
    // 让小圆点跟着音乐播放而运动
    let n = $('#audio')[0].currentTime / totleTime;
    // console.log(~~(n * $('.m-pbar')[0].offsetWidth) + 'px');
    // console.log(n);
    $('.f-tdn')[0].style.marginLeft = ~~(n * $('.m-pbar')[0].offsetWidth) + 'px';
    // 当小圆点播放时小进度条也需跟着移动
    $('.bar')[0].style.width = ~~(n * $('.m-pbar')[0].offsetWidth) + 'px';
}
// 拖拽进度条
function drop(clientX) {
    let n = clientX / $('.m-pbar')[0].offsetWidth;
    let curr = n * totleTime;
    // console.log(curr);
    $('#audio')[0].currentTime = curr;

    $('.f-tdn')[0].style.marginLeft = clientX + 'px';
    // 当小圆点播放时小进度条也需跟着移动
    $('.bar')[0].style.width = clientX + 'px';

}