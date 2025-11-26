docker exec -it postgres psql -U postgres

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
)

INSERT INTO blogs (author, url, title) VALUES ('Jyrki', 'https://luovikulma.com', 'Luovikulma blog')
INSERT INTO blogs (author, url, title) VALUES ('Margarita', 'https://margarita.yoga', 'Yoga blog')
