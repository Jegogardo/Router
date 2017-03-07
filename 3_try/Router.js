/**
 * Created by netwo on 28/02/2017.
 */
class Router{


    constructor(){
        this.pages = [];
        this.currentPage = null;
        this.previousPage =  null;
        this.staticEl = null;
        this.events = {"loadedStaticEl":null,};
        this.reloadPageAnyTime = false;


        window.onpopstate = this.updateUrl.bind(this);
    }

    addPage( url, name ){
        let newPage = new Page(url,name);
        document.body.appendChild(newPage.el);
        newPage.iframe.addEventListener("click",this.selectPage.bind(this, newPage), true);
        //newPage.load();

        this.pages.push(newPage);
    }

    selectPage(pageToSelect,e){
        if(e != null)
            e.preventDefault();

        if(this.pages.length == 0){
            this.waitToSelection(pageToSelect);
            return;
        }
        else{
            document.removeEventListener("loadedStaticEl",this.events.loadedStaticEl);
        }

        if(this.currentPage != null) {
            this.currentPage.el.classList.remove("pageSelected");
            this.previousPage = this.currentPage;
        }


        this.currentPage = this.pages[pageToSelect];
        this.currentPage.el.classList.add("pageSelected");


        document.title = this.currentPage.name;
        if(this.reloadPageAnyTime == true && this.currentPage.isLoaded ){
            this.currentPage.reload();
        }
        else{
            if( !this.currentPage.isLoaded ){
                this.currentPage.load();
                //this.updateUrl(/*this.currentPage.url*/);
            }

        }

        if( this.previousPage != this.currentPage && this.previousPage != null &&
            this.reloadPageAnyTime) {
            this.previousPage.unload();
            return;
        }

        this.updateUrl();


    }
    addStaticEl(url){
        this.events.loadedStaticEl = document.createEvent('Event');
        this.events.loadedStaticEl.initEvent("loadedStaticEl",true,true);

        let hub = new Hub(url);
        hub.onsuccess = (result) =>{
            let parser = new DOMParser().parseFromString(result.response, "text/html");
            this.staticEl = parser.querySelector("body").childNodes[0];
            document.body.appendChild(this.staticEl);
            /*if(this.events.getPageFromStaticEl != null)
                document.dispatchEvent(this.events.getPageFromStaticElEvent);
             */
            for( let i=0; i< this.staticEl.childElementCount; i++){
                let link = this.staticEl.children[i];
                this.addPage(link.href,link.title,link);
                link.addEventListener("click",this.selectPage.bind(this,i));
            }

            if(this.isWaitingToSelection)
                document.dispatchEvent(this.events.loadedStaticEl);

        }
        hub.connect();
    }

    waitToSelection(pageToSelect){
        this.isWaitingToSelection = true;
        document.addEventListener("loadedStaticEl", this.selectPage.bind(this,pageToSelect));
    }

    updateUrl(event){
        if(event != null){
            event.preventDefault();
            this.selectPage(this.pages.indexOf(this.previousPage));
            return;
        }
        if(this.previousPage != null && event != null && event.state == null)
            history.pushState({page: this.pages.indexOf(this.currentPage)}, this.currentPage.name, this.currentPage.name);
    }


}


