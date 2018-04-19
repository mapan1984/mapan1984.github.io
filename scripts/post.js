(function($){
    $.fn.toc = function(options) { // bind toc fun to $
        // Config
        let defaults = {
            noBackToTopLinks: false,
            returnToTop: '<i class="icon-arrow-up back-to-top"> </i>',
            title: '<span class="label label-info">文章目录</span>',
            minimumHeaders: 2,
            headers: 'h1, h2, h3, h4, h5, h6',
            listType: 'ul', // values: [ol|ul]
            listStyle: '', // `nav nav-pills nav-stacked`|`list-group`
            listItemStyle: '', // `nav nav-pills nav-stacked`|`list-group`
            showEffect: 'show', // values: [show|slideDown|fadeIn|none]
            showSpeed: 'slow' // set to 0 to deactivate effect
        };
        let settings = $.extend(defaults, options);// use options > defaults
        if (0 === settings.showSpeed) {
            settings.showEffect = 'none';
        }

        function fixedEncodeURIComponent(str) {
            return encodeURIComponent(str).replace(
                /[!'()*]/g,
                function(c) {
                    return '%' + c.charCodeAt(0).toString(16);
                }
            );
        }

        // 获得所有headers
        let headers = $(settings.headers).filter(function() {
            // get all headers with an ID
            let previousSiblingName = $(this).prev().attr( "name" );
            if (!this.id && previousSiblingName) {
                this.id = $(this).attr( "id", previousSiblingName.replace(/\./g, "-") );
            }
            return this.id;
        })
        // 获得Toc
        let output = $(this);

        // 如果没有header或output，或headers的数目过少，隐藏
        if (!headers.length || headers.length < settings.minimumHeaders || !output.length) {
            $(this).hide();
            return;
        }

        // 渲染函数
        let render = {
            show: function(html) {
                output.hide().html(html).show(settings.showSpeed);
            },
            slideDown: function(html) {
                output.hide().html(html).slideDown(settings.showSpeed);
            },
            fadeIn: function(html) {
                output.hide().html(html).fadeIn(settings.showSpeed);
            },
            none: function(html) {
                output.html(html);
            }
        };

        // Set headers click anchor
        headers.on('click', function() { // bind click fun in header
            console.log(this)
            if (!settings.nobacktotoplinks) {
                window.location.hash = this.id;
            }
            console.log(window.location.hash)
        })
            .addClass('clickable-header')
            .addClass('anchor');

        // 得到header的层级
        function getLevel(ele) {
            return parseInt(ele.nodeName.replace("H", ""), 10)
        }

        let highest_level = headers.map((_, ele) => getLevel(ele)).get().sort()[0];

        // Start of Table of Contents
        let toc = []
        toc.push(settings.title)
        toc.push(`<${settings.listType} class="${settings.listStyle}">`)

        let header = headers[0]
        let last_level = getLevel(header);
        toc.push(
            `<li class="${settings.listItemStyle}">
            <a href='#${fixedEncodeURIComponent(header.id)}'>${header.innerHTML}</a>
            `
        )
        for (let header of headers.slice(1)) {
            let level = getLevel(header);

            if (!settings.noBackToTopLinks && level === highest_level) {
                $(header).addClass('top-level-header').after(settings.returnToTop);
            }

            if (level === last_level){// same level as before; same indenting
                toc.push(
                    `</li>
                    <li class="${settings.listItemStyle}">
                    <a href='#${fixedEncodeURIComponent(header.id)}'>${header.innerHTML}</a>
                    `
                );
            } else if (level > last_level) { // lower level than before; expand the previous to contain a ol
                // for (let i = level; i > last_level; i--) {
                toc.push(`<${settings.listType} class="${settings.listStyle}">`)
                // }
                toc.push(
                    `<li class="${settings.listItemStyle}">
                    <a href='#${fixedEncodeURIComponent(header.id)}'>${header.innerHTML}</a>
                    `
                );
            } else { // level < last_level; higher level than before; end parent ol
                // for (let i = level; i < last_level; i++) {
                toc.push(`</li></${settings.listType}>`)
                // }
                toc.push(
                    `</li><li class="${settings.listItemStyle}">
                    <a href='#${fixedEncodeURIComponent(header.id)}'>${header.innerHTML}</a>
                    `
                );
            }
            last_level = level; // update for the next one
        }

        // End of Table of Contents
        toc.push(`</li></${settings.listType}>`);

        // 回到顶部链接
        if (!settings.noBackToTopLinks) {
            $(document).on('click', '.back-to-top', function() {
                $(window).scrollTop(-70);
                window.location.hash = '';
            });
        }

        // 渲染Toc
        html = toc.join('')
        render[settings.showEffect](html);
    };
})(jQuery);

$(document).ready(function() {
    let toc = $('#toc');                      // dom侧栏
    toc.toc();                                // fun生成侧栏标题目录
    // $('body').scrollspy({ target: '#toc' });  // fun开启滚动监听

    $(window).on('scroll', function() {        // fun动态调整侧栏位置
        let osTop = $(document).scrollTop();  // num获取滚动条距离顶部的高度
        if (osTop <= 110) {
            toc.css('top', (190 - osTop) + 'px');
        } else {
            toc.css('top', '80px');
        }
    });
});

$(document).ready(function() {                // fun返回顶部按钮行为
    let obtn = $('#back-to-top');
    obtn.on('click', function() {
        $('html, body').animate({scrollTop: 0}, 800)
    });
    $(window).on('scroll', function(){
        if ($(window).scrollTop() > $(window).height()) {
            obtn.fadeIn();
        } else {
            obtn.fadeOut();
        }
    });
    $(window).trigger('scroll');
});

$(document).ready(function() {                // 使table使用bootstrap的样式
    let tables = $('table');
    if (tables.length > 0) {
        tables.addClass('table');
        tables.addClass('table-bordered');
        tables.addClass('table-hover');
        tables.addClass('table-condensed');
    }
});
