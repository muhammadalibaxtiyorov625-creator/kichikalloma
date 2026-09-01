const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (with extended payload limit for image uploads)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Static files mapping
app.use(express.static(path.join(__dirname, 'website')));
app.use('/public', express.static(path.join(__dirname, 'public')));



// Swagger API Hujjatlari UI: /api-docs va /docs
app.use(['/api-docs', '/docs'], swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: `
    .swagger-ui .topbar { background-color: #0f0f11; border-bottom: 2px solid #facc15; }
    .swagger-ui .info .title { color: #facc15; }
    .swagger-ui .btn.authorize { background-color: #facc15; color: #000; border-color: #facc15; }
  `,
  customSiteTitle: "Ta'lim & Rivojlanish Sayyoralari API Dokumentatsiyasi"
}));

// ==========================================
// 1. STATISTIKA ENDPOINTI
// ==========================================
app.get('/api/stats', (req, res) => {
  const stats = {};
  db.get("SELECT COUNT(*) as total, SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread FROM messages", (err, msgRow) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalMessages = msgRow.total || 0;
    stats.unreadMessages = msgRow.unread || 0;

    db.get("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active FROM amenities", (err, amRow) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.totalAmenities = amRow.total || 0;
      stats.activeAmenities = amRow.active || 0;

      db.get("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active FROM planets", (err, plRow) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalPlanets = plRow.total || 0;
        stats.activePlanets = plRow.active || 0;
        res.json(stats);
      });
    });
  });
});

// ==========================================
// 2. SAYYORALAR (PLANETS) API (RASMLI)
// ==========================================

// Barcha sayyoralarni olish
app.get('/api/planets', (req, res) => {
  db.all("SELECT * FROM planets ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Yangi sayyora qo'shish (Rasmli)
app.post('/api/planets', (req, res) => {
  const { title, description, image, status } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: "Sayyora nomi (title) majburiy!" });
  }

  const query = "INSERT INTO planets (title, description, image, status) VALUES (?, ?, ?, ?)";
  const params = [
    title.trim(),
    description ? description.trim() : '',
    image || '/images/planets/earth.svg',
    status || 'active'
  ];

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get("SELECT * FROM planets WHERE id = ?", [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
});

// Sayyorani yangilash / tahrirlash (Rasmli)
app.put('/api/planets/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, image, status } = req.body;

  db.get("SELECT * FROM planets WHERE id = ?", [id], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!existing) return res.status(404).json({ error: "Sayyora topilmadi" });

    const newTitle = title !== undefined ? title.trim() : existing.title;
    const newDesc = description !== undefined ? description.trim() : existing.description;
    const newImage = image !== undefined ? image : existing.image;
    const newStatus = status !== undefined ? status : existing.status;

    const query = "UPDATE planets SET title = ?, description = ?, image = ?, status = ? WHERE id = ?";
    db.run(query, [newTitle, newDesc, newImage, newStatus, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get("SELECT * FROM planets WHERE id = ?", [id], (err, updatedRow) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(updatedRow);
      });
    });
  });
});

// Sayyorani o'chirish
app.delete('/api/planets/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM planets WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Sayyora topilmadi" });
    res.json({ message: "Sayyora muvaffaqiyatli o'chirildi", id: Number(id) });
  });
});

// ==========================================
// 3. QULAYLIKLAR (AMENITIES) API
// ==========================================

// Barcha qulayliklarni olish
app.get('/api/amenities', (req, res) => {
  db.all("SELECT * FROM amenities ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Yangi qulaylik qo'shish
app.post('/api/amenities', (req, res) => {
  const { title, description, status } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: "Qulaylik nomi (title) majburiy!" });
  }

  const query = "INSERT INTO amenities (title, description, icon, status) VALUES (?, ?, '', ?)";
  const params = [
    title.trim(),
    description ? description.trim() : '',
    status || 'active'
  ];

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get("SELECT * FROM amenities WHERE id = ?", [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
});

// Qulaylikni yangilash
app.put('/api/amenities/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  db.get("SELECT * FROM amenities WHERE id = ?", [id], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!existing) return res.status(404).json({ error: "Qulaylik topilmadi" });

    const newTitle = title !== undefined ? title.trim() : existing.title;
    const newDesc = description !== undefined ? description.trim() : existing.description;
    const newStatus = status !== undefined ? status : existing.status;

    const query = "UPDATE amenities SET title = ?, description = ?, status = ? WHERE id = ?";
    db.run(query, [newTitle, newDesc, newStatus, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get("SELECT * FROM amenities WHERE id = ?", [id], (err, updatedRow) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(updatedRow);
      });
    });
  });
});

// Qulaylikni o'chirish
app.delete('/api/amenities/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM amenities WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Qulaylik topilmadi" });
    res.json({ message: "Qulaylik muvaffaqiyatli o'chirildi", id: Number(id) });
  });
});

// ==========================================
// 4. XABARLAR (MESSAGES) API
// ==========================================

// Kelgan barcha xabarlarni olish
app.get('/api/messages', (req, res) => {
  const { search, unreadOnly } = req.query;
  let query = "SELECT * FROM messages";
  let conditions = [];
  let params = [];

  if (search) {
    conditions.push("(name LIKE ? OR phone LIKE ? OR message LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (unreadOnly === 'true' || unreadOnly === '1') {
    conditions.push("is_read = 0");
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY id DESC";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Yangi xabar qabul qilish (Mijoz tomonidan)
app.post('/api/messages', (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Iltimos, ismingizni kiriting!" });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: "Iltimos, telefon raqamingizni kiriting!" });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Iltimos, xabaringizni kiriting!" });
  }

  const query = "INSERT INTO messages (name, phone, message, is_read) VALUES (?, ?, ?, 0)";
  const params = [name.trim(), phone.trim(), message.trim()];

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get("SELECT * FROM messages WHERE id = ?", [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        success: true,
        message: "Xabaringiz muvaffaqiyatli qabul qilindi!",
        data: row
      });
    });
  });
});

// Xabarni o'qilgan deb belgilash
app.patch('/api/messages/:id/read', (req, res) => {
  const { id } = req.params;
  db.run("UPDATE messages SET is_read = 1 WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Xabar topilmadi" });
    res.json({ message: "Xabar o'qilgan deb belgilandi", id: Number(id) });
  });
});

// Xabarni o'chirish
app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM messages WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Xabar topilmadi" });
    res.json({ message: "Xabar muvaffaqiyatli o'chirildi", id: Number(id) });
  });
});

// ==========================================
// 5. SAHIFALAR VA ROUTING
// ==========================================
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'website', 'index.html'));
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`👑 Sariq-Qora Admin Panel: http://localhost:${PORT}`);
  console.log(`👑 Admin Panel (/admin): http://localhost:${PORT}/admin`);
  console.log(`📖 Swagger API Docs: http://localhost:${PORT}/docs`);
  console.log(`=======================================================`);
});
