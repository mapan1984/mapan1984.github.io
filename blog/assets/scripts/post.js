import render from './utils/toc.js'

// 返回顶部 按钮
(function() {
    let backToTop = document.querySelector('#back-to-top')

    backToTop.addEventListener("click", () => {
        window.scrollTo({top: 0, behavior: "smooth"})
    })

    function backToTopShowTrigger() {
        let y  = window.scrollY
        if (y > window.innerHeight) {
            if (backToTop.style.display !== 'block') {
                backToTop.style.display = 'block'
            }
        } else {
            if (backToTop.style.display !== 'none') {
                backToTop.style.display = 'none'
            }
        }
    }

    backToTopShowTrigger()
    window.addEventListener('scroll', () => {
        backToTopShowTrigger()
    })
})();


// 渲染 toc 侧边栏 & toc 随页面滚动
(function() {
    let toc = document.querySelector('#toc')

    function fixHeight(node) {
        let osTop = window.scrollY

        if (osTop <= 150) {
            node.style.top = `${230 - osTop}px`
        } else {
            node.style.top = '80px'
        }
    }

    if (toc) {
        render({
            title: '<span class="label sm">文章目录</span>',
            container: '#toc',
        })

        fixHeight(toc)

        document.addEventListener('scroll', () => {
            fixHeight(toc)
        })
    }
})();
