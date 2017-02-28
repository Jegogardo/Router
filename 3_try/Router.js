/**
 * Created by netwo on 28/02/2017.
 */
class Router{


    constructor(){
        this.pages = [];
        this.currentPage = null;

    }

    addPage( url, name ){
        let newPage = new Page(url,name);
        document.body.appendChild(newPage.el);
        newPage.load();
        newPage.el.addEventListener("click",this.selectPage.bind(this, newPage));

        this.pages.push(newPage);
    }

    loadPage(){}

    selectPage(pageToSelect,e){

        if(this.currentPage != null)
            this.currentPage.el.classList.remove("pageSelected");

        this.currentPage = pageToSelect;
        this.currentPage.el.classList.add("pageSelected");

    }


}