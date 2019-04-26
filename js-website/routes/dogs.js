var express = require("express");
var router = express.Router();
var Dog = require("../models/dog.js");
var middleware = require("../middleware");

//INDEX - show all dog
router.get("/", function(req, res){
   
    Dog.find({}, function(err, allDogs){
        if(err){
            console.log(err);
        } else {
            res.render("dogs/index.ejs", {dogs:allDogs, currentUser:req.user});
        }
    });
});
//CREATE - add new dog to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var race = req.body.race;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newDog = {name: name, race: race, image: image, description: desc, author: author}
    

    //Create new dog and save to DB
    Dog.create(newDog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/dogs");
        }
    })
    
});
//NEW - show form to create new dog
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("dogs/new.ejs");
});

//SHOW - shows more info about cmpg
router.get("/:id", function(req, res){
    Dog.findById(req.params.id).populate("comments").exec(function(err, foundDog){
        if(err){
            console.log(err);
        } else {
            console.log(foundDog);
            res.render("dogs/show.ejs", {dog: foundDog});
        }
    });

})

//edit route
router.get("/:id/edit", middleware.checkDogOwnership, function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        res.render("dogs/edit.ejs", {dog: foundDog});
    }); 
});

//update route
router.put("/:id", middleware.checkDogOwnership, function(req,res){
    
    Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(err, updatedDog){
        if(err){
            res.redirect("/dogs");
        } else {
            res.redirect("/dogs/" + req.params.id);
        }
    })
});

//destroy
router.delete("/:id", middleware.checkDogOwnership, function(req, res){
    Dog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/dogs");
        } else {
            res.redirect("/dogs");
        }
    });
});



module.exports = router;