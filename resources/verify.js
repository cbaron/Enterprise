var proto = require('./__proto__')

module.exports = Object.assign( { }, proto, {
    
    bcrypt: require('bcrypt'),

    DELETE: proto.notFound,

    GET() {
        if( this.path.length !== 2 ) return this.notFound()

        return this.Validate.parseSignature( this, this.path[1] )
        .then( () => this.Postgres.query( "SELECT id, email FROM person where id = $1 and email = $2", [ this.user.id, this.user.email ] ) )
        .then( result => result.rows.length === 1 ? Promise.resolve() : this.notFound( true ) )
        .then( () => this.Postgres.query( `UPDATE person SET "hasEmailValidated" = true WHERE id = ${this.user.id}` ) )
        .then( () => this.respond( { body: { success: true } } ) )
    },

    PATCH: proto.notFound,

    POST: proto.notFound

} )
