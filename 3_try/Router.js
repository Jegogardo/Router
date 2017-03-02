/**
 * Created by netwo on 28/02/2017.
 */
class Router{


    constructor(){
        this.pages = [];
        this.currentPage = null;
        this.staticEl = null;
        this.events = {"getPageFromStaticElEvent":document.createEvent('Event'),};
        this.reloadPageAnyTime = false;
    }

    addPage( url, name ){
        let newPage = new Page(url,name);
        document.body.appendChild(newPage.el);
        newPage.iframe.addEventListener("click",this.selectPage.bind(this, newPage), true);
        newPage.load();

        this.pages.push(newPage);
    }

    loadPage(){}

    selectPage(pageToSelect,e){
        e.preventDefault();

        if(this.currentPage != null)
            this.currentPage.el.classList.remove("pageSelected");

        this.currentPage = this.pages[pageToSelect];
        this.currentPage.el.classList.add("pageSelected");

        if(this.reloadPageAnyTime == true ){
            this.currentPage.load();
            this.currentPage.unload();
        }

    }
    addStaticEl(url){
        let hub = new Hub(url);
        hub.onsuccess = (result) =>{
            let parser = new DOMParser().parseFromString(result.response, "text/html");
            this.staticEl = parser.querySelector("body").childNodes[0];
            document.body.appendChild(this.staticEl);
            document.dispatchEvent(this.events.getPageFromStaticElEvent);

        }
        hub.connect();
    }

    getPageFromStaticEl(){
        if( this.staticEl == null ) {
            this.events.getPageFromStaticElEvent.initEvent("staticElPending",true,true);
            document.addEventListener("staticElPending", this.getPageFromStaticEl.bind(this));
            return;
        }
        for( let i=0; i< this.staticEl.childElementCount; i++){
            let t = this.staticEl.children[i];
            this.addPage(t.href,t.title);
            t.addEventListener("click",this.selectPage.bind(this,i));
        }
    }


}