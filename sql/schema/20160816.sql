CREATE TABLE person (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    email               VARCHAR(200) NOT NULL,
    password            TEXT NOT NULL,
    "hasEmailValidated" BOOLEAN DEFAULT false
);
