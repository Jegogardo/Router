class Page extends Bhv {

    static get ROOT() {
        return "/"
    }
    static get CURRENT_ROOT() {
        return Page.getDirByUrl(location.pathname)
    }

    static get EVENTS() {
        return {
            onloading: "onPageLoading",
            onstart: "onPageLoadStart",
            ondone: "onPageLoadDone",
            onback: "onBackPage",
            onforward: "onForwardPage"
        }
    }

    get trigger() {
        return this._trigger
    }
    set trigger(el) {
        this._trigger = el

        if (el)
            this._trigger.pageParent = this
    }

    get pageContent() {
        return this._pageContent
    }
    set pageContent(str) {

        var t = document.implementation.createHTMLDocument("")
        t.body.innerHTML = str

        let arrS = [].slice.call(t.querySelectorAll("script"))

        for (let s in arrS) {
            if (arrS[s].innerHTML == "" &&
                arrS[s].getAttribute("src")) {

                arrS[s].src = this.folder + arrS[s].getAttribute("src")

            }

        }

        let arrL = [].slice.call(t.querySelectorAll("link"))

        for (let l in arrL) {

            if (arrL[l].innerHTML == "" && arrL[l].getAttribute("href")) {
                arrL[l].href = this.folder + arrL[l].getAttribute("href")

            }
        }

        
        this.dependicies.scripts = arrS
        this.dependicies.stylesheets = arrL
        //this.debug = arrL
        this._pageContent = t
    }

    constructor(url, trigger = null) {
        super()
        this.filename = Page.getFilenameByUrl(url)
        this.name = Page.getNameByUrl(url)
        this.url = url == "" ? "." : url //this.filename+"/"+this.name
        this.folder = Page.getDirByUrl(url)
        this.dependicies = {
            scripts: [],
            stylesheets: []
        }
        this.isCached;
        this.isCurrentPage = false
        this.trigger = trigger || null
        this._pageContent = null //= document.implementation.createHTMLDocument(Page.extractNameFromUrl( url ))
        this.hub = new Hub(this.url)
        this._events = Page.EVENTS
        for (let i in this._events) {
            let temp = document.createEvent("Event")
            temp.initEvent(this._events[i], true, true)
            temp.page = this
            this._events[i] = temp
        }


    }


    static getFilenameByUrl(url) {
        //debugger
        if (url.endsWith("/"))
            return "."

        return url.substring(url.lastIndexOf("/") + 1)
    }

    static getNameByUrl(url) {
        //debugger
        let str = Page.getFilenameByUrl(url)
        if (str == ".")
            return str;
        else
            return str.substring(0, str.lastIndexOf("."));
    }

    static getDirByUrl(url) {
        if (!url.endsWith("/")) {
            url = url.substring(0, url.lastIndexOf("/") + 1)
        } else {
            if (url.indexOf(location.origin) == 0) {
                url = url.split(location.origin)[1]
            }
        }

        return url
    }

    static load(url) {
        let temp = new Page(url)
        temp.load()
        return temp
    }

    static currentPage() {
        let currentPage = new Page(location.pathname)
        currentPage.isCurrentPage = true
        return currentPage
    }

    load() {
        if (!this.isCached) {
            document.dispatchEvent(this._events.onstart)
            this.hub.ondone = (result) => {
                    this.isCached = true
                    this.pageContent = result.responseText

                    document.dispatchEvent(this._events.ondone)
                        //this.debug
                }
                //document.dispatchEvent( this._events.onloading )
            this.hub.connect()

        }
        else{
            document.dispatchEvent(this._events.onstart)
            document.dispatchEvent(this._events.ondone)
        }
        return this
    }

    reload() {
        this.isCached = false
        this.load()

        return this
    }





}
var iframe = document.querySelector("iframe")
let page = Page.load("prova/prova.html");
document.addEventListener("onPageLoadDone", () => {
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(page.pageContent.documentElement.innerHTML);
    iframe.contentWindow.document.close();
})
