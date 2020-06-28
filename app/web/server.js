"use strict";

const express = require("express");
const got = require("got");
const mysql = require('mysql');

const PORT = 8080;
const HOST = "0.0.0.0";
const TRGT = "https://jsonplaceholder.typicode.com/todos";
const OPTS = {
  responseType: "json"
};

const app = express();

function newConnection() {
  console.log(`JDBC: ${process.env.JDBC_HOST}`);
  return mysql.createConnection({
    host : process.env.JDBC_HOST,
    user : "fargate_poc",
    password : "fargate_poc"
  });
}

app.get("/todos", async (req, res) => {
  const { body } = await got.get(TRGT, OPTS);
  res.send({
    web: { body }
  });
});

app.get("/todos/:id", async (req, res) => {
  const uri = `${TRGT}/${req.params.id}`;
  const { body } = await got.get(uri, OPTS);
  res.send({
    web: { body }
  });
});

app.get("/mysql", (req, res) => {
  const connection = newConnection();
  connection.connect(function (err) {
    console.log(err);
    const done = !err;
    if (done) {
      connection.end();
    }
    res.send({ web_mysql: done });
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);