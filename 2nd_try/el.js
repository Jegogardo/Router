let protectedFoo = new WeakMap();

class ${



    constructor( el, parent ){

        let _isWritten = false;
        let _isShowed = false;
        let _parent = parent || null;
        let id = Symbol('$');
        


        Object.defineProperty(this, "isWritten", {
            get : function () {
                return _isWritten;
            },
            set: function( value ){
                debugger
                if( typeof value != 'boolean' )
                    throw new Error('Need a boolean');

                _isW = value;

                return this;
            }
        });

        Object.defineProperty(this, "isShowed", {
            get : function () {
                return _isShowed;
            }
        });
        
        this[prop] = function( value ){
                if( typeof value != 'boolean' )
                    throw new Error('Need a boolean');

                _isShowed = value;

                return this;
        }
        
        Object.defineProperty(this, "parent", {
            get : function () {
                return _parent || null;
            },
            set: function( value ){
                debugger;
                if( typeof value instanceof HTMLElement )
                    throw new Error('Need an HMTLElement');

                _parent = value;

                return this;
            }
        });
        
        

        


      //  debugger
        let self  = $.new(el, parent)
        self.$ = Object.assign(this);
        _parent = self.parentElement;
        return self;
    }

    write(parent = null){
            
        this.parent = parent;

        if( this._parent != null && !this._isWritten ){
            this._parent.appendChild(this);
            this._isWritten = true;
        }

        return this;
    }

    remove(){

        if( this._parent != null && this._isWritten ){
            this._parent.removeChild(this.$);
            this._isWritten = false;
        }

        return this;

    }

    show(){



    }

    hide(){}

    changeShowed( value){
        debugger
        this[prop](value)
    }
    
    
    
    static new(node, toWrite) {
        // Crea Html element per comodità
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

let span = new $('span,id_span,class_span')