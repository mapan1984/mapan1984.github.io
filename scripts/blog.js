'use strict';

// 保证blog-content最小高度为窗口的内在高度
$(document).ready(function (){
  var blogContent = document.getElementsByClassName('.blog-content')[0];
  var winHeight = window.innerHeight;
  blogContent.style.minHeight = winHeight+'px';
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
