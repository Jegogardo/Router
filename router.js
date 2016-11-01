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

        document.addEventListener("onPageLoadEnd", ( result )=>{

            this.currentPage = this.newPage
            this.newPage = null
        })
        this.newPage.load()



    }







}




//var t = new Page("prova/prova2/misc.html")

//t.debug
/*document.addEventListener( "onPageLoadStart", (e)=>{
    console.log("inizio load")
} )
document.addEventListener( "onPageLoadEnd", (e)=>{
    console.log("fine load")
    console.log(e.page.pageContent)
} )
/*document.addEventListener( "onPageLoading", (e)=>{
    console.log(i++)
} */
//t.load()
let r = new Router( "nav", "div#wrapper" )
r.debug
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


