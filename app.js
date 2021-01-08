//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//Create Schema for new todo items
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Task Text must be provided"]
  }
})

//Create Schemo for different todo newListItems
//has a name and array of items that follow itemSchema
const listSchema = {
  name: String,
  items: [itemSchema]
}

// ***********MONGOOSE MODELS*****************
//First entry must be singular of collection name
//Second element, schema to be used
const Item = mongoose.model('Item', itemSchema);

const List = mongoose.model('List', listSchema);

// ********ADD DEFAULT ELEMENTS TO MONGODB**************
//CREATE elements
const flour = new Item({
  name: "Buy flour",
});

const butter = new Item({
  name: "Buy butter",
});

const milk = new Item({
  name: "Buy milk",
})

const defaultItems = [];

// ************ DYNAMIC ROUTING ***************
app.get("/:listName", (req, res) => {
  //to handle upper/lowercase
  const page = _.lowerCase(req.params.listName);
  List.findOne({
    name: page
  }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        //Create new list
        const list = new List({
          name: page,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + page);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    } else {
      console.log(err);
    }
  });
});


app.get("/", function(req, res) {

  const day = date.getDate();

  // ********IMPORT DB************
  // find all elements = {}
  // Item.find({}, (err, items) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     //case no items in DB yet
  //     if (items.length === 0) {
  //       // insertMany into mongoosemodel
  //       Item.insertMany(defaultItems, (err) => {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           console.log("All elements added");
  //           //to show default items just added
  //           res.redirect("/");
  //         }
  //       })
  //     } else {
  //       res.render("list", {
  //         listTitle: "Default",
  //         newListItems: items
  //       });
  //     }
  //
  //   }
  // });
  Item.find({}, (err, items) => {
  //  console.log(items);
    if (err) {
      console.log(err);
    } else {
      res.render("list", {
        listTitle: "Default",
        newListItems: items
      });
    }
  });

});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName
  })

  if (listName === "Default") {
    //save new item to collection
    Item.insertMany(newItem, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("All elements added");
        //to show default items just added
        res.redirect("/");
      }
    });
    // console.log(newItem);
    // res.redirect("/");
  } else { //custom list
    List.findOne({
      name: listName
    }, (err, foundList) => {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("deleted");
      res.redirect("/");
    }
  })
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
