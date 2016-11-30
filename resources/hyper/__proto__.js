module.exports = Object.assign( { }, require('../../lib/MyObject'), {
   
    Mongo: require('../../dal/Mongo'),

    Validate: require('../.Validate'),

    _addViewAction( document ) {
        this.potentialAction.push( {
            "@type": `ViewAction`,
            "name": `View ${this.path[1]}`,
            "instrument": { "description": 'Mouse', "potentialAction": { description: "click" } },
            "target": {
                "actionApplication": 'Enterprise',
                "contentType": "text/html",
                "httpMethod": "GET",
                "urlTemplate": `https://${process.env.DOMAIN}:${process.env.PORT}/${this.path[1]}/document._id`
            },
            "object": {
                "@type": `http://schema.org/ItemList`
            }
        } )
    },
    
    apply( method ) {
        return this.Validate.GET( this ).then( () => this.GET() )
    },

    GET() {
        this.potentialAction = [ {
            "@type": `CreateAction`,
            "name": `Create ${this.path[1]}`,
            "instrument": { "description": 'Mouse', "potentialAction": { description: "click" } },
            "target": {
                "actionApplication": 'Enterprise',
                "contentType": "application/json",
                "httpMethod": "POST",
                "urlTemplate": `https://${process.env.DOMAIN}:${process.env.PORT}/${this.path[0]}`
            },
            "object": {
                "@type": `http://schema.org/${this.path[0]}`
            }
        } ]

        return this.Mongo.getDB()
        .then( db =>
            this.Mongo.forEach( db.collection( this.path[0] ).find(), this._addViewAction, this )
            .then( () => db.close() )
            .then( () =>
                Promise.resolve(
                    this.respond( {
                        body: { 
                            "@context": "http://schema.org",
                            "@id": `https://${process.env.DOMAIN}:${process.env.PORT}`,
                            "@type": `ItemList`,
                            name: this.path[0],
                            description: `A list of ${this.path[0]} Objects`,
                            potentialAction: this.potentialAction
                        }
                    } )
                )
            )
        )
    },

    end( data ) {
        return new Promise( resolve => {
            data.body = JSON.stringify( data.body )
            this.response.writeHead( data.code || 200, Object.assign( this.getHeaders( data.body ), data.headers || {} ) )
            this.response.end( data.body )
            resolve()
        } )
    },

    getHeaders( body ) { return Object.assign( {}, this.headers, { 'Date': new Date().toISOString(), 'Content-Length': Buffer.byteLength( body ) } ) },

    headers: {
        'Connection': 'Keep-Alive',
        'Content-Type': 'application/ld+json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Keep-Alive': 'timeout=20, max=20'
    },

    respond( data ) {
        data.body = JSON.stringify( data.body )
        this.response.writeHead( data.code || 200, Object.assign( this.getHeaders( data.body ), data.headers || {} ) )
        this.response.end( data.body )
    }
} )
