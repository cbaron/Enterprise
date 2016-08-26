#!/usr/bin/env node

require('node-env-file')( __dirname + '/../../.env' );

require('mongodb').MongoClient.connect(process.env.MONGODB)
.then( db => 
    db.createCollection('Person')
    .then( () => db.createCollection('Organization') )
    .then( () => db.createCollection('PayAction') )
    .then( () => db.createCollection('Object') )
    .then( () => process.exit(0) ) )
.catch( e => console.log( e.stack || e ) )
