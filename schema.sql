/**
 * Execute sql file: 
 * $ mysql -u root -p < schema.sql
 */
DROP DATABASE IF EXISTS roast_db;
CREATE DATABASE roast_db;
USE roast_db;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(90) NOT NULL,
  `password` varchar(90) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
);

CREATE TABLE `roasts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(90) NOT NULL,
  `roast_number` int NOT NULL,
  `coffee_origin` varchar(90) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `green_weight` int NOT NULL,
  `roasted_weight` int NOT NULL,
  `percentage_loss` decimal(3,1) NOT NULL,
  `first_crack` decimal(3,1) NOT NULL,
  `cool_down` decimal(3,1) NOT NULL,
  `vac_to_250` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
);

-- DUMMY ROAST DATA
INSERT INTO roasts (roast_number, user_email, coffee_origin,  date,  time,  green_weight,  roasted_weight,  percentage_loss,  first_crack,  cool_down,  vac_to_250) 
  VALUES (366, 'user@roast.com', 'Ethiopia Dry Process Dari Kidame', '2022-03-27', '14:45:00', 250, 219, 12.4, 17.7, 16.7, 1);
INSERT INTO roasts (roast_number, user_email, coffee_origin, date, time, green_weight, roasted_weight, percentage_loss, first_crack, cool_down, vac_to_250) 
  VALUES (367, 'user@roast.com', 'Ethiopia Dry Process Dari Kidame', '2022-03-27', '15:10:00', 250, 218, 12.8, 18.9, 17.9, 1)
