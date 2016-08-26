module.exports = Object.create( Object.assign( { }, require('../lib/MyObject'), {

    Client: require('mongodb').MongoClient,

    _connect() { return this.Client.connect(process.env.MONGODB) },

    forEach( cursor, fn, thisVar ) {
        return new Promise( ( resolve, reject ) => {
            var handler = function( item ) {
                if( item === null ) return resolve()

                Reflect.apply( fn, thisVar, [ item ] )
                cursor.next().then( handler ).catch( e => console.log(e) )
            }
                
            cursor.next()
            .then( handler )
            .catch( e => console.log(e) )
        } )
    },

    getDB() { return this._connect() }

} ) )
