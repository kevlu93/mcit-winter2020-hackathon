const List = require('../app/models/list');
const Item = require('../app/models/item');
const _ = require('lodash');

/**
 * This function takes in the app as the parameter.
 * It handles various tasks related to building and managing the task lists
 * @param app
 */
module.exports = function (app) {

    /**
     * This takes a GET request from a given list, ie. General, 591, 596, etc.
     * It looks through the list database to see if the user already has the relevant list initialized
     * If so, will render the page for the list
     * Otherwise, it will create the relevant List document for the user
     */
    app.get('/:listName', isLoggedIn, function(req, res, done) {
        const listKey = req.params.listName;
        if(listKey == 'favicon.ico') {
            listKey = 'general';
        }
        const page = _.capitalize(listKey);
        List.findOne({
            //queries for the relevant list that has been created by the given user
            createdBy: req.user._id
            , name: page})
            //If the list is found, populate its todo and completed arrays so that we can pass the Item objects stored within to the list.ejs template
            .populate('todo')
            .populate('completed')
            //Execute the query and populate commands
            .exec(function (err, list) {
                if (err) {
                    console.log("error")
                }
                //If the list is found, render the list component
                //Pass through the relevant pieces of data to the list.ejs template
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
                    //If the list does not exist yet, initialize it for the user
                    console.log("Making list")
                    newList = new List();
                    newList.name = page;
                    newList.createdBy = req.user._id;
                    newList.todo = [];
                    newList.completed = [];
                    newList.save(function(err) {
                        if (err)
                            throw err;
                        //console.log("Finished making list")
                        res.redirect("/" + listKey);
                    });

                }
            })


    })

    /**
     * This takes a POST request from clicking the add task button
     * Because we have added a requirement to the text input, this request is only made if the user typed in a task and then pressed the add button
     * We take in information about the user and list where the task was added, and then pass it to the Item model constructor
     * The item is added it to the Items database, and we also push the Item document to the list's to-do array
     */
    app.post("/", function(req, res) {
        //takes data from the HTML request
        const itemName = req.body.newItem;
        const listName = req.body.list;
        const userId = req.body.userid;
        const listId = req.body.listid;
        //constructs the Item document and adds it to the database
        const newItem = new Item({
            name: itemName
            , createdBy: userId
            , listName: listName
            , listId: listId
            , completed : false
        })
        newItem.save();
        //Queries for the list where the request was made from, and pushes the new Item to the list's todo array
        List.findOne(
            {
                createdBy : userId
                , name : listName
            }, function(err, list) {
                //takes the resulting List document and adds the item to its todo array
                list.todo.push(newItem);
                list.save( function(err) {
                    if (err) {
                        throw err
                    }
                    res.redirect("/" + listName)
                });

            }
        )
    });

    /**
     * This takes a POST request from checking off a completed task.
     * We find the completed Item in the items database using its unique ObjectId and flag it as complete
     * We then query the list that contained the item, remove the item from the list's todo array, and then add it to the list's completed array
     */
    app.post("/delete", (req, res) => {
        const checkedItemId = req.body.checkbox;
        const listName = req.body.listName;
        const listId = req.body.listID
        //uses the item's unique ObjectID to find it in the database
        Item.findById(checkedItemId, (err, item) => {
            if (err) {
              console.log(err);
            } else {
              //Update the list that contained the Item
              console.log("task completed");
              List.findById(listId, function(err, list) {
                  //flag the item as completed and update the database
                  item.completed = true
                  item.save();
                  //Remove the item from the list's todo array
                  list.todo.pull(item)
                  //Add the item to the list's completed array
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
