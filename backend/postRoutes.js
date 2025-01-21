// Import express
const express = require("express")
const database = require("./connect")
// ObjectId is a class that is used to convert a string into a mongoDB object id
const ObjectId = require("mongodb").ObjectId

// express.Router() is a function that creates a new router object that can be used to handle requests
let postRoutes = express.Router()

// #1 - Retrieve all
// References http://localhost:3000/posts
// .get() is a method that is used to retrieve data from the server
//async and await are used to handle asynchronous code in JavaScript
//request represent the request from the front-end and response is what is returned to the front-end from the back-end
postRoutes.route("/posts").get(async(request, response) => {
    let db = database.getDb()
    // db.collection("posts").find({}) is a method that retrieves all the data from the posts collection
    // mongoDB does not return the data directly as an array, it returns a cursor that we can use to iterate over the data
    let data = await db.collection("posts").find({}).toArray()
    if (data.length > 0) {
        // The express response.json() method sends a JSON response to the client as a return
        response.json(data)
    }else{
        // Stops the execution of the code and throws an error
        throw new Error("No data found")
    }
})

// #2 - Retrieve one
// In this case we will retrieve a single post by its id
postRoutes.route("/posts/:id").get(async(request, response) => {
    let db = database.getDb()
    // Instead of using find() we use findOne() to retrieve a single post
    // The id of the post is passed as a parameter in the URL, we have to make sura that we get the id from the request object
    // New ObjectId() is used to convert the string id into a mongoDB object id
    let data = await db.collection("posts").findOne({_id: new ObjectId(request.params.id)}).toArray()
    // Because we are retrieving a single post, instead of data.length, we use Object.keys, this method returns an array of a given object's own enumerable property names
    if (Object.keys(data).length > 0) {
        response.json(data)
    }else{
        throw new Error("No data found")
    }
})

// #3 -  Create one
// We use as base the previous route
// Different routes can have the same path, but different methods, we chage the method from .get() to .post()
postRoutes.route("/posts").post(async(request, response) => {
    let db = database.getDb()
    // mongoObject is an object that contains the data that we want to insert into the database
    let mongoObject = {
        title: request.body.title,
        description: request.body.description,
        content: request.body.content,
        author: request.body.author,
        dateCreated: request.body.dateCreated
    }
    // Replace finOne() with insertOne() to insert a new post
    let data = await db.collection("posts").insertOne(mongoObject)
    response.json(data)
})

// #4 - Update one
// .put() is a method that is used to update data in the server
postRoutes.route("/posts").put(async(request, response) => {
    let db = database.getDb()
    let mongoObject = {
        // We use $ set to specify the fields that we want to update
        $set: {
            // All the fields that we want to update are passed in the body of the request, thwy dont have to be all the fields, only the ones that we want to update the rest will remain the same
            title: request.body.title,
            description: request.body.description,
            content: request.body.content,
            author: request.body.author,
            dateCreated: request.body.dateCreated
        }
    }
    // Replace insertOne() with updateOne() to update a post
    let data = await db.collection("posts").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
    response.json(data)
})

// #5 - Delete one
// Similar structure to find one, but we use the .delete() method to delete a post 
postRoutes.route("/posts/:id").delete(async(request, response) => {
    let db = database.getDb()
    // deleteOne() is a method that is used to delete a single post
    let data = await db.collection("posts").deleteOne({_id: new ObjectId(request.params.id)}).toArray()
    response.json(data)
})

// Export the postRoutes object, this is the object that contains all the routes that we have created
module.exports = postRoutes