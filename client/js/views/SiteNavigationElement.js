module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        container: 'click'
    },

    onContainerClick() {
        this.emit( 'navigate', this.model.data.target.urlTemplate.split('/').slice(3).join('/') )
    }

} )
