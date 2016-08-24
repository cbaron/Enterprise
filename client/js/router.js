module.exports = new (
    require('backbone').Router.extend( {

        $: require('jquery'),

        Error: require('../../lib/MyError'),
        
        User: require('./models/User'),

        ViewFactory: require('./factory/View'),

        initialize() {

            this.contentContainer = this.$('#content')

            return Object.assign( this, {
                views: { },
                header: this.ViewFactory.create( 'header', { insertion: { value: { $el: this.contentContainer, method: 'before' } } } )
            } )
        },

        goHome() { this.navigate( 'home', { trigger: true } ) },

        handler( resource ) {

            if( !resource ) return this.goHome()
            
            resource = resource.split('/').shift()

            this.User.get().then( () => {

                this.header.onUser()
                    .on( 'signout', () => 
                        Promise.all( Object.keys( this.views ).map( name => this.views[ name ].delete() ) )
                        .then( this.goHome() )
                    )
                
                if( this.views.home ) return this.views[ resource ].route( resource )
                
                return Promise.resolve(
                    this.views.home =
                        this.ViewFactory.create( home, {
                            insertion: { value: { $el: this.contentContainer } },
                            resource: resource
                        } ) )
               
            } ).catch( this.Error )
            
        },

        routes: { '(*request)': 'handler' }

    } )
)()
