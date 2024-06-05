//  to controll ur website

const express = require("express");
const app = express();
const port =  process.env.PORT || 5000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const Article = require("./models/articleSchema");

const pdf = require("html-pdf");
const fs = require("fs");
const bodyParser = require("body-parser");






// for auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});








// mongoose
const mongoose = require("mongoose");


mongoose.set("strictQuery", false); // Add this line to address the deprecation warning

mongoose
  .connect('mongodb+srv://alibassi:ali&é"ali@cluster0.utum5kz.mongodb.net/all-data?retryWrites=true&w=majority')
  .then((result) => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// ... rest of the code ...












app.get("/", (req, res) => {
  res.redirect("/all-articles");
});

app.get("/all-articles", (req, res) => {
  // res.render("index", { mytitle: "HOME" });

  // result = Array of objects inside mongo database

  Article.find()
    .then((result) => {
      res.render("index", { mytitle: "HOME", arrArticle: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/add-new-article", (req, res) => {
  res.render("add-new-article", { mytitle: "create new article" });
});

app.post("/all-articles", (req, res) => {
  const article = new Article(req.body);

  // console.log(req.body)

  article
    .save()
    .then((result) => {
      res.redirect("/all-articles");
    })
    .catch((err) => {
      console.log(err);
    });
});









app.get("/all-articles/:id", (req, res) => {
  // result =   object  inside mongo database

  Article.findById(req.params.id)
    .then((result) => {
      res.render("details", { mytitle: "ARTICLE DETAILS", objArticle: result });
    })
    .catch((err) => {
      console.log(err);
    });
});








// ...

// GET route to render the update form
app.get("/all-articles/:id/edit", (req, res) => {
  Article.findById(req.params.id)
    .then((result) => {
      res.render("update-article", { mytitle: "Update Article", objArticle: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// POST route to update the article in the database
app.post("/all-articles/:id", (req, res) => {
  Article.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.redirect("/all-articles");
    })
    .catch((err) => {
      console.log(err);
    });
});

// ...










app.delete("/all-articles/:id", (req, res) => {
  Article.findByIdAndDelete(req.params.id)

    .then((params) => {
      res.json({ mylink: "/all-articles" });
    })

    .catch((err) => {
      console.log(err);
    });
});







































//  404
app.use((req, res) => {
  res.status(404).send("Sorry can't find that!");
});



