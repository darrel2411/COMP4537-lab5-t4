// This code was developed with assistance from OpenAI's ChatGPT

const http = require("http");
const url = require("url");
const Database = require("./db");
const STRINGS = require("./lang/en/en.js");
const { mysqlErrToStatus } = require("./utils/utils.js");

class ApiServer {
  constructor() {
    this.db = new Database();
    this.port = STRINGS.server.port;
    this.routePrefix = STRINGS.server.routePrefix;
  }


  handleGet(req, res, sqlQuery = "") {
    if (!sqlQuery) {
      res.writeHead(400, {
        ok: false,
        error: STRINGS.messages.restrictedGetQuery
      })
    }

    this.db.query(sqlQuery, (err, result) => {
      console.log(result)
      if (err) {
        const statusCode = mysqlErrToStatus(err);
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          ok: false,
          error: err.sqlMessage,
          errno: err.errno,
          code: err.code,
          sqlState: err.sqlState,
          sql: err.sql
        }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, result }));
      }
    });
  }

  handlePost(req, res) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));

    req.on("end", () => {
      try {
        const { query } = JSON.parse(body);
        const lower = query.toLowerCase();

        if (lower.includes("update") || lower.includes("drop")) {
          res.end(JSON.stringify({ error: STRINGS.messages.restrictedQuery }));
          return;
        }

        this.db.query(query, (err, result) => {
          if (err) {
            res.end(JSON.stringify({ error: err.message }));
          } else {
            res.end(JSON.stringify({ success: true, result }));
          }
        });
      } catch (e) {
        res.end(JSON.stringify({ error: STRINGS.messages.invalidJson }));
      }
    });
  }

  handleRequest(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "application/json");

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname; // "/path_name"

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (path.startsWith(this.routePrefix)) {
      if (req.method === "GET") {
        const encodedSql = path.slice(this.routePrefix.length); // select%20*%20from%20patient
        const sql = decodeURIComponent(encodedSql); // select * from patient
        this.handleGet(req, res, sql);
      } else if (req.method === "POST") {
        this.handlePost(req, res);
      } else {
        res.writeHead(405);
        res.end(JSON.stringify({ error: STRINGS.messages.invalidEndpoint }));
      }
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: STRINGS.messages.invalidEndpoint }));
    }
  }

  start() {
    const server = http.createServer((req, res) => this.handleRequest(req, res));
    server.listen(this.port, () =>
      console.log(STRINGS.server.startMsg)
    );
  }
}

const apiServer = new ApiServer();
apiServer.start();
