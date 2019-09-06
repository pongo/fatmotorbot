CREATE TABLE IF NOT EXISTS users
(
    user_id integer NOT NULL
        CONSTRAINT users_pk
            PRIMARY KEY,
    gender  varchar(255),
    height  numeric(20, 2)
);

