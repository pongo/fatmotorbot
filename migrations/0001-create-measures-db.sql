CREATE TABLE IF NOT EXISTS measures
(
    measure_id serial PRIMARY KEY,
    user_id    integer        NOT NULL,
    value_type varchar(255)   NOT NULL,
    value      decimal(20, 2) NOT NULL, --- 20 is big enough
    date       timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX measures_user_id_value_type_index
    ON measures (user_id, value_type);
