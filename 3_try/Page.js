/**
 * Created by netwo on 28/02/2017.
 */
const TIME_START_LOADING = 500;

class Page{



    get isLoading(){return this._isLoading;}
    set isLoading( value ){
        if(typeof value != "boolean"){
            throw Error("--- Need a boolean value");
        }

        if(value) {
            this.el.classList.add("pageLoading");
            this.isloaded = false;
            this._isLoading = true;
        }
        else {
            this.el.classList.remove("pageLoading");
            this.isLoaded = true;
            this._isLoading = false;
        }

    }

    constructor( url, name = null, handler = null ){
        this.url = url;
        this.name = name;
        this.handler = handler;
        this.hub = new Hub(this.url);
        this.el = document.createElement("div");
            this.el.classList.add("page");
                this.el.title = this.name;

        this.iframe = document.createElement("iframe");
            this.el.appendChild(this.iframe);

        this._isLoading = false;
        this.isLoaded = false;

        this.initEvent();
    }


    load(){
        this.hub.connect();
    }

    unload(){
        this.iframe.src=""
        /*this.iframe.contentDocument.open();
        this.iframe.contentDocument.write();*/
        this.isLoading = false;
        this.isLoaded = false;

    }

    reload(){
        this.unload();
        this.load();
    }

    initEvent(){
        this.hub.onsuccess = (result) =>{
            // this.el.innerHTML = result.response;
            this.iframe.contentDocument.open();
            this.iframe.contentDocument.write(result.response);
            this.iframe.contentDocument.close();
        }
        this.hub.ondone = (result) =>{
            this.isLoading = false;
            clearInterval(this.handlePendingTimeout);
        }
        this.hub.onerror = (resutl)=>{
            this.unload();
            this.iframe.contentDocument.write("Pagina non trovata");
        }
        this.hub.onstart = () =>{
            this.handlePendingTimeout = setTimeout(function () {
                if( !this.isLoaded )
                    this.isLoading = true;
            }.bind(this),TIME_START_LOADING)

        }
    }
}