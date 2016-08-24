var proto = require('./__proto__')

module.exports = Object.assign( { }, proto, {

    DELETE: proto.notFound,

    GET() {
        return this.Validate.parseSignature( this, this.Validate.parseCookies( this.request.headers.cookie ) )
        .then( () => this.respond( { body: this.user } ) )
    },

    PATCH: proto.notFound,

    POST: proto.notFound

} )
