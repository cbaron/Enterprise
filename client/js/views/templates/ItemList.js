module.exports = ( p ) => `<div>
    ${require('./Thing')(p)}
    <div data-js="items"></div>
</div>`
