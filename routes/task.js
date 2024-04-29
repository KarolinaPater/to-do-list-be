const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const { validateToken } = require("../JWT");
const config = require("../config");
const { verify } = require("jsonwebtoken");

module.exports = router;

router.post("/add", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  const { description } = req.body;

  if (!description) {
    res.status(400).json({ message: "Proszę uzupełnić wymagane pola" });
  }

  const newTask = new Task({
    description: description,
    user: token.id,
    done: false,
  });

  newTask.save((err) => {
    if (!err) {
      res.status(200).json({ message: "Zadanie dodane pomyślnie" });
    } else {
      res.status(400).json(err);
    }
  });
});

router.get("/list", (res) => {
  taskList = Task.find();

  taskList.exec((err, taskList) => {
    if (err) {
      res.status(400).json({ err });
    }
    if (!taskList) {
      res.status(400).json({ message: "Brak zadań" });
    }
    res.status(200).json({ taskList });
  });
});

router.get("/get-task-list", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  const { done } = req?.query; //t,f
  taskList = Task.find({
    user: token.id,
    ...(done ? { done: done === "true" } : {}),
  });
  taskList.exec((err, list) => {
    if (err) {
      //res.json(400, err);
      res.status(400).json(err);
    }
    if (!list) {
      res.json({ message: "Brak produktów" });
    }
    res.json({ taskList: list });
  });
});

router.put("/change-status/:id", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);
  const { done } = req?.body;
  const { id } = req.params;

  if (!id) {
    res.json(400, { message: "Brak id taska" });
  }

  const taskList = Task.findByIdAndUpdate(
    {
      user: token.id,
      _id: id,
    },
    {
      done: done,
    }
  );
  taskList.exec((err, taskList) => {
    if (err) {
      res.json(400, { message: "Błąd serwera" });
    }
    if (!taskList) {
      res.json(400, { message: "Nie ma takiego produktu" });
    }
    res.json(200, { message: "Produkt pomyślnie zedytowany" });
  });
});

router.delete("/delete/:id", validateToken, (req, res) => {
  const { id } = req.params;

  const task = Task.findByIdAndDelete({
    _id: id,
  }).then((task) => {
    if (!task) {
      res.status(400).json({ message: "Brak zadania do usuniecia" });
    } else {
      res.status(200).json({ message: "Zadanie zostało usunięte" });
    }
  });
});

router.post("/add-task", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);

  const { description } = req.body;

  if (!description) {
    res.status(400).json({ message: "Proszę uzupełnić wymagane pola" });
  }
  const newTask = new Task({
    user: token.id,
    done: false,
    description: description,
  });

  newProduct.save((err) => {
    if (!err) {
      res.json(200, { message: "Produkt zostal dodany pomyślnie" });
    } else {
      res.json(400, err);
    }
  });
  newTask.save((err) => {
    if (!err) {
      res.status(200).json({ message: "Task zostal dodany pomyślnie" });
    } else {
      res.status(400).json(err);
    }
  });
});
