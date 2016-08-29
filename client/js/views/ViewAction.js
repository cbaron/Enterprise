module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        container: 'click'
    },

    onContainerClick() {
        this.emit( 'navigate', this.model.target.urlTemplate.split('/').pop() )
    },
} )
