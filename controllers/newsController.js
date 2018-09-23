var express = require("express");

var router = express.Router();

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Routes

router.get("/", function(req, res) {
      res.render("index");
  });

// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    // axios.get("http://www.echojs.com/").then(function(response) {
    //   // Then, we load that into cheerio and save it to $ for a shorthand selector
    //   var $ = cheerio.load(response.data);
  
    //   // Now, we grab every h2 within an article tag, and do the following:
    //   $("article h2").each(function(i, element) {
    //     // Save an empty result object
    //     var result = {};
  
    //     // Add the text and href of every link, and save them as properties of the result object
    //     result.title = $(this)
    //       .children("a")
    //       .text();
    //     result.link = $(this)
    //       .children("a")
    //       .attr("href");

    console.log("Inside scrape")

      axios.get("https://techcrunch.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

    //   console.log(response.data)
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("h2.post-block__title").each(function(i, result) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

          console.log("RESULT");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
  
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });
  
// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
// Grab every document in the Articles collection
db.Article.find({})
    .then(function(dbArticle) {
    // If we were able to successfully find Articles, send them back to the client
    res.json(dbArticle);
    })
    .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
    });
});
  
// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
    // If we were able to successfully find an Article with the given id, send it back to the client
    res.json(dbArticle);
    })
    .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
    });
});
  
  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        // TODO: Need to update the array and add it to their list of notes
        // return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote} }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  //Route to get information on the Note
  router.get("/notes/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Note.findOne({ _id: req.params.id })
  
        .then(function(dbNote) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbNote);
        })
        .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
        });
    });

    router.post("/notes/:id", function(req,res){
        db.Note.remove({_id: req.params.id})
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
          })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
    })

  module.exports = router;