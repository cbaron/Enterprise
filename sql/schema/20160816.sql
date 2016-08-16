CREATE TABLE tablemeta (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    label          VARCHAR(20),
    description    VARCHAR(200),
    recorddescriptor VARCHAR(30)
);

CREATE TABLE person (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    email               VARCHAR(200) NOT NULL,
    password            TEXT NOT NULL,
    "hasEmailValidated" BOOLEAN DEFAULT false
);

CREATE TABLE entity (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL
);

INSERT INTO entity ( name ) VALUES ( 'FutureDays Farm' );
INSERT INTO entity ( name ) VALUES ( 'FutureDays Software' );

CREATE TABLE exchange (
    id                  SERIAL PRIMARY KEY,
    "toEntityId"        INTEGER REFERENCES entity (id) NOT NULL,
    "fromEntityId"      INTEGER REFERENCES entity (id) NOT NULL,
    amount              MONEY NOT NULL,
    description         VARCHAR(200) NOT NULL,
    "date"              DATE NOT NULL
);
