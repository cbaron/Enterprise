module.exports = Object.create( Object.assign( {}, require('../lib/MyObject').prototype, {

    query( query, args, opts = { } ) {
        return this._factory( opts ).query( query, args )
            .catch( e => { throw new Error(`${e.stack || e}\nquery: ${query}\nargs: ${args}`) } )
    },

    querySync( query, args, opts = { } ) {
        var client = new ( require('pg-native') )(), rows
        client.connectSync( process.env.POSTGRES || opts.connectionString )
        rows = client.querySync( query, args )
        client.end()
        return rows
    },

    getTableData() {

        this.querySync( this._queries.selectAllTables() ).forEach( row => {
             var columnResult = this.querySync( this._queries.selectTableColumns( row.table_name ) )
             this.tables[ row.table_name ] =
                { columns: columnResult.map( columnRow => ( {
                    isNullable: columnRow.is_nullable,
                    name: columnRow.column_name,
                    range: this.dataTypeToRange[columnRow.data_type]
                } ) ) } 
        } )

        this.querySync( this._queries.selectForeignKeys() ).forEach( row => {
            var match = /FOREIGN KEY \("?(\w+)"?\) REFERENCES (\w+)\((\w+)\)/.exec( row.pg_get_constraintdef )
                column = this.tables[ row.tablefrom ].columns.find( column => column.name === match[1] )
            
            column.fk = {
                table: match[2],
                column: match[3],
                recordType: ( this.tables[ match[2] ].meta ) ? this.tables[ match[2] ].meta.recordType : null
            }
        } )
    },

    _factory( data ) {
        return Object.create( {
            connect() {
                return new Promise( ( resolve, reject ) => {
                    this.pool.connect( ( err, client, done ) => {
                        if( err ) return reject( err )

                        this.client = client
                        this.done = done
                     
                        resolve()
                    } )
                } )
            },

            query( query, args ) {
                return this.connect().then( () =>
                    new Promise( ( resolve, reject ) => {
                        this.client.query( query, args, ( err, result ) => {
                            this.done()

                            if( err ) return reject( err )

                            resolve( result )
                        } )
                    } )
                )
            },
        }, { pool: { value: this.pool } } )
    },

    _queries: {

        selectAllTables() { return [
           "SELECT table_name",
           "FROM information_schema.tables",
           "WHERE table_schema='public'",
           "AND table_type='BASE TABLE';"
        ].join(' ') },

        selectForeignKeys() { return [
            "SELECT conrelid::regclass AS tableFrom, conname, pg_get_constraintdef(c.oid)",
            "FROM pg_constraint c",
            "JOIN pg_namespace n ON n.oid = c.connamespace",
            "WHERE contype = 'f' AND n.nspname = 'public';"
        ].join(' ') },

        selectTableColumns( tableName ) {
            return [
                'SELECT column_name, data_type, is_nullable',
                'FROM information_schema.columns',
                `WHERE table_name = '${tableName}'`
            ].join(' ')
        },

    },

    dataTypeToRange: {
        "boolean": "Boolean",
        "character varying": "Text",
        "date": "Date",
        "integer": "Integer",
        "money": "Float",
        "timestamp with time zone": "DateTime",
        "text": "Text"
    }
} ), {
    pool: { value: new (require('pg')).Pool() },
    tables: { value: { } }
} )
