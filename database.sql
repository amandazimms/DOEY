CREATE DATABASE weekend_to_do_app;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task varchar(200) NOT NULL,
    completed boolean NOT NULL
);