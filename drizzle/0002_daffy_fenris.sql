CREATE TABLE `claims` (
	`id` varchar(64) NOT NULL,
	`claimNumber` varchar(100),
	`policyId` varchar(64) NOT NULL,
	`claimDate` timestamp NOT NULL,
	`description` text,
	`status` enum('reported','under_review','approved','rejected','paid','closed') NOT NULL DEFAULT 'reported',
	`claimAmount` varchar(20),
	`paidAmount` varchar(20),
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `claims_id` PRIMARY KEY(`id`),
	CONSTRAINT `claims_claimNumber_unique` UNIQUE(`claimNumber`)
);
--> statement-breakpoint
CREATE TABLE `commissions` (
	`id` varchar(64) NOT NULL,
	`policyId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`amount` varchar(20) NOT NULL,
	`percentage` varchar(10),
	`status` enum('pending','approved','paid') NOT NULL DEFAULT 'pending',
	`paidDate` timestamp,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `commissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` varchar(64) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` varchar(20),
	`mimeType` varchar(100),
	`category` enum('policy','claim','quote','other') NOT NULL DEFAULT 'other',
	`relatedId` varchar(64),
	`uploadedBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`type` enum('info','warning','success','error') NOT NULL DEFAULT 'info',
	`read` enum('yes','no') NOT NULL DEFAULT 'no',
	`relatedId` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
