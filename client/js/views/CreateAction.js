module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        submitBtn: 'click'
    },

    onSubmitBtnClick() {
    },

    postRender() {
        this.model.data.expects.supportedProperty.forEach( property => this.factory.create( 'Input', { insertion: { value: { el: this.els.submitBtn, method: 'insertBefore' } }, model: { value: { data: property } } } ) )
        return this
    }
} )
