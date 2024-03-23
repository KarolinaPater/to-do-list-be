const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const { createTokens, validateToken } = require("../JWT");

module.exports = router;

router.post("/add", (req, res) => {
  const { description } = req.body;

  if (!description) {
    // res.json(400, { message: "Proszę uzupełnić wymagane pola" });
    res.status(400).json({ message: "Proszę uzupełnić wymagane pola" });
  }

  const newTask = new Task({
    description: description,
    done: false,
  });

  newTask.save((err) => {
    if (!err) {
      // res.json(200, { message: "Task zostal dodany pomyślnie" });
      res.status(200).json({ message: "Task zostal dodany pomyślnie" });
    } else {
      res.status(400).json(err);
    }
  });
});

router.get("/list", (req, res) => {
  taskList = Task.find();
  //   taskList.sort({ date: -1 });
  taskList.exec((err, taskList) => {
    if (err) {
      res.status(400).json({ err });
    }
    if (!taskList) {
      res.status(400).json({ message: "Brak tasków" });
    }
    res.status(200).json({ taskList });
  });
});

router.get("/get-task-list", (req, res) => {
  // const accessToken = req.headers["x-access-token"];
  // const token = verify(accessToken, config.JWT_SECRET);

  const { done } = req.query; //t,f

  taskList = Task.find({
    $and: [
      {
        done: { $regex: done || "", $options: "i" },
      },
    ],
  });
  taskList.exec((err, list) => {
    if (err) {
      res.json(400, err);
    }
    if (!list) {
      res.json({ message: "Brak produktów" });
    }
    res.json({ taskList: list });
  });
});

// router.get("/get-task-list", validateToken, (req, res) => {
//   const accessToken = req.headers["x-access-token"];
//   const token = verify(accessToken, config.JWT_SECRET);

//   const { done } = req.query; //t,f

//   taskList = Task.find({
//     $and: [
//       {
//         $and: [
//           {
//             done: { $regex: done || "", $options: "i" },
//           },
//         ],
//       },
//       {
//         user: token.id,
//       },
//     ],
//   });
//   taskList.exec((err, list) => {
//     if (err) {
//       res.json(400, err);
//     }
//     if (!list) {
//       res.json({ message: "Brak produktów" });
//     }
//     res.json({ taskList: list });
//   });
// });

// router.put("/change-status/:id", validateToken, (req, res) => {
//   const accessToken = req.headers["x-access-token"];
//   const token = verify(accessToken, config.JWT_SECRET);

//   const { _id, done } = req.body;

//   if (!_id) {
//     res.json(400, { message: "Błąd brak id artykułu?" });
//   }

//   const taskList = Task.findByIdAndUpdate(
//     {
//       _id: _id,
//       user: token.id,
//     },
//     {
//       brand: brand,
//       done: !done,
//     }
//   );
//   taskList.exec((err, taskList) => {
//     if (err) {
//       res.json(400, { message: "Błąd serwera" });
//     }
//     if (!taskList) {
//       res.json(400, { message: "Nie ma takiego produkty" });
//     }
//     res.json(200, { message: "Produkt został pomyślnie zedytowany" });
//   });
// });

router.put("/change-status/:id", (req, res) => {
  // const accessToken = req.headers["x-access-token"];
  // const token = verify(accessToken, config.JWT_SECRET);
  const { done } = req?.body;
  const { id } = req.params;
  console.log("taks do zmiany statusu", id, done);
  if (!id) {
    res.json(400, { message: "Błąd brak id taska?" });
  }

  const taskList = Task.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      done: !done,
    }
  );
  taskList.exec((err, taskList) => {
    if (err) {
      res.json(400, { message: "Błąd serwera" });
    }
    if (!taskList) {
      res.json(400, { message: "Nie ma takiego produkty" });
    }
    res.json(200, { message: "Produkt został pomyślnie zedytowany" });
  });
});

router.delete("/delete/:id", (req, res) => {
  console.log("router delete");
  const { id } = req.params;
  console.log(id);

  const task = Task.findByIdAndDelete({
    _id: id,
  }).then((task) => {
    if (!task) {
      res.status(400).json({ message: "Brak taksa do usuniecia" });
    } else {
      res.status(200).json({ message: "Task zostal usunięty" });
    }
  });
});

router.post("/add-task", validateToken, (req, res) => {
  const accessToken = req.headers["x-access-token"];
  const token = verify(accessToken, config.JWT_SECRET);

  const { description } = req.body;

  if (!description) {
    // res.json(400, { message: "Proszę uzupełnić wymagane pola" });
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
      // res.json(200, { message: "Task zostal dodany pomyślnie" });
      res.status(200).json({ message: "Task zostal dodany pomyślnie" });
    } else {
      res.status(400).json(err);
    }
  });
});
