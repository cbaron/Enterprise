module.exports = Object.assign( { }, require('../../lib/MyObject'), {
   
    Mongo: require('../../dal/Mongo'),

    Validate: require('../.Validate'),

    _addListElement( document ) {
        const id = document._id 
        delete document._id
        this.itemListElements.push(
            Object.assign( {
                "@type": this.path[0],
                "@id": `https://${process.env.DOMAIN}:${process.env.PORT}/${this.path[0]}/${id}`
            }, document )
        )
    },

    _addViewNavigationElements( document ) {
        this.itemListElements.push[ {
            "@type": `SiteNavigationElement`,
            "name": 'div',
            "keywords": 'resource',
            "description": `Click to view this resource.`,
            "potentialAction": {
                "@id": 'http://schema.org/AchieveAction',
                "agent": `https://${process.env.DOMAIN}:${process.env.PORT}/user`,
                "instrument": "mouse"
            },
            "target": {
                "actionApplication": 'Enterprise',
                "urlTemplate": `https://${process.env.DOMAIN}:${process.env.PORT}/${this.path[0]}/document._id`
            }
        } ]
    },
    
    apply( method ) {
        return this.Validate.GET( this )
           .then( () => this.Context[ method ]( this ) )
           .then( () => this[method]() )
    },

    handleCreate() {
        return this.Mongo.getDB()
        .then( db => 
            db.collection('Model').findOne( { name: this.path[0] } )
            .then( model => Promise.all( model.properties.map( property => db.collection('Property').findOne( { _id: property } ) ) ) )
        ) 
        .then( properties =>
            Promise.resolve(
                this.respond( {
                    body: {
                        "@context": "http://www.w3.org/ns/hydra/core",
                        "@id": `https://${process.env.DOMAIN}:${process.env.PORT}/${this.path[0]}`,
                        "@type": "CreateAction",
                        name: `Create ${this.path[0]}`,
                        "method": "POST",
                        "expects": {
                            "@id": `http://schema.org/${this.path[0]}`,
                            "supportedProperty": properties
                        }
                    }
                } )
            )
        )
    },

    GET() {
        this.itemListElements = [ ]
        this.Mongo.forEach( db => db.collection( this.path[0] ).find( this.query ), this._addListElement, this )
        .then( () =>
            Promise.resolve(
                this.respond( {
                    body: { 
                        "@context": "http://schema.org",
                        "@id": request.url,
                        "@type": `ItemList`,
                        name: this.path[0],
                        description: `A list of ${this.path[0]} Objects`,
                        itemListElement: this.itemListElements
                    }
                } )
            )
        )
    },

    OPTIONS() {
        if( this.path.length === 2 ) return this.handleCreate()

        this.itemListElements = 
            this.method[ {
            "@type": `SiteNavigationElement`,
            "about": {
                "@id": "http://schema.org/CreateAction"
            },
            "name": 'button',
            "keywords": 'add',
            "potentialAction": {
                "@id": 'http://schema.org/AchieveAction',
                "agent": `https://${process.env.DOMAIN}:${process.env.PORT}/user`,
                "instrument": "mouse"
            },
            "target": {
                "actionApplication": 'Enterprise',
                "urlTemplate": `https://${process.env.DOMAIN}:${process.env.PORT}/${this.path[0]}/Create`
            }
        } ]

        this.Mongo.forEach( db => db.collection( this.path[0] ).find(), this._addViewNavigationElements, this )
        .then( () =>
            Promise.resolve(
                this.respond( {
                    body: { 
                        "@context": "http://schema.org",
                        "@id": request.url,
                        "@type": `ItemList`,
                        name: this.path[0],
                        description: `A list of ${this.path[0]} Objects`,
                        itemListElement: this.itemListElements
                    }
                } )
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
