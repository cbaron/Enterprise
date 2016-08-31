module.exports = {

    Error: require('./MyError'),

    Moment: require('moment'),

    P: ( fun, args=[ ], thisArg=undefined ) =>
        new Promise( ( resolve, reject ) => Reflect.apply( fun, thisArg, args.concat( ( e, ...callback ) => e ? reject(e) : resolve(callback) ) ) ),
    
    constructor() { return this }
}
