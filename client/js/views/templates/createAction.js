module.exports = p => `<div>
    ${require('./Thing')(p)}
    <form data-js="form">
        <button data-js="submitBtn" type="button">Submit</button>
    </form>
</div>`
