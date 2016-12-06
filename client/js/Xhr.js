module.exports = Object.create( Object.assign( {}, require('../../lib/MyObject'), {

    Request: {

        constructor( data ) {
            var req = new XMLHttpRequest(),
                resolver, rejector

            req.onload = function() {
                this.status === 500
                    ? rejector( this.response )
                    : resolver( JSON.parse(this.response) )
            }

            if( data.method === "get" ) {
                let qs = data.qs ? `?${data.qs}` : '' 
                req.open( data.method, `/${data.resource}${qs}` )
                this.setHeaders( req, data.headers )
                req.send(null)
            } else {
                req.open( data.method, `/${data.resource}`, true)
                this.setHeaders( req, data.headers )
                req.send( data.data )
            }
            
            return new Promise( ( resolve, reject ) => { resolver = resolve; rejector = reject } )
        },

        plainEscape( sText ) {
            /* how should I treat a text/plain form encoding? what characters are not allowed? this is what I suppose...: */
            /* "4\3\7 - Einstein said E=mc2" ----> "4\\3\\7\ -\ Einstein\ said\ E\=mc2" */
            return sText.replace(/[\s\=\\]/g, "\\$&");
        },

        setHeaders( req, headers={} ) {
            req.setRequestHeader( "Accept", headers.accept || 'application/ld+json' )
            req.setRequestHeader("Content-Type", 'text/plain' )
        }
    },

    _factory( data ) {
        return Object.create( this.Request, { } ).constructor( data )
    },

    constructor() {

        if( !XMLHttpRequest.prototype.sendAsBinary ) {
          XMLHttpRequest.prototype.sendAsBinary = function(sData) {
            var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
            for (var nIdx = 0; nIdx < nBytes; nIdx++) {
              ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
            }
            this.send(ui8Data);
          };
        }

        return this._factory.bind(this)
    }

} ), { } ).constructor()
