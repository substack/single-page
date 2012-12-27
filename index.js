module.exports = function (cb, opts) {
    var page = new Page(cb, opts);
    
    if (window.addEventListener) {
        window.addEventListener('hashchange', onhashchange);
        window.addEventListener('popstate', onpopstate);
    }
    else {
        window.onhashchange = onhashchange;
    }
    
    function onhashchange () {
        var href = window.location.hash.replace(/^#!\/?/, '/');
        if (current !== href && /^#!/.test(window.location.hash)) {
            page.show(href);
        }
    }
    
    function onpopstate () {
        var href = /^#!/.test(window.location.hash)
            ? window.location.hash.replace(/^#!/, '/')
            : window.location.pathname
        ;
        page.show(href);
    }
    if (!page.hasPushState) onpopstate();
    
    return function (href) { return page.show(href) };
};

function Page (cb, opts) {
    if (!opts) opts = {};
    this.current = null;
    this.hasPushState = opts.pushState !== undefined
        ? opts.pushState
        : window.history && window.history.pushState
    ;
    this.cb = cb;
}

Page.prototype.show = function (href) {
    href = href.replace(/^\/+/, '/');
    if (this.current === href) return;
    current = href;
    this.cb(href);
    
    if (this.hasPushState) {
        var mismatched = window.location.pathname !== href;
        if (mismatched) window.history.pushState(null, '', href);
    }
    else if (window.location.hash !== '#!' + href) {
        if (window.location.pathname !== '/') {
            window.location.href = '/#!' + href;
        }
        else {
            window.location.hash = '#!' + href;
        }
    }
};
