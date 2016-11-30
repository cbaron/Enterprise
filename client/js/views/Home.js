module.exports = Object.assign( {}, require('./__proto__'), {

    Xhr: require('../Xhr'),

    displayData(data) {
        this.els.name.text( data.name )
        this.els.description.text( data.description )
        data.potentialAction.forEach( action => this[ `handle${action["@type"]}` ]( action ) )
    },

    fetchAndDisplay() {
        this.getData()
        .then( data => this.displayData(data) )
        .catch( this.Error )
    },

    handleCreateAction( action ) {
        this.views[ action.name ] = this.factory.create( 'createAction', { insertion: { value: { $el: this.els.potentialAction } }, model: { value: action } } )
    },

    handleViewAction( action ) {
        this.views[ action.name ] = this.factory.create( 'viewAction', { insertion: { value: { $el: this.els.potentialAction } }, model: { value: action } } )
    },

    getData() {
        return this.Xhr( { method: 'get', resource: this.resource || '', headers: { accept: 'application/ld+json' } } )
    },

    navigate( resource ) {
        this.resource = resource
        this.reset()
        this.fetchAndDisplay()
    },

    postRender() {
        this.fetchAndDisplay()
        return this
    },

    requiresLogin: true,

    reset() {
        [ 'description', 'name' ].forEach( name => this.els[name].text('') )
        this.els.potentialAction.empty()
    }

} )
