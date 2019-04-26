var express = require("express");
var router = express.Router({mergeParams: true});
var Dog = require("../models/dog.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Dog.findById(req.params.id, function(err, dog){
        if(err)
        {
            console.log(err);
        } else {
            res.render("comments/new.ejs", {dog: dog});
        }
    })
});

router.post("/", middleware.isLoggedIn, function(req,res){
    //look cmpg using id
    Dog.findById(req.params.id, function(err, dog){
        if(err){
            console.log(err);
            res.redirect("/dogs");
        } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
               } else {
                   //add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   
                   //save comment
                   comment.save();
                   dog.comments.push(comment);
                   dog.save();
                   res.redirect('/dogs/' + dog._id);
               }
           })  
        }
    })
})

//Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {

            res.render("comments/edit.ejs", {dog_id: req.params.id, comment: foundComment});
        }
    })
})

//Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/dogs/" + req.params.id);
        }
    })
})

//Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/dogs/" + req.params.id);
        }
    });
});

module.exports = router;