module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        submitBtn: 'click'
    },

    onSubmitBtnClick() {
    },

    postRender() {
        this.model.supportedProperty.forEach( property => this.factory.create( 'Input', { insertion: { value: { $el: this.submitBtn, method: 'before' } }, model: { value: property } } ) )
        return this
    }
} )
