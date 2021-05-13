require('dotenv').config();

console.clear();
console.log("---> mygarage.games <---");

const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const cors = require('cors');
const express = require('express');
const forceSecure = require('express-force-https');
const chalk = require('chalk');

let isDev = process.env.NODE_ENV !== 'prod';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', require('./routes/v1/index'));

// HTTP to HTTPS redirect
if(!isDev) {
    app.use(forceSecure);
}

// Servers
const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT_HTTP, () => {
    console.log(chalk.green(`[mgg-server] (Server) HTTP server running on port ${process.env.PORT_HTTP}.`));
});

if(!isDev) {
    const sslPK = fs.readFileSync('/etc/letsencrypt/live/mygarage.games/privkey.pem', 'utf8');
    const sslCert = fs.readFileSync('/etc/letsencrypt/live/mygarage.games/cert.pem', 'utf8');
    const sslCA = fs.readFileSync('/etc/letsencrypt/live/mygarage.games/chain.pem', 'utf8');
    const credentials = {
        key: sslPK,
        cert: sslCert,
        ca: sslCA
    };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(process.env.PORT_HTTPS, () => {
        console.log(chalk.green(`[mgg-server] (Server) HTTPS server running on port ${process.env.PORT_HTTPS}.`));
    });
} else {
    console.log(chalk.grey(`[mgg-server] (Server) HTTPS server disabled on development instances.`));
}