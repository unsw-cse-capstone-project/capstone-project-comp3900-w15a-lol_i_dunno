-- REPLACE INTO review(movie_id, user_id, review, rating) values 
-- 	(2, 282, "", 5),
--     (3, 184, "", 4.5),
--     (3, 216, "", 5),
--     (2, 232, "", 5),
--     (2, 249, "", 4),
--     (2, 269, "Ok", 4);

SELECT * from user;

-- INSERT INTO user (first_name, last_name, email, hash) VALUES ("TMDb", "Bot", "tmdb@bot", 1);

SELECT * from review;
SELECT * FROM similarity;

-- Get common reviewed movies
Select distinct r1.movie_id from review r1, review r2 where r1.user_id=184 and r2.user_id=216 and r1.movie_id = r2.movie_id;

SELECT IFNULL(avg(rating),0) rating from review where movie_id=56;

SELECT * FROM movie WHERE id=2;

-- UPDATE movie
-- SET rating=(SELECT avg(rating) from review where movie_id=?)
-- WHERE id=?;
