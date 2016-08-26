module.exports = Object.assign( {}, require('./__proto__'), {

    Xhr: require('../Xhr'),

    handleItem( item ) {
    },

    postRender() {
        this.Xhr( { method: 'get', resource: this.resource || '', headers: { accept: 'application/ld+json' } } )
        .then( response => {
            this.els.name.text( response.name )
            response.items.forEach( item => this.handleItem(item) )
        } )

        return this
    },

    requiresLogin: true

} )
