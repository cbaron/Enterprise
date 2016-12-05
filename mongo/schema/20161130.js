#!/usr/bin/env node

require('node-env-file')( __dirname + '/../../.env' );

require('mongodb').MongoClient.connect(process.env.MONGODB)
.then( db => 
    db.createCollection('Model')
    .then( () => db.createCollection('Property') )
    .then( () => db.collection('Property').insertMany( [
        {
            name: 'recipient',
            label: 'Recipient',
            range: [ 'Organization', 'Person' ],
            description: 'The participant who is at the receiving end of the action.'
        },
        {
            name: 'price',
            label: 'Price',
            range: 'Number',
            description: 'The offer price of a product, or of a price component when attached to PriceSpecification and its subtypes.'
        },
        {
            name: 'priceCurrency',
            label: 'Price Currency',
            range: 'ISO 4217',
            description: 'The currency (in 3-letter ISO 4217 format) of the price or a price component.'
        },
        {
            name: 'instrument',
            label: 'Instrument',
            range: 'Thing',
            description: 'The object that helped the agent perform the action. e.g. John wrote a book with a pen.'
        },
        {
            name: 'startTime',
            label: 'Start Time',
            range: 'DateTime',
            description: 'The startTime of something.',
        },
        {
            name: 'result',
            label: 'Result',
            range: 'Thing',
            description: 'The result produced in the action.'
        }
    ] ) )
    .then( () => Promise.all( [ 'recipient', 'price', 'instrument', 'startTime', 'result' ].map( name => db.collection('Property').findOne( { name } ) ) ) )
    .then( properties => db.collection('Model').insertOne( { name: 'PayAction', properties: properties.map( property => new ( require('mongodb').ObjectID )( property._id ) ) } ) )
)
.catch( e => console.log( e.stack || e ) )
.then( () => process.exit(0) )
