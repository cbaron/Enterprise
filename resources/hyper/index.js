module.exports = Object.assign( { }, require('./__proto__'), {

    GET() {
        Promise.resolve(
            this.respond( {
                body: { 
                    "@context": "http://schema.org",
                    "@id": `https://${process.env.DOMAIN}:${process.env.PORT}`,
                    "@type": `ItemList`,
                    name: "Home",
                    description: "A list of resources",
                    itemListElement: Object.keys( this.Mongo.collections ).map( collection => this.addNavigationElement( collection ) )
                }
            } )
        )
    },

    addNavigationElement( collection ) {
        return {
            "@type": `SiteNavigationElement`,
            "name": 'div',
            "keywords": 'collection',
            "description": `${collection.name}`,
            "about": `Click to manage this resource.`,
            "potentialAction": {
                "@id": 'http://schema.org/AchieveAction',
                "agent": `https://${process.env.DOMAIN}:${process.env.PORT}/user`,
                "instrument": "mouse"
            },
            "target": {
                "actionApplication": 'Enterprise',
                "urlTemplate": `https://${process.env.DOMAIN}:${process.env.PORT}/${collection.name}`
            }
        } 
    }
} )
