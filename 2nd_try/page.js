/**
*
*   Router, all page in one
*   @description
*/

/**
*   
*   @param {string} url
*   @return {page} this
*/

'use strict'

class Page{

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

    constructor(){

        this._name = null;
        this._url = null;
        this._dependencies = {
            scripts:[],
            links:[]
        }


    }

    load(){}

    open(){}





}

