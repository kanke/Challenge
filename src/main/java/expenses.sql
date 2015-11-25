CREATE TABLE `expense`.`expenses` (
  `expensesId` INT NULL AUTO_INCREMENT PRIMARY KEY ,
 `reason`  VARCHAR(45) NULL,
 `amount`  DOUBLE NULL ,
 `vatAmount` DOUBLE NULL ,
 `date` DATE NOT NULL);