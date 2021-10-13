CREATE DATABASE weekend_to_do_app;
    -- note - SQL was not liking the dashes 
    -- so I went for underscores in the db name instaed


--execute within the above db:
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task varchar(200) NOT NULL,
    completed boolean NOT NULL,
    time_completed timestamptz 
);

INSERT INTO tasks ("task", "completed", time_completed) 
VALUES('change oil', true, now());

INSERT INTO tasks ("task", "completed") 
VALUES('save the world', false);