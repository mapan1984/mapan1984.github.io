// 得到 header 的层级
function getLevel(ele) {
    return parseInt(ele.nodeName.replace("H", ""), 10)
}

// 转换 id 里包含的特殊字符
function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(
        /[!'()*]/g,
        c => `%${c.charCodeAt(0).toString(16)}`
    );
}

// 根据headers和ids构建TOC
function buildTOC(settings, headers, ids) {
    let toc = []
    toc.push(settings.title)
    toc.push(`<${settings.listType} class="${settings.listStyle}">`)

    let header = headers[0]
    let last_level = getLevel(header)
    toc.push(
        `<li class="${settings.listItemStyle}">
        <a href='#${fixedEncodeURIComponent(ids[0])}'>${header.innerText}</a>`
    )
    for (let i = 1; i < headers.length; i++) {
        let [header, id] = [headers[i], ids[i]]

        let level = getLevel(header)

        if (level === last_level) {
            toc.push(
                `</li>
                <li class="${settings.listItemStyle}">
                <a href='#${fixedEncodeURIComponent(id)}'>${header.innerText}</a>`
            )
        } else if (level > last_level) {
            // for (let i = level; i > last_level; i--) {
            toc.push(`<${settings.listType} class="${settings.listStyle}">`)
            // }
            toc.push(
                `<li class="${settings.listItemStyle}">
                <a href='#${fixedEncodeURIComponent(id)}'>${header.innerText}</a>`
            )
        } else {  // level < last_level
            // for (let i = level; i < last_level; i++) {
            toc.push(`</li></${settings.listType}>`)
            // }
            toc.push(
                `</li><li class="${settings.listItemStyle}">
                <a href='#${fixedEncodeURIComponent(id)}'>${header.innerText}</a>`
            )
        }
        last_level = level // update for the next one
    }

    toc.push(`</li></${settings.listType}>`)
    return toc.join('')
}

// 展示TOC
function render(options) {
    // default config
    let defaults = {
        minimumHeaders: 2,
    
        title: '<span>Toc</span>',
        listType: 'ul', // values: [ol|ul]
        listStyle: '', // `nav nav-pills nav-stacked`|`list-group`
        listItemStyle: '', // `nav nav-pills nav-stacked`|`list-group`
    
        headers: 'h1, h2, h3, h4, h5, h6',
        container: '#toc',
    }

    let settings = {...defaults, ...options} // use options > defaults
    
    // 获得所有header和其对应的id
    let headers = []
    let ids = []
    for (let header of document.querySelectorAll(settings.headers)) {
        if (header.id) {
            headers.push(header)
            ids.push(header.id)
        }
    }

    if (!headers.length || headers.length < settings.minimumHeaders) {
        console.warn('render toc get headers with id empty')
        return
    }

    let container = document.querySelector(settings.container)
    if (container) {
        container.innerHTML = buildTOC(settings, headers, ids)
    } else {
        console.error('toc container not found', settings.container)
    }
}

export default render
