﻿# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.2.11-MariaDB)
# Database: seonho
# Generation Time: 2017-12-24 10:16:52 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table BL_BD
# ------------------------------------------------------------

DROP TABLE IF EXISTS `BL_BD`;

CREATE TABLE `BL_BD` (
  `IDX` int(11) NOT NULL AUTO_INCREMENT,
  `TITLE` varchar(50) NOT NULL DEFAULT '',
  `CONTENT` varchar(4000) NOT NULL DEFAULT '',
  `PASSWD` varchar(12) NOT NULL DEFAULT '',
  `READCOUNT` int(5) NOT NULL DEFAULT 0,
  `USE_YN` varchar(1) NOT NULL DEFAULT 'Y',
  `DEL_YN` varchar(1) NOT NULL DEFAULT 'N',
  `EMAIL` varchar(50) DEFAULT NULL,
  `IN_USER_ID` varchar(10) NOT NULL DEFAULT '',
  `UP_USER_ID` varchar(10) DEFAULT NULL,
  `IN_DT` datetime NOT NULL,
  `UP_DT` datetime DEFAULT NULL,
  PRIMARY KEY (`IDX`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

LOCK TABLES `BL_BD` WRITE;
/*!40000 ALTER TABLE `BL_BD` DISABLE KEYS */;

INSERT INTO `BL_BD` (`IDX`, `TITLE`, `CONTENT`, `PASSWD`, `READCOUNT`, `USE_YN`, `DEL_YN`, `EMAIL`, `IN_USER_ID`, `UP_USER_ID`, `IN_DT`, `UP_DT`)
VALUES
	(1,'test','test','',25,'Y','N',NULL,'test',NULL,'2017-12-24 18:43:43',NULL);

/*!40000 ALTER TABLE `BL_BD` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table BL_BD_FILE
# ------------------------------------------------------------

DROP TABLE IF EXISTS `BL_BD_FILE`;

CREATE TABLE `BL_BD_FILE` (
  `IDX` int(11) DEFAULT NULL,
  `BOARD_IDX` int(11) NOT NULL,
  `ORIGINAL_FILE_NAME` varchar(100) NOT NULL DEFAULT '',
  `STORED_FILE_NAME` varchar(240) NOT NULL DEFAULT '',
  `FILE_SIZE` int(20) DEFAULT NULL,
  `USE_YN` varchar(1) NOT NULL DEFAULT 'Y',
  `DEL_YN` varchar(1) NOT NULL DEFAULT 'N',
  `IN_USER_ID` varchar(10) NOT NULL DEFAULT '',
  `UP_USER_ID` varchar(10) DEFAULT NULL,
  `IN_DT` datetime NOT NULL,
  `UP_DT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table BL_BD_RE
# ------------------------------------------------------------

DROP TABLE IF EXISTS `BL_BD_RE`;

CREATE TABLE `BL_BD_RE` (
  `IDX` int(11) NOT NULL,
  `REF` int(11) NOT NULL DEFAULT 0,
  `RE_LEVEL` int(11) NOT NULL DEFAULT 1,
  `RE_STEP` int(11) NOT NULL DEFAULT 0,
  `CONTENT` varchar(100) NOT NULL DEFAULT '',
  `PASSWD` varchar(12) NOT NULL DEFAULT '',
  `PASS_YN` varchar(1) NOT NULL DEFAULT 'N',
  `USE_YN` varchar(1) NOT NULL DEFAULT 'Y',
  `DEL_YN` varchar(1) NOT NULL DEFAULT 'N',
  `IN_USER_ID` varchar(10) NOT NULL DEFAULT '',
  `UP_USER_ID` varchar(10) DEFAULT NULL,
  `IN_DT` datetime NOT NULL,
  `UP_DT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `BL_BD_RE` WRITE;
/*!40000 ALTER TABLE `BL_BD_RE` DISABLE KEYS */;

INSERT INTO `BL_BD_RE` (`IDX`, `REF`, `RE_LEVEL`, `RE_STEP`, `CONTENT`, `PASSWD`, `PASS_YN`, `USE_YN`, `DEL_YN`, `IN_USER_ID`, `UP_USER_ID`, `IN_DT`, `UP_DT`)
VALUES
	(1,1,1,0,'테스트중인 게시판','123','N','Y','N','김예안',NULL,'2017-12-24 19:14:53',NULL),
	(1,1,2,1,'예안아안녕?','123','N','Y','N','김선호',NULL,'2017-12-24 19:16:06',NULL),
	(1,1,2,2,'우쭈쭈예안이~','123','N','Y','N','민상아',NULL,'2017-12-24 19:16:16',NULL),
	(1,1,2,3,'나는 니애비다','123','N','Y','Y','섯돌',NULL,'2017-12-24 19:16:24',NULL);

/*!40000 ALTER TABLE `BL_BD_RE` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
