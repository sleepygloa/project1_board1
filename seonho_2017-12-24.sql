# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.2.11-MariaDB)
# Database: seonho
# Generation Time: 2017-12-24 06:49:03 +0000
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table BL_BD_RE
# ------------------------------------------------------------

DROP TABLE IF EXISTS `BL_BD_RE`;

CREATE TABLE `BL_BD_RE` (
  `IDX` int(11) NOT NULL,
  `REF` int(11) NOT NULL,
  `RE_LEVEL` int(11) NOT NULL DEFAULT 1,
  `RE_STEP` int(11) NOT NULL DEFAULT 0,
  `CONTENT` varchar(100) NOT NULL DEFAULT '',
  `PASSWD` varchar(12) NOT NULL DEFAULT '',
  `PASS_YN` varchar(1) NOT NULL DEFAULT 'N',
  `IN_USER_ID` varchar(10) NOT NULL DEFAULT '',
  `UP_USER_ID` varchar(10) DEFAULT NULL,
  `IN_DT` datetime NOT NULL,
  `UP_DT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
