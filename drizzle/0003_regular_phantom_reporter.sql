ALTER TABLE `product_types` DROP INDEX `product_types_code_unique`;--> statement-breakpoint
ALTER TABLE `product_types` MODIFY COLUMN `icon` varchar(50);--> statement-breakpoint
ALTER TABLE `product_types` ADD `category` varchar(100);--> statement-breakpoint
ALTER TABLE `product_types` ADD `questionnaireFile` varchar(500);--> statement-breakpoint
ALTER TABLE `product_types` DROP COLUMN `code`;