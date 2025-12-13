import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  });

  if (req.url === '/' || req.url === '/health') {
    res.end('Vexusware Scripts Repository - Active');
  } else if (req.url === '/api/games') {
    try {
      const gamesConfig = readFileSync(join(__dirname, 'src/vexus/vexusware.lua'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(gamesConfig);
    } catch (error) {
      res.writeHead(500);
      res.end('Error loading games configuration');
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
