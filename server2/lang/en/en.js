const STRINGS = {
  server: {
    port: 8081,
    startMsg: "Server2 running at http://localhost:8081",
    routePrefix: "/lab5/api/v1/sql/",
  },
  db: {
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "lab5db",
    connectSuccess: "Connected to MySQL",
    tableReady: "patient table ready",
  },
  messages: {
    invalidEndpoint: "404 not found",
    restrictedQuery: "UPDATE/DROP not allowed",
    invalidJson: "Invalid JSON or query",
  },
};

module.exports = STRINGS;
