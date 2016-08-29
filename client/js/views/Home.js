module.exports = Object.assign( {}, require('./__proto__'), {

    Xhr: require('../Xhr'),

    handleViewAction( action ) {
        this.views[ action.name ] = this.factory.create( 'viewAction', { insertion: { value: { $el: this.els.potentialAction } }, model: { value: action } } )
    },

    navigate( resource ) {

        this.resource = resource
    },

    postRender() {
        this.Xhr( { method: 'get', resource: this.resource || '', headers: { accept: 'application/ld+json' } } )
        .then( response => {
            this.els.name.text( response.name )
            this.els.description.text( response.description )
            response.potentialAction.forEach( action => this[ `handle${action["@type"]}` ]( action ) )
        } )

        return this
    },

    requiresLogin: true,

    reset() {
        return Promise.all( Object.keys( this.views ).map( key => this.views[ key ]
    }

} )
