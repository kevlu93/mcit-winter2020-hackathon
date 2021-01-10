const List = require('../app/models/list');
const Item = require('../app/models/item');
const _ = require('lodash');

module.exports = function (app) {

    //task list pages
    app.get('/:listName', isLoggedIn, function(req, res, done) {
        const listKey = req.params.listName;
        const page = _.capitalize(listKey);
        List.findOne({
            createdBy: req.user._id
            , name: page})
            .populate('todo')
            .populate('completed')
            .exec(function (err, list) {
                if (err) {
                    console.log("error")
                }
                if (list) {
                    console.log("found list")
                    res.render('list.ejs', {
                        user : req.user
                        , userId : req.user._id
                        , listTitle : page
                        , newListItems : list.todo
                        , completedItems : list.completed
                        , listId : list._id
                    });
                } else {
                    console.log("Making list")
                    newList = new List();
                    newList.name = page;
                    newList.createdBy = req.user._id;
                    newList.todo = [];
                    newList.completed = [];
                    newList.save(function(err) {
                        if (err)
                            throw err;
                    });
                    //console.log("Finished making list")
                    res.redirect("/" + listKey);
                }
            })
            
        
    })

    //add a task
    app.post("/", function(req, res) {
        const itemName = req.body.newItem;
        const listName = req.body.list;
        const userId = req.body.userid;
        const listId = req.body.listid;
        const newItem = new Item({
            name: itemName
            , createdBy: userId
            , listName: listName
            , listId: listId
            , completed : false
        })
        newItem.save();
        List.findOne(
            {
                createdBy : userId 
                , name : listName
            }, function(err, list) {
                list.todo.push(newItem);
                list.save();
                res.redirect("/" + listName)
            }
        )
    });

    //remove a task from the todo list
    app.post("/delete", (req, res) => {
        const checkedItemId = req.body.checkbox;
        const listName = req.body.listName;
        const listId = req.body.listID
        Item.findById(checkedItemId, (err, item) => {
            if (err) {
              console.log(err);
            } else {
              console.log("task completed");
              List.findById(listId, function(err, list) {
                  item.completed = true
                  item.save();
                  console.log(item.name)
                  list.todo.pull(item)
                  list.completed.push(item);
                  list.save();
              })
              res.redirect("/"+listName);
            }
        });
    });
      
    //function that makes sure a user is logged in
    function isLoggedIn(req, res, next) {
        //if user is authenticated, continue
        if (req.isAuthenticated()) {
            return next();
        }
        //otherwise redirect them back to the homepage
        res.redirect('/');
    }
}