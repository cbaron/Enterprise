module.exports = Object.assign( { }, require('../../lib/MyObject'), {
   
    Mongo: require('../../dal/Mongo'),

    Validate: require('../.Validate'),

    _addViewNavigationElements( document ) {
        this.navigationElements.push[ {
            "@type": `SiteNavigationElement`,
            "name": 'div',
            "keywords": 'resource'
            "description": `Click to view this resource.`
            "potentialAction": {
                "@id": 'http://schema.org/AchieveAction',
                "agent": `https://${process.env.DOMAIN}:${process.env.PORT}/user`,
                "instrument": "mouse"
            }
            "target": {
                "actionApplication": 'Enterprise',
                "urlTemplate": `https://${process.env.DOMAIN}:${process.env.PORT}/${this.path[0]}/document._id`
            }
        } ]
    },
    
    apply( method ) {
        return this.Validate.GET( this ).then( () => this.GET() )
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
        if( this.path.length === 2 ) return this.handleCreate()

        this.navigationElements = [ {
            "@type": `SiteNavigationElement`,
            "about": {
                "@id": "http://schema.org/CreateAction",
            }
            "name": 'button',
            "keywords": 'add'
            "description": `Click to create ${this.path[0]} resources.`
            "potentialAction": {
                "@id": 'http://schema.org/AchieveAction',
                "agent": `https://${process.env.DOMAIN}:${process.env.PORT}/user`,
                "instrument": "mouse"
            }
            "target": {
                "actionApplication": 'Enterprise',
                "urlTemplate": `https://${process.env.DOMAIN}:${process.env.PORT}/${this.path[0]}/Create`
            }
        } ]

        return this.Mongo.getDB()
        .then( db =>
            this.Mongo.forEach( db.collection( this.path[0] ).find(), this._addViewNavigationElements, this )
            .then( () => db.close() )
            .then( () =>
                Promise.resolve(
                    this.respond( {
                        body: { 
                            "@context": "http://schema.org",
                            "@id": `https://${process.env.DOMAIN}:${process.env.PORT}/${this.path[0]}`,
                            "@type": `ItemList`,
                            name: this.path[0],
                            description: `A list of ${this.path[0]} Objects`,
                            itemListElement: this.navigationElements
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
