// service worker 注册
(function () {
    if ('serviceWorker' in navigator) {
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
})();

// allposts 页面的 侧栏标签 随页面滚动
(function () {
    let postsTip = document.querySelector('#all-posts-tip')

    function fixHeight() {
        let y  = window.scrollY

        if (y <= 360) {
            postsTip.style.top = '420px'
        } else {
            postsTip.style.top = `${y + 60}px`
        }
    }

    if (postsTip) {

        fixHeight()

        let ticking = false
        document.addEventListener('scroll', () => {

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    fixHeight()
                    ticking = false
                })
            }

            ticking = true
        })

    }
})();

// 为导航条的当前项目增加 `active` class
(function () {
    let curHref = document.location.href;
    let navLinks = document.querySelectorAll('nav ul a')
    navLinks.forEach(link => {
        let curHrefReg = new RegExp(`^${link.href}(|page\\d/)$`)
        if (curHrefReg.test(curHref)) {
            link.parentNode.classList.add('active')
        }
    })
})();
