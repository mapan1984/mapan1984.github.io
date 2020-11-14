'use strict';

$(document).ready(function (){
    if ('serviceWorker' in navigator) {
        // navigator.serviceWorker.register('/assets/scripts/sw.js', {scope: '/'})
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
            .then(reg => {
                if (reg.installing) {
                    console.log('Service worker installing')
                } else if (reg.waiting) {
                    console.log('Service worker installed')
                } else if (reg.active) {
                    console.log('Service worker active')
                }
            })
            .catch(error => {
                console.warn('Registration failed with ', error)
            })
    }
});

// 保证blog-content最小高度为窗口的内在高度
$(document).ready(function (){
    function fixHeight() {
        var content = document.getElementsByClassName('content')[0];
        if (content) {
            content.style.minHeight = window.innerHeight+'px';
        }
    }

    var tablist = document.querySelectorAll('ul.nav-pills')[0];
    if (tablist) {
        tablist.addEventListener('click', function(event){
            var event = event || window.event;
            var target = event.target || event.srcElement;
            if (target.nodeName.toLocaleLowerCase() == 'a') {
                fixHeight();
            }
        })
    }
});

// allposts页面的标签内容随内容滚动
$(document).ready(function (){
    var postsTip = $('#all-posts-tip');
    $(window).bind("scroll", function(){
        var osTop = $(document).scrollTop();
        if(osTop <= 300){
            postsTip.css('top', (360) + 'px');
        }else{
            postsTip.css('top', (osTop + 60) + 'px');
        }
    });
    $(window).trigger('scroll');
});

// 为导航条的当前项目增加 `active` class
$(document).ready(function (){
    let curHref = document.location.href;
    $('ul.main-nav').find('a').each(function () {
        let curHrefReg = new RegExp('^'+this.href+'(|page\\d/)$')
        if (curHrefReg.test(curHref)) {
            $(this.parentNode).addClass('active');  // parentNode.className += 'active';
        }
    });
});

// $(document).ready(function (){
//     let host = "mapan1984.github.io";
//     if ((host == window.location.host) && (window.location.protocol != "https:")) {
//         window.location.protocol = "https";
//     }
// });
