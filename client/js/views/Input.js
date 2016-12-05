module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        submitBtn: 'click'
    },

    insertTypeahead() {
        this.els.input.
    },

    onSubmitBtnClick() {
    },

    postRender() {
        if( Array.isArray(this.model.range) || this.supportedRanges[ this.model.range ] === undefined ) this.insertTypeahead()
        this.model.supportedProperty.forEach( property => this.factory.create( 'Input', { insertion: { value: { $el: this.submitBtn, method: 'before' } }, model: { value: property } } ) )
        return this
    }
} )
