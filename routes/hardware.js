var express = require("express");
var router = express.Router();

const Hardware = require("../models/hardware");
const User = require("../models/user");

router.put("/return", (req, res) => {
  const { user, hardware } = req.body;
  console.log("id user i hardware", user, hardware);

  hardwareData = Hardware.findOneAndUpdate(
    {
      _id: hardware,
      user: user,
    },
    {
      $unset: { user: "" },
      availabillity: true,
    }
  );
  hardwareData.exec((err, hardwareData) => {
    if (err) {
      console.log("Error", err);
      res.json(err);
      return;
    }
    if (!hardwareData) {
      console.log("No hardware found", hardwareData);
      res.json({ message: "No hardware found" });
    }
    res.json({ message: "Hardware returned successfully", hardwareData });
    console.log("Hardware returned successfully!", hardwareData);
  });
});

router.put("/rent", (req, res) => {
  const { user, hardware } = req.body;
  hardwareData = Hardware.findByIdAndUpdate(
    {
      _id: hardware,
    },
    {
      user: user,
      availabillity: false,
    }
  );
  hardwareData.exec((err, hardwareData) => {
    if (err) {
      console.log("Error", err);
      res.json(err);
      return;
    }
    if (!hardwareData) {
      console.log("No hardware found", hardwareData);
      res.json({ message: "No hardware found" });
    }
    res.json({ message: "Hardware rented successfully", hardwareData });
    console.log("Hardware rented successfully", hardwareData);
  });
});

router.get("/", (req, res) => {
  hardwareData = Hardware.find();
  hardwareData.sort({ date: -1 });
  hardwareData.exec((err, hardwareData) => {
    if (err) {
      res.json(err);
      return;
    }
    if (!hardwareData) {
      res.json({ message: "No hardware currently" });
    }
    res.json({ hardwareData });
  });
});

module.exports = router;
