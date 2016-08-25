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
                        this.addPage( url )
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
            this._currentPage = page
            localStorage.setItem("currentPage",JSON.stringify(page))
        }
        else
            console.error("The currentPage must be a Page")
     }

     constructor( wildcard = null ){
         super()
         this.pages = {}
         this.currentPage = Page.currentPage()
         this.staticEl = wildcard || console.error("Must pass the CSSselector of the staticEl")

         
     }

     addPage( ...newPage ){
         let page = new Page( newPage[0], newPage[1] )
         if( page.filename === this.currentPage.filename )
            this.pages[ this.currentPage.filename ] = this.currentPage
         else
            this.pages[ page.filename ] = page 
     }


     
     

}


class Page{    

    constructor( url ){
        this.filename = Page.extractFileNameFromUrl( url )
        //this.name = name
        this.url = url == ""? ".": url //this.filename+"/"+this.name
        this.rootFolder = super.rootFolder
        this.folder;
        this.dependicies = {
            scripts:{},
            stylesheets:{}
        }
        this.isCached;
        this.isCurrentPage = false
    }

    static extractNameFromUrl( url ){
        if( url.substring( url.length-1, url.length ) == "/" || url.substring( url.length-1, url.length ) == "\\"  )
            return "index" 

        return url.substring( url.lastIndexOf("/")+1, url.lastIndexOf(".") )
    }

    static extractFileNameFromUrl( url ){
        if(url == "" || url == "." || url.substring( url.length-1, url.length ) == "/" || url.substring( url.length-1, url.length ) == "\\"  )
            return "index.html"

        return url.substring( url.lastIndexOf("/")+1 )
    }

    static currentPage(){
         let currentPage = new Page( location.pathname.split(location.pathname)[1] )
         currentPage.isCurrentPage = true
         return currentPage
    }

    

}

let r = new Router( "nav" )
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