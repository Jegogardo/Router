'use strict'
class Router extends Bhv {

    get staticEl() { return this._staticEl }
    set staticEl(wildcard) {
        /*if( typeof wildcard == "object" ){

        }*/

        let el = document.querySelector(wildcard);
        el.setAttribute("data-role","router")
        if( el.childElementCount == 0 )
            console.error(`The ${wildcard} element can't be empty`)
            else{
                let arr = [].slice.call(el.children)
                for(let i in arr){
                    if( 'href' in arr[i] ){
                        if( arr[i].href != "" ){
                            let href = arr[i].href.split(location.href)[1]
                            arr[i].setAttribute("data-url", href == ""? ".": href )
                            //arr[i].removeAttribute("href")
                        }
                        else
                            return console.error("Must define the attribute 'href' in the 'a' element")
                            }



                    let url
                    if( url = arr[i].getAttribute("data-url") ){
                        if( arr[i].textContent !== "" )
                            this.addPage( url, arr[i] )
                            else
                                return console.error("No text found in this element")
                                }
                    else
                        return console.error("No attribute href or data-url value found")


                        }
            }
    }

    get currentPage(){ return this._currentPage }
    set currentPage( page ){

        if(page instanceof Page){
            if( this.newPage  ){
                this.lastPage = this._currentPage
                this._pageWrapper.innerHTML = page.pageContent
            }
            this._currentPage = page

            // localStorage.setItem("currentPage",JSON.stringify(page))
        }
        else
            console.error("The currentPage must be a Page")
            };

    get pageWrapper(){return this._pageWrapper}
    set pageWrapper( el ){
        this._pageWrapper = document.querySelector( el )
        this._pageWrapper.setAttribute("data-role","wrapper")
    }



    constructor( wildcard = null, pageWrapper = null){
        super()
        this.pages = {}
        this.currentPage = Page.currentPage()
        this.staticEl = wildcard || console.error("Must pass the CSSselector of the staticEl")
        this.pageWrapper = pageWrapper || console.error("Must pass the CSSselector of the wrapper")
        this.stack = []
        this.lastPage = null
        this.newPage = null
        this.stack.append = this.currentPage

    }

    addPage( ...newPage ){
        let page = new Page( newPage[0], newPage[1] )
        if( page.filename === this.currentPage.filename )
            this.currentPage = this.pages[ this.currentPage.filename ] = page 
            else
                this.pages[ page.filename ] = page

                page.trigger.addEventListener("click", this.changePage.bind(this))
    }

    changePage( e ){
        e.preventDefault()

        this.newPage = e.target.pageParent;

        this.newPage.hub.ondone = ( result )=>{
            this.newPage.pageContent = result.response
            this.newPage.isCached = true
            this.currentPage = this.newPage
            this.newPage = null
        }
        this.newPage.load()



    }







}


class Page extends Bhv{

    static get ROOT(){ return "/"}
    static get CURRENT_ROOT(){return location.pathname}

    static get EVENTS(){ return {
                        loading:"onPageLoading", start:"onPageLoadStart",
                        end:"onPageLoadEnd", back:"onBackPage", forward:"onForwardPage" } }

    get trigger(){ return this._trigger }
    set trigger( el ){
        this._trigger = el
        if( el )
            this._trigger.pageParent = this
    }

    constructor( url, trigger = null ){
        super()
        this.filename = Page.getFilenameByUrl( url )
        this.name = Page.getNameByUrl( url )
        this.url = url == ""? ".": url //this.filename+"/"+this.name
        this.folder = Page.getDirByUrl( url )
        this.dependicies = {
            scripts:{},
            stylesheets:{}
        }
        this.isCached;
        this.isCurrentPage = false
        this.trigger = trigger || null
        this.pageContent //= document.implementation.createHTMLDocument(Page.extractNameFromUrl( url ))
        this.hub = new Hub( this.url )
        this._events = Page.EVENTS
        for( let i in this._events  ){
            let temp = document.createEvent("Event")
            temp.initEvent( this._events[ i ], true, true )
            temp.page = this
            this._events[ i ] = temp
        }

    }


    static getFilenameByUrl( url ){
        //debugger
        if( url.endsWith( "/" ) )
            return "."

            return url.substring( url.lastIndexOf("/")+1 )
    }

    static getNameByUrl( url ){
        //debugger
        let str = Page.getFilenameByUrl( url )
        if( str == "." )
            return str;
        else
            return str.substring( 0, str.lastIndexOf(".") );
    }

    static getDirByUrl( url ){
        if( !url.endsWith( "/" ) ){
            url = url.substring(0, url.lastIndexOf("/")+1)
        }
        else{
            if( url.indexOf( location.origin ) == 0 ){
                url = url.split( location.origin )[1]
            }
        }

        return url
    }


    static currentPage(){
        let currentPage = new Page( location.pathname )
        currentPage.isCurrentPage = true
        return currentPage
    }

    load(){
        document.dispatchEvent( this._events.start )
        this.hub.ondone = ( result )=>{

            this.pageContent = result.response

            document.dispatchEvent( this._events.end )

        }
        //document.dispatchEvent( this._events.loading )
        this.hub.connect()
    }



}

var t = new Page(".")

var i = 0;
//t.debug
document.addEventListener( "onPageLoadStart", (e)=>{
    console.log("inizio load")
} )
document.addEventListener( "onPageLoadEnd", (e)=>{
    console.log("fine load")
    console.log(e.page.pageContent)
} )
/*document.addEventListener( "onPageLoading", (e)=>{
    console.log(i++)
} */
t.load()
//let r = new Router( "nav", "div#wrapper" )
//r.debug
/*

usage
    rt.staticEl = "nav.navbar" // CSSselector
    the staticEl must contain a element with the href attribute setted or 
    if you are using someone else element in place of 'a' you must set the attribute data-url
    to the url that point at the specific page.



    rt.staticEl = {
        nav:{
            Home:"index.html",
            Misc:"misc.html", // Won't find 'cause it's inside 'prova' folder
            About:"prova/about.html",
            Pics:"prova/pics.js", // won't work 'cause Router accept only .html or .php file
            Contact:"prova/contact.html"
        },
        classEl: "foo", // class CSS assigned to the staticEl element (in this example: nav)
        classLinks: "fooLinks" // class CSS assigned to each links inside staticEl element
        classActiveLink: "fooActiveLink", // class CSS assigned to the link active, so actual page choosen
        classHoverLink: "fooHoverLink", // class CSS assigned to the link hovered
        idClassEl: "fooId" // id assigned to staticEl element

    }   // this setter will create a nav HTMLElement 

*/


//let links = [].slice.call(document.querySelectorAll("nav > a"));
/*let arr = ["http://192.168.1.6/Behaviour/Router/", "http://192.168.1.6/Behaviour/Router/index.html", "http://192.168.1.6/Behaviour/Router/pics.html", "http://192.168.1.6/Behaviour/Router/prova/contact.html", "http://192.168.1.6/Behaviour/Router/prova/prova2/misc.html", "http://192.168.1.6/Behaviour/about.html", "http://192.168.1.6/Behaviour/Router/prova/prova.html"]

console.groupCollapsed( "Filename" )
arr.forEach(( link )=>{
    console.log(Page.getFilenameByUrl( link))
})

console.groupEnd(  )

console.groupCollapsed( "Name" )
arr.forEach(( link )=>{
    console.log(Page.getNameByUrl( link ))
})
console.groupEnd(  )


console.groupCollapsed( "Directory" )
arr.forEach(( link )=>{
    console.log(Page.getDirByUrl( link ))
})
console.groupEnd(  )*/


/*
["http://192.168.1.6/Behaviour/Router/",
"http://192.168.1.6/Behaviour/Router/index.html", "http://192.168.1.6/Behaviour/Router/pics.html", "http://192.168.1.6/Behaviour/Router/prova/contact.html", "http://192.168.1.6/Behaviour/Router/prova/prova2/misc.html", "http://192.168.1.6/Behaviour/about.html", "http://192.168.1.6/Behaviour/Router/prova/prova.html"]
*/





