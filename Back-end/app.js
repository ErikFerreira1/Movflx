require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
const User = require("./models/User");

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem-vindo a API!" });
});

app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  res.status(200).json({ user });
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado" });
  }
  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido!" });
  }
}

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(422).json({ msg: "Nome Obrigatório!" });
  }

  if (!email) {
    return res.status(422).json({ msg: "Email Obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Senha Obrigatória!" });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "Email em uso!" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Aconteceu um erro no servidor!" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "Email Obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Senha Obrigatória!" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(422).json({ msg: "Usuário não encotrado" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
        username: user.name,
      },
      secret
    );

    res
      .status(200)
      .json({
        msg: "Autenticação realizada com sucesso",
        token,
        username: user.name,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Aconteceu um erro no servidor!" });
  }
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@authjwt.pjqqpic.mongodb.net/`)
  .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco");
  })
  .catch((err) => console.log(err));
