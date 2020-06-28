"use strict";

const express = require("express");
const got = require("got");
const mysql = require("mysql");
const elasticsearch = require("elasticsearch");

const PORT = 8080;
const HOST = "0.0.0.0";
const TRGT = "https://jsonplaceholder.typicode.com/todos";
const OPTS = {
  responseType: "json"
};

const app = express();

function newMysqlConnection() {
  return mysql.createConnection({
    host : process.env.JDBC_HOST,
    user : "fargate_poc",
    password : "fargate_poc"
  });
}

function newElasticConnection() {
  return new elasticsearch.Client( {  
    hosts: [ process.env.ES_HOST ]
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
  const connection = newMysqlConnection();
  connection.connect(function (err) {
    const done = !err;
    if (done) {
      connection.end();
    }
    res.send({ web_mysql: done });
  });
});

app.get("/es", (req, res) => {
  const client = newElasticConnection();
  client.cluster
    .health({}, function (err, resp, status) {  
      const done = !err;
      res.send({ web_es: done });
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);