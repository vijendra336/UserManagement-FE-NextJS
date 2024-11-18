// // server.ts
// import { createServer } from 'https';
// import { parse } from 'url';
// import next from 'next';
// import fs from 'fs';
// import { IncomingMessage, ServerResponse } from 'http';

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// const httpsOptions = {
//   key: fs.readFileSync('./localhost.key'),
//   cert: fs.readFileSync('./localhost.crt'),
// };

// app.prepare().then(() => {
//   createServer(httpsOptions, (req: IncomingMessage, res: ServerResponse) => {
//     const parsedUrl = parse(req.url!, true);
//     handle(req, res, parsedUrl);
//   }).listen(3000, (err?: Error) => {
//     if (err) throw err;
//     console.log('> Ready on https://localhost:3000');
//   });
// });
