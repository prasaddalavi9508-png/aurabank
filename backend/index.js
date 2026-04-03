const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error connecting to SQLite:', err.message);
  else {
    console.log('Connected to SQLite DB.');
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    // 1. Create Profile Table with UNIQUE name constraint
    db.run(`CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      totalBalance REAL,
      monthlyIncome REAL,
      monthlyExpenses REAL,
      totalSavings REAL
    )`);

    // 2. Create Transactions Table with userName association
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userName TEXT,
      title TEXT,
      date TEXT,
      amount REAL,
      category TEXT
    )`);
  });
}

function generateMockUser(name) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create $10k Seed Profile
      db.run(`INSERT INTO profile (name, totalBalance, monthlyIncome, monthlyExpenses, totalSavings) 
              VALUES (?, ?, ?, ?, ?)`, [name, 10000.00, 0.00, 0.00, 10000.00], (err) => {
        if (err) return reject(err);
      });

      // Insert generic mock transactions for this user
      const stmt = db.prepare(`INSERT INTO transactions (userName, title, date, amount, category) VALUES (?, ?, ?, ?, ?)`);
      const mockData = [
        [name, "Initial Deposit", new Date().toISOString().split('T')[0], 10000.00, "Income"]
      ];
      mockData.forEach(tx => stmt.run(tx));
      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

// Fixed Spending Categories (Static)
const spendingCategories = [
  { category: "Housing", amount: 1500, color: "#8b5cf6" },
  { category: "Food", amount: 600, color: "#10b981" },
  { category: "Transport", amount: 300, color: "#3b82f6" },
  { category: "Entertainment", amount: 200, color: "#f59e0b" },
  { category: "Other", amount: 600, color: "#6366f1" }
];

// ------------------------
// Express API Routes
// ------------------------

app.get('/api/profile', (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).json({ error: "Missing user query param" });

  db.get(`SELECT * FROM profile WHERE name = ? COLLATE NOCASE`, [user], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (!row) {
      // User doesn't exist? Create and seed them!
      try {
        await generateMockUser(user);
        db.get(`SELECT * FROM profile WHERE name = ? COLLATE NOCASE`, [user], (err2, newRow) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json(newRow);
        });
      } catch (seedErr) {
        return res.status(500).json({ error: seedErr.message });
      }
    } else {
      res.json(row);
    }
  });
});

app.get('/api/transactions', (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).json({ error: "Missing user query param" });

  db.all(`SELECT * FROM transactions WHERE userName = ? COLLATE NOCASE ORDER BY id DESC`, [user], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/transactions', async (req, res) => {
  const { user, title, date, amount, category, recipient, bypass2FA, disableFraudSystem } = req.body;
  if (!user || !title || !date || amount === undefined || !category) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // --- FRAUD ENGINE ---
  if (!bypass2FA && !disableFraudSystem) {
    const rawAmountVal = Math.abs(amount);
    
    // Rule 1: High transfer threshold
    if (rawAmountVal > 3000) {
      return res.status(403).json({ 
        error: "FRAUD_DETECTED", 
        message: `High-value transfer of $${rawAmountVal} triggered security limits. Identity verification required.` 
      });
    }

    // Rule 2: Blacklisted Targets
    if (recipient) {
      const lowerR = recipient.toLowerCase();
      if (lowerR.includes("scammer") || lowerR.includes("hacker") || lowerR.includes("unknown")) {
        return res.status(403).json({ 
          error: "FRAUD_DETECTED", 
          message: `Transfer destination '${recipient}' has been flagged on network blacklists. Identity verification required.` 
        });
      }
    }
  }
  // --------------------

  try {
    // If there is a cross-account recipient, ensure they exist first
    if (recipient) {
      await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM profile WHERE name = ? COLLATE NOCASE`, [recipient], async (err, row) => {
          if (err) return reject(err);
          if (!row) {
            try {
              await generateMockUser(recipient);
              resolve();
            } catch (seedErr) {
              reject(seedErr);
            }
          } else {
            resolve();
          }
        });
      });
    }

    // Now securely execute the dual-ledger transactions inside a single execution block
    db.serialize(() => {
      // 1. Sender Side
      db.run(`INSERT INTO transactions (userName, title, date, amount, category) VALUES (?, ?, ?, ?, ?)`, 
        [user, title, date, amount, category]);
      db.run(`UPDATE profile SET totalBalance = totalBalance + ? WHERE name = ? COLLATE NOCASE`, 
        [amount, user]);

      // 2. Receiver Side
      if (recipient) {
        const creditAmount = Math.abs(amount); // amount arrives typically negative from the app
        const receiverTitle = `Transfer from ${user}`;
        db.run(`INSERT INTO transactions (userName, title, date, amount, category) VALUES (?, ?, ?, ?, ?)`, 
          [recipient, receiverTitle, date, creditAmount, category]);
        db.run(`UPDATE profile SET totalBalance = totalBalance + ? WHERE name = ? COLLATE NOCASE`, 
          [creditAmount, recipient]);
      }

      // Finish securely
      res.json({ success: true });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/spending', (req, res) => res.json(spendingCategories));

app.listen(PORT, () => console.log(`FinTech DB API running on http://localhost:${PORT}`));
