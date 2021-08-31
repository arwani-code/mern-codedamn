const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/products");

app.post("/api/register", async (req, res) => {
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok", message: "user berhasil ditambahkan" });
  } catch (error) {
    res.json({ status: "error", error: "some error" });
  }
  res.json({ status: "ok" });
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwt.sign(
    {
      name: user.name,
      email: req.body.email,
    },
    "scret123"
  );

  user
    ? res.send({ status: "ok", user: token })
    : res.send({ status: "error", user: false });
});

app.get("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decode = jwt.verify(token, "secret123");
    const email = decode.email;
    const user = User.findOne({ email: email });

    return res.json({ status: "ok", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.json({ statur: "error", error: "invalid token" });
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decode = jwt.verify(token, "secret123");
    const email = decode.email;
    const user = User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }
    );

    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ statur: "error", error: "invalid token" });
  }
});

app.listen(1337, () => console.log(`Server running on port ${1337}`));
