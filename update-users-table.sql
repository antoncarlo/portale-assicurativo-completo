-- Aggiungere colonne mancanti alla tabella users
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS isActive BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS parentAgentId VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS commissionRate INT DEFAULT 0;

-- Modificare la colonna role per includere i nuovi valori
ALTER TABLE users MODIFY COLUMN role ENUM('master', 'admin', 'agent', 'collaborator', 'user') DEFAULT 'agent';

-- Inserire utenti demo
INSERT INTO users (id, username, password, name, email, phone, role, isActive, commissionRate, createdAt) 
VALUES 
  ('user_admin_1', 'admin', '$2b$10$xzEAfZVqKmQPHNPrXNgZveKkCEBx5Nt9P65/uqvC3zCutvSUY.0ge', 'Amministratore', 'admin@portalebroker.it', '+39 333 1234567', 'admin', TRUE, 0, NOW()),
  ('user_agent_1', 'agente1', '$2b$10$D6eTfz9irJ0LBmbo7hahT.8FKjeYryutI3kLnXBJadEe86888Hhi2', 'Mario Rossi', 'mario.rossi@portalebroker.it', '+39 333 7654321', 'agent', TRUE, 15, NOW()),
  ('user_collab_1', 'collab1', '$2b$10$.ZlsvPMKp3NPcyZluHpppe3F8ZtrKPhFQ/NF7f62k/9q4dYFWzv2W', 'Laura Bianchi', 'laura.bianchi@portalebroker.it', '+39 333 9876543', 'collaborator', TRUE, 10, NOW())
ON DUPLICATE KEY UPDATE username=username;
