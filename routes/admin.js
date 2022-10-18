var express = require("express");
var router = express.Router();

const Hardware = require("../models/hardware");
const User = require("../models/user");

router.put("/repair", (req, res) => {
  const { inRepair, hardware } = req.body;

  hardwareData = Hardware.findByIdAndUpdate(
    {
      _id: hardware,
    },
    {
      inRepair: inRepair,
    }
  );
  hardwareData.exec((err, hardwareData) => {
    if (err) {
      console.log("error:", err);
      res.json(err);
      return;
    }
    if (!hardwareData) {
      console.log("No hardware found", hardwareData);
      res.json({ message: "No hardware found" });
    }
    res.json({ message: "Repair status changed", hardwareData });
    console.log("Repair status changed", hardwareData);
  });
});

router.post("/add", (req, res) => {
  const { company, name } = req.body.hardware;

  let errors = [];
  if (!company) {
    errors.push({ message: "Please complete the company field" });
  }
  if (!name) {
    errors.push({ message: "Please complete the name field" });
  }

  if (errors.length > 0) {
    console.log("Fields not completed");
    res.json({
      errors,
      hardware: {
        name,
        company,
      },
    });
    return;
  }
  const newHardware = new Hardware({
    name: name,
    company: company,
  });
  newHardware.save((err) => {
    if (!err) {
      console.log("Hardware added successfully");
      res.json({
        message: "Hardware added successfully",
        hardware: { name: name, company: company },
      });
    } else {
      console.log("error:", err);
      res.json(err);
    }
  });
});

router.put("/edit", (req, res) => {
  const { company, name, _id } = req.body;

  let errors = [];
  if (!company) {
    errors.push({ message: "Please complete the company field" });
  }
  if (!name) {
    errors.push({ message: "Please complete the name field" });
  }

  if (errors.length > 0) {
    console.log("Fields not completed");
    res.json({
      errors,
      hardware: {
        name,
        company,
      },
    });
    return;
  }
  hardwareData = Hardware.findByIdAndUpdate(
    {
      _id: _id,
    },
    {
      company: company,
      name: name,
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
    res.json({ message: "Hardware changed successfully", hardwareData });
    console.log("Hardware added successfully!", hardwareData);
  });
});

router.delete("/delete/:id", (req, res) => {
  Hardware.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (!err) {
      res.json({ message: "Hardware deleted successfully" });
    } else {
      res.json(err);
    }
  });
});
module.exports = router;
