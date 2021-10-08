CREATE DATABASE weekend_to_do_app;

--execute within the above db:
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task varchar(200) NOT NULL,
    completed boolean NOT NULL
);