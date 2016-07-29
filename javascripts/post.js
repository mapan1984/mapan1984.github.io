(function($){
  $.fn.toc = function(options) { // bind toc fun to $
    var defaults = {
      noBackToTopLinks: true,
      title: '<span class="label label-info">文章目录</span>',
      minimumHeaders: 2,
      headers: 'h1, h2, h3, h4, h5, h6',
      listType: 'ul', // values: [ol|ul]
      showEffect: 'show', // values: [show|slideDown|fadeIn|none]
      showSpeed: 'slow' // set to 0 to deactivate effect
    },
    settings = $.extend(defaults, options);// use options > defaults

    function fixedEncodeURIComponent (str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
      });
    }

    var headers = $(settings.headers).filter(function() {
      // get all headers with an ID
      var previousSiblingName = $(this).prev().attr( "name" );
      if (!this.id && previousSiblingName) {
        this.id = $(this).attr( "id", previousSiblingName.replace(/\./g, "-") );
      }
      return this.id;
    }), output = $(this);
    if (!headers.length || headers.length < settings.minimumHeaders || !output.length) {
      $(this).hide();
      return;
    }

    if (0 === settings.showSpeed) {
      settings.showEffect = 'none';
    }

    var render = {
      show: function() { output.hide().html(html).show(settings.showSpeed); },
      slideDown: function() { output.hide().html(html).slideDown(settings.showSpeed); },
      fadeIn: function() { output.hide().html(html).fadeIn(settings.showSpeed); },
      none: function() { output.html(html); }
    };

    var get_level = function(ele) { return parseInt(ele.nodeName.replace("H", ""), 10); }
    var highest_level = headers.map(function(_, ele) { return get_level(ele); }).get().sort()[0];
    var return_to_top = '<i class="icon-arrow-up back-to-top"> </i>';

    var level = get_level(headers[0]),
      this_level,
      html = settings.title + " <" + settings.listType + " class = 'nav nav-pills nav-stacked'>";
    headers.on('click', function() { // bind click fun in header
      if (!settings.noBackToTopLinks) {
        window.location.hash = this.id;
      }
    })
    .addClass('clickable-header')
    //.addClass('anchor')
    .each(function(_, header) {
      this_level = get_level(header);
      if (!settings.noBackToTopLinks && this_level === highest_level) {
        $(header).addClass('top-level-header').after(return_to_top);
      }
      if (this_level === level) // same level as before; same indenting
        html += "<li><a href='#" + fixedEncodeURIComponent(header.id) + "'>" + header.innerHTML + "</a>";
      else if (this_level <= level){ // higher level than before; end parent ol
        for(i = this_level; i < level; i++) {
          html += "</li></"+settings.listType+">"
        }
        html += "<li><a href='#" + fixedEncodeURIComponent(header.id) + "'>" + header.innerHTML + "</a>";
      }
      else if (this_level > level) { // lower level than before; expand the previous to contain a ol
        for(i = this_level; i > level; i--) {
          html += "<"+settings.listType+" class = 'nav nav-pills nav-stacked'>"+"<li>"
        }
        html += "<a href='#" + fixedEncodeURIComponent(header.id) + "'>" + header.innerHTML + "</a>";
      }
      level = this_level; // update for the next one
    });
    html += "</"+settings.listType+">";
    if (!settings.noBackToTopLinks) {
        $(document).on('click', '.back-to-top', function() {
        $(window).scrollTop(-70);
        window.location.hash = '';
      });
    }
    render[settings.showEffect]();
  };
})(jQuery);

$(document).ready(function() {
  var toc = $('#toc');                      // dom侧栏
  toc.toc();                                // fun生成侧栏标题目录
  $('body').scrollspy({ target: '#toc' });  // fun开启滚动监听

  $(window).bind("scroll", function(){      // fun调整侧栏位置
    var osTop = $(document).scrollTop();    // num获取滚动条距离顶部的高度
    if(osTop <= 110){
      toc.css('top', (190 - osTop) + 'px');
    }else{
      toc.css('top', '80px');
    }
  });
  
  //(function(){  // fun点击button展开评论
    var disBtn = document.getElementById('show-dis');        // dom评论按钮
    var disPan = document.getElementById('disqus_thread');   // dom评论区域
    var notLoad = true;
    var hasShowed = false;
    disBtn.onclick = function(){
      if(notLoad){
        //{{ act加载评论
        var s = document.createElement('script');
        s.src = '//skkmp.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (document.head || document.body).appendChild(s);
        //}} 
        notLoad = false;
        hasShowed = true;
        disBtn.innerText = '收起评论';
      }else{
        if(hasShowed){
          disPan.style.display = 'none';
          disBtn.innerText = '展开评论';
          hasShowed = false;
        }else{
          disPan.style.display = 'block';
          disBtn.innerText = '收起评论';
          hasShowed = true;
        }
      }
    }
  //})();

  //(function(){  // fun生成回到顶部按钮
    var obtn = $('#back-to-top');
    obtn.on('click', function(){
        $('html, body').animate({scrollTop: 0}, 800)
    });
    $(window).on('scroll', function(){
        if($(window).scrollTop() > $(window).height()){
            obtn.fadeIn();
        }else{
            obtn.fadeOut();
        }
    });
    $(window).trigger('scroll');
  //})();
});
