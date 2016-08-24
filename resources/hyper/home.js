module.exports = {
    rv = {
                "@context": [
                    "http://www.w3.org/ns/hydra/core",
                    {
                        "@vocab": "https://schema.org/"
                    }
                ],
                "@id": this.util.format( "https://%s:%s", process.env.domain, process.env.port ),
                "resource": []
            }

}
