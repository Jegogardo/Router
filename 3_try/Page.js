/**
 * Created by netwo on 28/02/2017.
 */
const TIME_START_LOADING = 500;

class Page{



    get isLoading(){return this.isLoading;}
    set isLoading( value ){
        if(typeof value != "boolean"){
            throw Error("--- Need a boolean value");
        }

        if(value) {
            this.el.classList.add("pageLoading");
            this.isloaded = false;
        }
        else {
            this.el.classList.remove("pageLoading");
            this.isLoaded = true;
        }

    }

    constructor( url, name = null ){
        this.url = url;
        this.name = name;
        this.hub = new Hub(this.url);
        this.el = document.createElement("div");
            this.el.classList.add("page");
                this.el.title = this.name;

        this.iframe = document.createElement("iframe");
            this.el.appendChild(this.iframe);

        this.isLoading = false;
        this.isLoaded = false;


    }


    load(){
        this.hub.onsuccess = (result) =>{
            this.isLoading = false;
           // this.el.innerHTML = result.response;
            this.iframe.contentDocument.open();
            this.iframe.contentDocument.write(result.response);
            this.iframe.contentDocument.close();
        }
        this.hub.onstart = () =>{
            setTimeout(function () {
                if( !this.isLoaded )
                    this.isLoading = true;
            }.bind(this),TIME_START_LOADING)

        }
        this.hub.connect();


    }
    unload(){
        this.iframe.innerHTML = "";
    }
}