CREATE TABLE `reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`artwork_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'inquiry_received' NOT NULL,
	`currency` text DEFAULT 'NZD' NOT NULL,
	`consent_version` text DEFAULT '2026-09-v1' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reservations_request_id_unique` ON `reservations` (`request_id`);--> statement-breakpoint
CREATE INDEX `reservations_email_created` ON `reservations` (`email`,`created_at`);