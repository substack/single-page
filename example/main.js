var divs = {
    foo: document.querySelector('#foo'),
    bar: document.querySelector('#bar'),
    baz: document.querySelector('#baz')
};

var singlePage = require('../');
var showPage = singlePage(function (href) {
    Object.keys(divs).forEach(function (key) {
        hide(divs[key]);
    });
    
    var div = divs[href.replace(/^\//, '')];
    if (div) show(div)
    else show(divs.foo)
    
    function hide (e) { e.style.display = 'none' }
    function show (e) { e.style.display = 'block' }
});

var links = document.querySelectorAll('a[href]');
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        showPage(this.getAttribute('href'));
    });
}
