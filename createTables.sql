CREATE DATABASE listmovies;

CREATE TABLE IF NOT EXISTS movies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT UNIQUE NULL,
    description TEXT,
    duration INT NOT NULL,
    price INT NOT NULL
);

SELECT
    *
FROM
    movies;