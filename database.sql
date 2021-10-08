CREATE DATABASE doey;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task varchar(200) NOT NULL,
    completed boolean NOT NULL
);