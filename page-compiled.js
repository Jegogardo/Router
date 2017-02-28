"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Page = function (_Bhv) {
    _inherits(Page, _Bhv);

    _createClass(Page, [{
        key: "trigger",
        get: function get() {
            return this._trigger;
        },
        set: function set(el) {
            this._trigger = el;

            if (el) this._trigger.pageParent = this;
        }
    }, {
        key: "pageContent",
        get: function get() {
            return this._pageContent;
        },
        set: function set(str) {

            var t = document.implementation.createHTMLDocument("");
            t.body.innerHTML = str;

            var arrS = [].slice.call(t.querySelectorAll("script"));
            for (var s in arrS) {
                if (arrS[s].outerHTML === "<script/>" || arrS[s].outerHTML === "<script></script>") {
                    arrS[s] = arrS.slice(s);
                    continue;
                }
                if (arrS[s].innerHTML == "" && arrS[s].getAttribute("src")) {
                    arrS[s].src = this.folder + arrS[s].getAttribute("src");
                } else arrS[s] = arrS.slice(s);
            }

            var arrL = [].slice.call(t.querySelectorAll("link"));
            for (var l in arrL) {
                if (arrL[l].outerHTML === "<link>") {
                    arrL[l] = arrL.slice(l);
                    continue;
                }
                if (arrL[l].innerHTML == "" && arrL[l].getAttribute("href")) {
                    arrL[l].href = this.folder + arrL[l].getAttribute("href");
                } else arrL[l] = arrL.slice(l);
            }

            //this.debug = arrL
            this._pageContent = t;
        }
    }], [{
        key: "ROOT",
        get: function get() {
            return "/";
        }
    }, {
        key: "CURRENT_ROOT",
        get: function get() {
            return Page.getDirByUrl(location.pathname);
        }
    }, {
        key: "EVENTS",
        get: function get() {
            return {
                onloading: "onPageLoading",
                onstart: "onPageLoadStart",
                ondone: "onPageLoadDone",
                onback: "onBackPage",
                onforward: "onForwardPage"
            };
        }
    }]);

    function Page(url) {
        var trigger = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, Page);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Page).call(this));

        _this.filename = Page.getFilenameByUrl(url);
        _this.name = Page.getNameByUrl(url);
        _this.url = url == "" ? "." : url; //this.filename+"/"+this.name
        _this.folder = Page.getDirByUrl(url);
        _this.dependicies = {
            scripts: {},
            stylesheets: {}
        };
        _this.isCached;
        _this.isCurrentPage = false;
        _this.trigger = trigger || null;
        _this._pageContent = null; //= document.implementation.createHTMLDocument(Page.extractNameFromUrl( url ))
        _this.hub = new Hub(_this.url);
        _this._events = Page.EVENTS;
        for (var i in _this._events) {
            var temp = document.createEvent("Event");
            temp.initEvent(_this._events[i], true, true);
            temp.page = _this;
            _this._events[i] = temp;
        }

        return _this;
    }

    _createClass(Page, [{
        key: "load",
        value: function load() {
            var _this2 = this;

            if (!this.isCached) {
                document.dispatchEvent(this._events.onstart);
                this.hub.ondone = function (result) {
                    _this2.isCached = true;
                    _this2.pageContent = result.responseText;

                    document.dispatchEvent(_this2._events.ondone);
                    //this.debug
                };
                //document.dispatchEvent( this._events.onloading )
                this.hub.connect();
            }
            return this;
        }
    }, {
        key: "reload",
        value: function reload() {
            this.isCached = false;
            this.load();

            return this;
        }
    }], [{
        key: "getFilenameByUrl",
        value: function getFilenameByUrl(url) {
            //debugger
            if (url.endsWith("/")) return ".";

            return url.substring(url.lastIndexOf("/") + 1);
        }
    }, {
        key: "getNameByUrl",
        value: function getNameByUrl(url) {
            //debugger
            var str = Page.getFilenameByUrl(url);
            if (str == ".") return str;else return str.substring(0, str.lastIndexOf("."));
        }
    }, {
        key: "getDirByUrl",
        value: function getDirByUrl(url) {
            if (!url.endsWith("/")) {
                url = url.substring(0, url.lastIndexOf("/") + 1);
            } else {
                if (url.indexOf(location.origin) == 0) {
                    url = url.split(location.origin)[1];
                }
            }

            return url;
        }
    }, {
        key: "load",
        value: function load(url) {
            var temp = new Page(url);
            temp.load();
            return temp;
        }
    }, {
        key: "currentPage",
        value: function currentPage() {
            var currentPage = new Page(location.pathname);
            currentPage.isCurrentPage = true;
            return currentPage;
        }
    }]);

    return Page;
}(Bhv);

var iframe = document.querySelector("iframe");
var page = Page.load("prova/prova.html");
document.addEventListener("onPageLoadDone", function () {
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(page.pageContent.documentElement.innerHTML);
    iframe.contentWindow.document.close();
});
