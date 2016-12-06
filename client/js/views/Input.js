module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        submitBtn: 'click'
    },

    onSubmitBtnClick() {
    },

    postRender() {
        const view =     
            ( /^ISO /.test(this.model.data.range) )
                ? 'Dropdown'
                : ( Array.isArray(this.model.data.range) || !this.supportedRanges.includes( this.model.data.range ) )
                    ? 'Typeahead'
                    : this.model.data.range
        
        this.subView = this.factory.create( view, { insertion: { value: { el: this.els.inputContainer } }, model: { value: this.model } } )
        return this
    },

    supportedRanges: [
        'DateTime',
        'Number'
    ]
} )
