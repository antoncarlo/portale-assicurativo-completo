-- Tabella per comunicazioni/note/documenti integrativi sulle polizze
CREATE TABLE IF NOT EXISTS policy_communications (
  id VARCHAR(64) PRIMARY KEY,
  policyId VARCHAR(64) NOT NULL,
  userId VARCHAR(64) NOT NULL,
  userName VARCHAR(255),
  userRole VARCHAR(50),
  type ENUM('note', 'document', 'status_change') NOT NULL DEFAULT 'note',
  content TEXT,
  documentUrl VARCHAR(500),
  documentName VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (policyId) REFERENCES policies(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_policy_communications_policy ON policy_communications(policyId);
CREATE INDEX idx_policy_communications_created ON policy_communications(createdAt DESC);

