require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");

//Middleware
//this checks the incoming request for form data and turns it into req.body
app.use(express.urlencoded({extended:false}))
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", ()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)

});

mongoose.connection.on("error", (err)=>{
    console.log(`Failed to connect due to ${err}`)
});

const Food = require("./models/foods.js")

app.get("/", (req,res)=>{
    res.render("index.ejs")
})

// I.N.D.U.C.E.S
//GET -  Index /fruits
//GET -  New /fruits/new
//DELETE -  Delete /fruits/:id
//PUT -  Update /fruits/:id
//POST -  Create /fruits/
//GET - Edit /fruits/:id/edit
//GET Show /fruits/:id

//Index
app.get("/foods", async(req,res)=>{
    const foods = await Food.find({})
    res.render("foods/index.ejs",{
        title: "This is the Food Page",
        allFoods: foods
    })
})


//New
app.get("/foods/new", (req,res)=>{
    res.render("foods/new.ejs")
});

//delete
app.delete("/foods/:id", (req, res) => {
    // alternative to async await
    Food.findByIdAndDelete(req.params.id).then((responseFromDb) => {
      console.log(responseFromDb);
      res.redirect("/foods");
    });
  });

  //put
app.put("/foods/:id", async(req,res)=>{
    if (req.body.needToCook === "on") {
        req.body.needToCook = true;
      } else {
        req.body.needToCook = false;
      }

    const food= await Food.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
    })

    res.redirect(`/foods/${req.params.id}`);
})

//Post
app.post("/foods", async (req,res)=>{
if(req.body.needToCook === "on"){
    req.body.needToCook = true;
}else{
    req.body.needToCook = false
}

const food = await Food.create(req.body)
res.redirect("/foods")
})


//edit
app.get("/foods/:id/edit", async(req,res)=>{
const food= await Food.findById(req.params.id);
res.render("foods/edit.ejs",{
    food,
})
})

//Show
app.get("/foods/:id", async (req,res)=>{
const food= await Food.findById(req.params.id);
res.render("foods/show.ejs",{
    food,
})
})






app.listen(3000,()=>{
    console.log("Listening on 3000")
})