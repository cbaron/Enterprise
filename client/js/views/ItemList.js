module.exports = Object.assign( {}, require('./__proto__'), {

    postRender() {
        this.itemViews = {}
        this.model.data.itemListElement.forEach( item => this.itemViews[ item[ "@id" ] ] = this.factory.create( item[ "@type" ], { insertion: { value: { el: this.els.items } }, model: { value: { data: item } } } ) )
        return this
    }

} )
