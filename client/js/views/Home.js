module.exports = Object.assign( {}, require('./__proto__'), {

    fetchAndDisplay() {
        return this.getData()
        .then( data => {
            this.model = data
            this.views[ this.model["@type"] ] = this.factory.create( this.model["@type"], { insertion: { value: { $el: this.els.subView } }, model: { value: this.model } } )
        } )
    },

    getData() {
        return this.Xhr( { method: 'get', resource: this.path.length ? this.path.join('/') : '', headers: { accept: 'application/ld+json' } } )
    },

    navigate( path ) {
        this.path = path

        this.views[ this.model["@type"] ].delete()
        .then( () => this.fetchAndDisplay() )
        .catch( this.Error )
    },

    postRender() {
        this.fetchAndDisplay().catch( this.Error )
        return this
    }

} )
