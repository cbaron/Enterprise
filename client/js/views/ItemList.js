module.exports = Object.assign( {}, require('./__proto__'), {

    postRender() {
        this.itemViews = {}
        this.model.itemListElement.forEach( item => this.itemViews[ item[ "@id" ] ] = this.factory.create( this.model[ "@type" ], { insertion: { value: { $el: this.els.items }, model: { value: item } } } ) )
        return this
    }

} )
