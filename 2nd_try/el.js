'use strict';
class ${



    constructor( el, parent ){

        let _isWritten = false;
        let _isShowed = false;
        let _parent = parent || null;
        let _$ = null;



        Object.defineProperty(this, "isWritten", {
            get : function () {
                return _isWritten;
            },
            set: function( value ){
                //debugger
                if( typeof value != 'boolean' )
                    throw new Error('Need a boolean');

                _isWritten = value;

                return this;
            }
        });

        Object.defineProperty(this, "isShowed", {
            get : function () {
                return _isShowed;
            }
        });

        Object.defineProperty(this, "parent", {
            get : function () {
                return _parent || null;
            },
            set: function( value ){
                //debugger;
                if( typeof value instanceof HTMLElement )
                    throw new Error('Need an HMTLElement');

                _parent = value;

                return this;
            }
        });

        Object.defineProperty(this, '$',{
            get: function(){
                return _$ || null;
            },
            set: function(value){
                if( typeof value instanceof HTMLElement )
                    throw new Error('Need an HMTLElement');

                _$ = value;

                return this;

            }
        })


        // debugger
        this.$  = $.new(el, parent)
        let self = _$;
        self.$ = Object.assign(this);
        _parent = this.$.parentElement;
        return self;
    }

    write(parent = null){

        if(parent != null){
            this.parent = parent;
            this.parent.appendChild(this.$);
            this.isWritten = true;
        }
        else{
            if(this.parent != null){
                this.parent.appendChild(this.$);
                this.isWritten = true;
            }
            else{
                throw new Error('Need a parent');
            }
        }

        return this;
    }

    remove(removeParentToo = false){

        if( this.parent != null && this.isWritten ){
            this.parent.removeChild(this.$);
            this.isWritten = false;
        }

        if(removeParentToo)
            this.parent = null;

        return this;

    }

    show(){



    }

    hide(){}

    static new(node, toWrite) {

        if( typeof node == "string"){
            var string = node.split(",");

            var el = document.createElement( string[0].trim() );
            if( string[1] != undefined )
                string[1].trim() == "" ? false : el.id = string[1].trim();
            if ( string[2] != undefined) {
                string[2].indexOf(" ") == 0 ? string[2] = string[2].substr(1) : false;
                var theclass = string[2].split(" ");
                for (var i in theclass)
                    classie.add(el, theclass[i]);
            }
        }

        if( typeof node == "object" ){

            if (node.el == null ) {
                console.error("Need a name of HTMLElement at least");
                return;
            }
            else {
                var el = document.createElement(node.el);

                node.id === undefined ? false : el.id = node.id;

                if (node.theclass != undefined) {
                    node.theclass = node.theclass.split(" ");
                    for (var i in node.theclass)
                        classie.add(el, node.theclass[i]);
                }

                if (node.data != undefined) {
                    for (var i in node.data) {
                        var attr = document.createAttribute(i);
                        // Don't use setAttribute( string, string) cause
                        // doesn't respect the uppercase
                        attr.value = node.data[i];
                        el.setAttributeNode(attr);
                    }
                }


            }
        }
        if( typeof toWrite != "undefined" )
            toWrite.appendChild( el );
        return el;
    }

}

let span = new $('span,id_span,class_span class_span2')
span.textContent = 'prova';






