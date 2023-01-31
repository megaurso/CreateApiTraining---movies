CREATE DATABASE listmovies;

CREATE TABLE IF NOT EXISTS movies (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    price INT NOT NULL
);

SELECT
    *
FROM
    movies;