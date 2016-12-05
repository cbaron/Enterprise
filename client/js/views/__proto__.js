module.exports = Object.assign( { }, require('../../../lib/MyObject'), require('events').EventEmitter.prototype, {

    _: require('underscore'),

    Collection: require('backbone').Collection,
    
    Model: require('backbone').Model,

    OptimizedResize: reqiuire('.lib/OptimizedResize'),
    
    Xhr: require('../Xhr'),

    bindEvent( key, event ) {
        var els = Array.isArray( this.els[ key ] ) ? this.els[ key ] : [ this.els[ key ] ]
        els.forEach( el => el.addEventListener( event || 'click', e => this[ `on${this.capitalizeFirstLetter(key)}${this.capitalizeFirstLetter(event)}` ]( e ) ) )
    },

    capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1),

    constructor() {

        if( this.size ) this.OptimizedResize.add( this.size );

        if( this.requiresLogin && (!this.user.data || !this.user.data.id ) ) return this.handleLogin()

        if( this.user.data && this.user.data.id && this.requiresRole && !this.hasPrivileges() ) return this.showNoAccess()
        
        return Object.assign( this, { els: { }, slurp: { attr: 'data-js', view: 'data-view' }, views: { } } ).render()
    },

    delegateEvents( key, el ) {
        var type = typeof this.events[key]

        if( type === "string" ) { this.bindEvent( key, this.events[key] ) }
        else if( Array.isArray( this.events[key] ) ) {
            this.events[ key ].forEach( eventObj => this.bindEvent( key, eventObj.event ) )
        } else {
            this.bindEvent( key, this.events[key].event )
        }
    },

    delete( duration ) {
        return this.hide( duration )
        .then( () => {
            this.else.container.remove()
            this.emit("removed")
            return Promise.resolve()
        } )
    },

    events: {},

    getTemplateOptions() { return this.model || {} },

    handleLogin() {
        this.factory.create( 'login', { insertion: { value: { el: document.querySelector('#content') } } } )
            .once( "loggedIn", () => this.onLogin() )

        return this
    },

    hasPrivilege() {
        ( this.requiresRole && ( this.user.get('roles').find( role => role === this.requiresRole ) === "undefined" ) ) ? false : true
    },

    hide( duration ) {
        return new Promise( resolve => this.els.container.hide( duration || 10, resolve ) )
    },

    htmlToFragment( str ) {
        let range = document.createRange();
        // make the parent of the first div in the document becomes the context node
        range.selectNode(document.getElementsByTagName("div").item(0))
        return range.createContextualFragment( str )
    },
    
    isHidden() { return this.els.container.css('display') === 'none' },

    onLogin() {
        this.router.header.onUser( this.user )

        this[ ( this.hasPrivileges() ) ? 'render' : 'showNoAccess' ]()
    },

    showNoAccess() {
        alert("No privileges, son")
        return this
    },

    postRender() { return this },

    render() {
        this.slurpTemplate( { template: this.template( this.getTemplateOptions() ), insertion: this.insertion } )

        if( this.size ) this.size()

        return this.renderSubviews()
                   .postRender()
    },

    renderSubviews() {
        Object.keys( this.Views || [ ] ).forEach( key => {
            if( this.Views[ key ].el ) {
                let opts = this.Views[ key ].opts
                
                opts = ( opts )
                    ? typeof opts === "object"
                        ? opts
                        : opts()
                    : {}

                this.views[ key ] = this.factory.create( key, Object.assign( { insertion: { value: { el: this.Views[ key ].el, method: 'before' } } }, opts ) )
                this.Views[ key ].el.remove()
                this.Views[ key ].el = undefined
            }
        } )

        return this
    },

    show( duration ) {
        return new Promise( ( resolve, reject ) =>
            this.els.container.show(
                duration || 10,
                () => { if( this.size ) { this.size(); } resolve() }
            )
        )
    },

    slurpEl( el ) {
        var key = el.attr( this.slurp.attr ) || 'container'

        if( key === 'container' ) el.addClass( this.name )

        this.els[ key ] = Array.isArray( this.els[ key ] )
            ? this.els[ key ].push( el )
            : ( this.els[ key ] !== undefined )
                ? [ this.els[ key ], el ]
                : el

        el.removeAttribute(this.slurp.attr)

        if( this.events[ key ] ) this.delegateEvents( key, el )
    },
]
    slurpTemplate( options ) {

        var fragment = this.htmlToFragment( options.template ),
            selector = `[${this.slurp.attr}]`,
            viewSelector = `[${this.slurp.view}]`

        fragment.firstChild( el => this.slurpEl( el ) )
        fragment.querySelectorAll( selector, viewSelector ).forEach( el =>
            ( el.hasAttribute( this.slurp.attr ) ) 
                ? this.slurpEl( el )
                : this.Views[ el.getAttribute(this.slurp.view) ].el = el
        )
            
        options.insertion.el[ options.insertion.method || 'appendChild' ]( fragment )

        return this
    },

    isMouseOnEl( event, el ) {

        var elOffset = el.offset(),
            elHeight = el.outerHeight( true ),
            elWidth = el.outerWidth( true )

        if( ( event.pageX < elOffset.left ) ||
            ( event.pageX > ( elOffset.left + elWidth ) ) ||
            ( event.pageY < elOffset.top ) ||
            ( event.pageY > ( elOffset.top + elHeight ) ) ) {

            return false;
        }

        return true
    },

    requiresLogin: true,

    //__toDo: html.replace(/>\s+</g,'><')
} )
