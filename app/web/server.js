"use strict";

const express = require("express");
const got = require("got");

const PORT = 8080;
const HOST = "0.0.0.0";
const TRGT = "https://jsonplaceholder.typicode.com/todos";
const OPTS = {
  responseType: "json"
};

const app = express();

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

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);