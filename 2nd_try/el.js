class ${
    
    

    constructor( el, parent ){

        let _isWritten = false;
        let _isShowed = false;
        let _parent = parent || null;
        
        

        Object.defineProperty(this, "isWritten", {
            get : function () {
                return _isWritten;
            },
            set isWritten( value ){
                if( typeof value != 'boolean' )
                    return console.error('--- Need a boolean');

                _isWritten = value;

                return this;
            }
        });

        Object.defineProperty(this, "isShowed", {
            get : function () {
                return _isShowed;
            },
            set isShowed( value ){
                if( typeof value != 'boolean' )
                    return console.error('--- Need a boolean');

                _isShowed = value;

                return this;
            }
        });
        

        let el = {}
        
        return el
    }

    write(parent = null){
        
        if(parent instanceof HTMLElement){
            this.parent = parent;
        }

        if( this._parent != null && !this._isWritten ){
            this.parent.appendChild(this.$);
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


}