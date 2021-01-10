const List = require('../app/models/list');
const Item = require('../app/models/item');
const _ = require('lodash');

module.exports = function (app) {

    //task list pages
    app.get('/:listName', isLoggedIn, function(req, res, done) {
        console.log(req.user._id);
        const listKey = req.params.listName;
        const page = _.capitalize(listKey);
        List.findOne({
            createdBy: req.user._id
            , name: page})
            .populate('todo')
            .exec(function (err, list) {
                if (err) {
                    console.log("error")
                }
                if (list) {
                    console.log("found list")
                    console.log(list.todo)
                    res.render('list.ejs', {
                        user : req.user
                        , userId : req.user._id
                        , listTitle : page
                        , newListItems : list.todo
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
                    res.redirect("/" + listKey);
                }
            })
            
        
    })

    //add a task
    app.post("/", function(req, res) {

        const itemName = req.body.newItem;
        const listName = req.body.list;
        const userId = req.body.userid;
        console.log(userId)
        console.log(listName)
        const newItem = new Item({
            name: itemName
            , createdBy: userId
            , listName: listName
        })
        newItem.save();
        List.findOne(
            {
                createdBy : userId 
                , name : listName
            }, function(err, list) {
                console.log(list.name)
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

        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("task completed");
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