//should be added at very beginning, to use environment varialbes
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

//ejs looks for html templates in views folder. Must be called "views" with s
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

//When deploying webpage, folder that is checked by express for other files
app.use(express.static("public"));

// // ****set-up local server - mongoose **********
// mongoose.connect("mongodb://localhost:27017/todolistDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// });


// ****set-up remote server - mongoose **********
//Connect to MongoDB Atlas
//Coment out when testing locally and replace with above
const user = process.env.user;
const password = process.env.password;
mongoose.connect("mongodb+srv://" + user + ":" + password + "@clusterdefault.faspm.mongodb.net/toDoDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
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

app.get("/about", function(req, res) {
  res.render("about");
});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  if (itemName.length !== 0) {

    const newItem = new Item({
      name: itemName
    });

    //  console.log("Length" + itemName.length);

    if (listName === "General") {
      //save new item to collection
      Item.insertMany(newItem, (err) => {
        if (!err) {
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
  } else {
    //window.alert("Task Text cannot be empty");
    if (listName === "General") {
      res.redirect("/");
    } else { //custom list
      res.redirect("/" + listName);
    }
  }
});

// ********ADD DEFAULT ELEMENTS TO MONGODB**************
//CREATE elements
// const flour = new Item({
//   name: "Buy flour",
// });
//
// const butter = new Item({
//   name: "Buy butter",
// });
//
// const milk = new Item({
//   name: "Buy milk",
// })

const defaultItems = [];

// ************ DYNAMIC ROUTING ***************
app.get("/:listName", (req, res) => {
  //to handle upper/lowercase
  const page = _.capitalize(req.params.listName);
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

  // const day = date.getDate();

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
        listTitle: "General",
        newListItems: items
      });
    }
  });

});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "General") {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted");
        res.redirect("/");
      }
    })
  } else {
    //combining mongoDB operator $pull with mongoose findOneandUpdate
    //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    const filter = {
      name: listName
    };
    const update_cmd = {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    };
    //foundList, is the list that findOne and Update found
    List.findOneAndUpdate(filter, update_cmd, (err, foundList) => {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }


});

//configuration to deploy app on Heroku
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server listening on port" + port);
});
