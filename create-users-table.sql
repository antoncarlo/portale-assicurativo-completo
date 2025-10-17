-- Creazione tabella users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` TEXT,
  `email` VARCHAR(320) NOT NULL,
  `phone` VARCHAR(20),
  `role` ENUM('master', 'admin', 'agent', 'collaborator') NOT NULL DEFAULT 'agent',
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `parentAgentId` VARCHAR(64),
  `commissionRate` INT DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `lastSignedIn` TIMESTAMP NULL
);

-- Inserimento utenti demo (password già hashate con bcrypt)
INSERT INTO `users` (`id`, `username`, `password`, `name`, `email`, `phone`, `role`, `isActive`, `commissionRate`) VALUES
('user_master_1', 'master', '$2b$10$RjcTWZhqKF14stTDrD67xOS.t6drnKT8jFBQA06uI28ZhPIjLHzqK', 'Master Admin', 'master@portalebroker.it', '+39 333 1111111', 'master', TRUE, 0),
('user_admin_1', 'admin', '$2b$10$yAKWt5hagqXtBLN6sjQHnuY2QQmt2GBSdaVm5am6v4AVBaniqftz6', 'Amministratore', 'admin@portalebroker.it', '+39 333 1234567', 'admin', TRUE, 0),
('user_agent_1', 'agente', '$2b$10$wVenTlzCHV68eoj0XYTt6OecJ10Ik7ESP3zCZbpBDGmu1S9mhMb2u', 'Mario Rossi', 'mario.rossi@portalebroker.it', '+39 333 7654321', 'agent', TRUE, 15),
('user_collab_1', 'collaboratore', '$2b$10$0yKyzr2bjeSlB1DFxtjy0O4otl6pzfp6HQPni8lWLjPjkR62HgGqW', 'Laura Bianchi', 'laura.bianchi@portalebroker.it', '+39 333 9876543', 'collaborator', TRUE, 10)
ON DUPLICATE KEY UPDATE `id`=`id`;

