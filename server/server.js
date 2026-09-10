import express from 'express';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT ?? 3000;
const DATA_DIR = process.env.DATA_DIR ?? './data/incoming'; // <-- separate the raw incoming experiment data in this folder
const DIST_DIR = process.env.DIST_DIR ?? './dist'; // <-- the js files locally transpiled from ts 


const app = express();

app.use(express.json());
app.use(express.static(DIST_DIR));


fs.mkdirSync(DATA_DIR, { recursive: true });

app.post('/api/log-click', (req, res) => {
  const line = JSON.stringify({ ...req.body, saved_at: new Date().toISOString() }) + '\n';
  fs.appendFile(path.join(DATA_DIR, 'clicks.ndjson'), line, (err) => {
    if (err) {
      console.error('Write failed:', err);
      return res.status(500).json({ error: 'write failed' });
    }
    res.json({ ok: true });
  });
});

app.post('/api/results', (req, res) => {

  const {
    participantId,
    results,
    startedAt,
  } = req.body;

  if (!participantId || !Array.isArray(results)) {
    return res.status(400).json({
      error: 'Invalid payload'
    });
  }

  const filename =
    `${participantId}_${Date.now()}.json`;

  const payload = {
    participantId,
    startedAt,
    receivedAt: new Date().toISOString(),
    results
  };

  fs.writeFile(
    path.join(DATA_DIR, filename),
    JSON.stringify(payload, null, 2),
    (err) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          error: 'write failed'
        });
      }

      res.json({
        ok: true
      });
    }
  );
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});