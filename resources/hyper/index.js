module.exports = Object.assign( { }, require('./__proto__'), {

    GET() {
        this.potentialAction = [ ]

        return this.Mongo.getDB()
        .then( db =>
            this.Mongo.forEach( db.listCollections(), this.addViewAction, this )
            .then( () => db.close() )
            .then( () =>
                Promise.resolve(
                    this.respond( {
                        body: { 
                            "@context": "http://schema.org",
                            "@id": `https://${process.env.domain}:${process.env.port}`,
                            "@type": `ItemList`,
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
            "instrument": { "description": 'Mouse', "potentialAction": { description: "click" } },
            "target": {
                "actionApplication": 'Enterprise',
                "contentType": "text/html",
                "httpMethod": "GET",
                "urlTemplate": `https://${process.env.domain}:${process.env.port}/${collection.name}`
            },
            "object": {
                "@type": `http://schema.org/ItemList`
            }
        } )
    }
} )
