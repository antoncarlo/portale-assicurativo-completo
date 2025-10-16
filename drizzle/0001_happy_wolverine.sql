CREATE TABLE `policies` (
	`id` varchar(64) NOT NULL,
	`policyNumber` varchar(100),
	`productTypeId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientEmail` varchar(320),
	`clientPhone` varchar(50),
	`status` enum('quote_requested','in_quotation','quoted','issued','active','expired','cancelled') NOT NULL DEFAULT 'quote_requested',
	`premiumAmount` varchar(20),
	`startDate` timestamp,
	`endDate` timestamp,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `policies_id` PRIMARY KEY(`id`),
	CONSTRAINT `policies_policyNumber_unique` UNIQUE(`policyNumber`)
);
--> statement-breakpoint
CREATE TABLE `policy_data` (
	`id` varchar(64) NOT NULL,
	`policyId` varchar(64) NOT NULL,
	`fieldName` varchar(255) NOT NULL,
	`fieldValue` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `policy_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_types` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(64) NOT NULL,
	`description` text,
	`icon` varchar(64),
	`active` enum('yes','no') NOT NULL DEFAULT 'yes',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `product_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_types_code_unique` UNIQUE(`code`)
);
