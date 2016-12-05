module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        container: 'click'
    },

    onContainerClick() {
        var path = this.model.target.urlTemplate.split('/')
        path.shift(); path.shift();
        this.emit( 'navigate', path )
    }

} )
