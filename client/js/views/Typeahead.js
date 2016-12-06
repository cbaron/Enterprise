module.exports = Object.assign( {}, require('./__proto__'), {

    createModel(type) {
        this.suggestions[type] = Object.create( this.Model, { resource: { value: type } ) )
    },

    events: {
        input: 'input'
    },

    getSuggestions() {
        Object.keys( this.suggestions ).forEach( type => {
            const model = this.suggestions[ type ]

            model.get( { query: { name: this.els.input.value } )
            .then( () => Promise.resolve( model.data.forEach( item => this.els.suggestions.appendChild( this.makeSuggestion(item) ) ) ) )
            .catch( this.Error )
        } )
    },

    makeSuggestion(item) {
        let div = document.createElement('div')
        div.textContent = item.name
        return div
    },

    onInputInput() {
        if( this.timeout ) window.clearTimeout( this.timeout )

        this.timeout = window.setTimeout( this.getSuggestions, 1250 )
    },

    postRender() {
        this.suggestions = { };

        ( Array.isArray( this.model.data.range ) )
            ? this.model.data.range.forEach( type => this.createModel( type ) )
            : this.createModel(this.model.data.range)
    }
} )
