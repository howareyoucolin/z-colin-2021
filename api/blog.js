require('dotenv').config()
const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

/**
 * Get a list of all posts
 */
router.get( '/', (req, res) => {
    const dbClient = new MongoClient(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    dbClient.connect(err => {
        const dbo = dbClient.db(process.env.MONGO_DEFAULT_DB);

        ( async () => {
            let posts = await dbo.collection("blogs").find({}).sort({post_time:1}).toArray();
            dbClient.close();
            return posts;
        } )()
        .then( (posts) => {
            const response = {
                success: true,
                count: posts.length,
                results: posts
            }
            res.set('Content-Type', 'application/json')
            res.status(200).send( JSON.stringify(response) )
        } )
        .catch( (err) => {
            const response = {
                success: false,
                message: err.message,
                count: 0,
                results: null
            }
            res.set('Content-Type', 'application/json')
            res.status(200).send( JSON.stringify(response) )
        });
      
    });
} );

/**
 * Get a post by post id
 */
router.get( '/:postId', (req, res) => {

    let postId = null
    try{
        postId = new ObjectId(req.params.postId)
    }
    catch(err){
        const response = {
            success: false,
            message: 'Invalid post id.',
            result: null
        }
        res.set('Content-Type', 'application/json')
        res.status(200).send( JSON.stringify(response) )
        return false
    }
    
    const dbClient = new MongoClient(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    dbClient.connect(err => {
        const dbo = dbClient.db(process.env.MONGO_DEFAULT_DB);

        ( async () => {
            let post = await dbo.collection("blogs").findOne({_id:postId});
            dbClient.close();
            return post;
        } )()
        .then( (post) => {
            let response;
            if(post){
                response = {
                    success: true,
                    result: post
                }
            }
            else{
                response = {
                    success: false,
                    message: 'Non-existing post.',
                    result: post
                }
            }
            res.set('Content-Type', 'application/json')
            res.status(200).send( JSON.stringify(response) )
            return
        } )
        .catch( (err) => {
            const response = {
                success: false,
                message: err.message,
                result: null
            }
            res.set('Content-Type', 'application/json')
            res.status(200).send( JSON.stringify(response) )
        });
      
    });
} );

/**
 * Create a new post
 */
router.post( '/', (req, res) => {
    var requestBody = ''
    req.on('data', (chunk) => {
        requestBody += chunk;
    });
    req.on('end', () => {
        const dbClient = new MongoClient(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        dbClient.connect(err => {
            const dbo = dbClient.db(process.env.MONGO_DEFAULT_DB);

            ( async () => {
                let result = await dbo.collection("blogs").insertOne( JSON.parse(requestBody) )
                dbClient.close();
                return result
            } )()
            .then( (result) => {
                const {insertedCount, insertedId} = result
                const response = {
                    success: true,
                    count: insertedCount,
                    id: insertedId
                }
                res.set('Content-Type', 'application/json')
                res.status(200).send( JSON.stringify(response) )
                return
            } )
            .catch( (err) => {
                const response = {
                    success: false,
                    count: 0,
                    message: err.message
                }
                res.set('Content-Type', 'application/json')
                res.status(200).send( JSON.stringify(response) )
            });

        } )
    });
} )

/**
 * Update an existing post
 */
router.put( '/:postId', (req, res) => {

    let postId = null
    try{
        postId = new ObjectId(req.params.postId)
    }
    catch(err){
        const response = {
            success: false,
            message: 'Invalid post id.'
        }
        res.set('Content-Type', 'application/json')
        res.status(200).send( JSON.stringify(response) )
        return false
    }

    var requestBody = ''
    req.on('data', (chunk) => {
        requestBody += chunk;
    });
    req.on('end', () => {
        const dbClient = new MongoClient(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        dbClient.connect(err => {
            const dbo = dbClient.db(process.env.MONGO_DEFAULT_DB);

            ( async () => {
                let result = await dbo.collection("blogs").updateOne( {_id:postId} , {$set: JSON.parse(requestBody)} )
                dbClient.close();
                return result
            } )()
            .then( (result) => {
                const {matchedCount, modifiedCount} = result
                const response = {
                    success: true,
                    matchedCount: matchedCount,
                    modifiedCount: modifiedCount
                }
                res.set('Content-Type', 'application/json')
                res.status(200).send( JSON.stringify(response) )
                return
            } )
            .catch( (err) => {
                const response = {
                    success: false,
                    modifiedCount: 0,
                    message: err.message
                }
                res.set('Content-Type', 'application/json')
                res.status(200).send( JSON.stringify(response) )
            });

        } )
    });
} )

/**
 * Delete an existing post
 */
router.delete( '/:postId', (req, res) => {

    let postId = null
    try{
        postId = new ObjectId(req.params.postId)
    }
    catch(err){
        const response = {
            success: false,
            message: 'Invalid post id.'
        }
        res.set('Content-Type', 'application/json')
        res.status(200).send( JSON.stringify(response) )
        return false
    }

    const dbClient = new MongoClient(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    dbClient.connect(err => {
        const dbo = dbClient.db(process.env.MONGO_DEFAULT_DB);

        ( async () => {
            let result = await dbo.collection("blogs").deleteOne( {_id:postId} )
            dbClient.close();
            return result
        } )()
        .then( (result) => {
            const {deletedCount} = result
            const response = {
                success: true,
                deletedCount: deletedCount
            }
            res.set('Content-Type', 'application/json')
            res.status(200).send( JSON.stringify(response) )
            return
        } )
        .catch( (err) => {
            const response = {
                success: false,
                deletedCount: 0,
                message: err.message
            }
            res.set('Content-Type', 'application/json')
            res.status(200).send( JSON.stringify(response) )
        });

    } )
} )


module.exports = router