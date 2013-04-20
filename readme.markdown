# single-page

write single-page apps with a single callback to handle pushState events

# example

Given some html with elements `#foo`, `#bar`, and `#baz`:

``` html
<html>
  <style>
  </style>
  <body>
    <div id="foo">
      foo foO fOo fOO Foo FoO FOo FOO
      <div><a href="/bar">bar</a></div>
    </div>
    
    <div id="bar">
      bar baR bAr bAR Bar BaR BAr BAR
      <div><a href="/baz">baz</a></div>
    </div>
    
    <div id="baz">
      baz baZ bAz bAZ Baz BaZ BAz BAZ
      <div><a href="/foo">foo</a></div>
    </div>
    
    <script src="bundle.js"></script>
  </body>
</html>
```

Now turn each of the divs into pages with their own routes.
Note that this module doesn't update the link callbacks for you. You'll need to
handle that for yourself.

``` js
var divs = {
    foo: document.querySelector('#foo'),
    bar: document.querySelector('#bar'),
    baz: document.querySelector('#baz')
};

var singlePage = require('single-page');
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
```

You'll need to have a server that will serve up the same static content for each
of the pushState routes. Something like this will work:

``` js
var http = require('http');
var ecstatic = require('ecstatic')(__dirname);

var server = http.createServer(function (req, res) {
    if (/^\/[^\/.]+$/.test(req.url)) {
        req.url = '/';
    }
    ecstatic(req, res);
});
server.listen(5000);
```

Now when you go to `http://localhost:5000` and click around, you'll see `/foo`,
`/bar` and `/baz` in the address bar when you click links, even though you're
not reloading the page.

# methods

``` js
var singlePage = require('single-page')
```

## var showPage = singlePage(cb, opts)

Fire `cb(href, page)` at the start and whenever the page navigation changes so
you can update the page contents accordingly.

If `opts.saveScroll` is `!== false`, `page.scrollX` and `page.scrollY` are saved
for every unique `href` so that you can jump back to the same scroll position
that the user left off at.

## showPage(href)

Navigate to `href`, firing the callback passed to singlePage.

## showPage.push(href)

Update the location href in the address bar without firing any callbacks.

# install

With `npm` do:

```
npm install single-page
```

Use [browserify](http://browserify.org) do bundle this module into your
application.

# license

MIT
