module.exports = Object.assign( { }, require('./__proto__'), {

    GET() {
        this.potentialAction = [ ]

        return this.Mongo.getDB()
        .then( db =>
            this.Mongo.forEach( db.listCollections( { name: { $ne: 'system.indexes' } } ), this.addViewAction, this )
            .then( () => db.close() )
            .then( () =>
                Promise.resolve(
                    this.respond( {
                        body: { 
                            "@context": "http://schema.org",
                            "@id": `https://${process.env.DOMAIN}:${process.env.PORT}`,
                            "@type": `ItemList`,
                            name: "Home",
                            description: "A list of resources",
                            potentialAction: this.potentialAction
                        }
                    } )
                )
            )
        )
    },

    addViewAction( collection ) {
        this.potentialAction.push( {
            "@type": `ViewAction`,
            "name": collection.name,
            "instrument": { "description": 'Mouse', "potentialAction": { description: "click" } },
            "target": {
                "actionApplication": 'Enterprise',
                "contentType": "text/html",
                "httpMethod": "GET",
                "urlTemplate": `https://${process.env.DOMAIN}:${process.env.PORT}/${collection.name}`
            },
            "object": {
                "@type": `http://schema.org/ItemList`
            }
        } )
    }
} )
