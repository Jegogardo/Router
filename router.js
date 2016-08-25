class Router extends Bhv {

    get staticEl() { return this._staticEl }
    set staticEl(wildcard) {
        /*if( typeof wildcard == "object" ){

        }*/

        let el = document.querySelector(wildcard);
        //debugger
        if( el.childElementCount == 0 )
            console.error(`The ${wildcard} element can't be empty`)
        else{
            let arr = [].slice.call(el.children)
            for(let i in arr){
                if( 'href' in arr[i] ){
                    arr[i].setAttribute("data-url", arr[i].href )
                }
                
                let url
                if( url = arr[i].getAttribute("data-url") ){
                    if( arr[i].textContent !== "" )
                        this.addPage( arr[i].textContent, url )
                    else
                        console.error("No text found in this element")
                }                
                else
                    console.error("No attribute href or data-url value found")

                
            }
        }
    }

    get currentPage(){ return this._currentPage }
    set currentPage( page ){ 
        page instanceof Page? this._currentPage = page: console.error("The currentPage must be a Page")
     }

     constructor( wildcard = null ){
         super()
         this.pages = {}
         this.staticEl = wildcard || console.error("Must pass the CSSselector of the staticEl")
     }

     addPage( ...newPage ){
         let page = new Page( newPage[0], newPage[1] )
         this.pages[ page.name ] = page 
     }

     

}


class Page{

    constructor( name, url ){
        this.filename = url.substring( url.lastIndexOf("/")+1 )
        this.name = this.filename.substring( 0, this.filename.lastIndexOf(".") )
        this.url = url
        this.rootFolder = super.rootFolder
        this.folder
        this.dependicies = {
            scripts:{},
            stylesheets:{}
        }
        this.isCached
        this.currentPage = false
    }

}

let r = new Router( "nav" )

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