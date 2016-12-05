module.exports = Object.create( {

    Error: require('../../lib/MyError'),
    
    User: require('./models/User'),

    ViewFactory: require('./factory/View'),

    initialize() {
        this.contentContainer = document.querySelector('#content')

        window.onpopstate = this.onPopState()

        return Object.assign( this, {
            views: { },
            header: this.ViewFactory.create( 'header', { insertion: { value: { el: this.contentContainer, method: 'insertBefore' } } } )
        } )
    },

    handler( resource ) {
        const view = /verify/.test(resource) ? 'verify' : 'home'
        let path = resource ? resource.split('/') : [ ]

        this.User.get().then( () => {

            this.header.onUser()
                .on( 'signout', () => 
                    Promise.all( Object.keys( this.views ).map( name => this.views[ name ].delete() ) )
                    .then( () => this.navigate( 'home' ) )
                )
           
            if( this.views[ view ] ) return this.views[ view ].navigate( path )
            
            return Promise.resolve(
                this.views[ view ] =
                    this.ViewFactory.create( view, {
                        insertion: { value: { $el: this.contentContainer } },
                        path: { value: path, writable: true }
                    } )
            )
                
           
        } ).catch( this.Error )
        
    },

    navigate( location ) {
        History.pushState( {}, '', location )
    },

    onPopState() {
        this.handler( window.location.split('/').slice(3) )
    }

} )
