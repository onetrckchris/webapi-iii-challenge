const router = require('express').Router();
const userData = require('./userDb');
const postData = require('../posts/postDb');

// Create a new user.
router.post('/', validateUser, (req, res) => {
    const user = req.body;

    userData.insert(user)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(500).json({ error: "Server error when posting user." }))
});

// Create a new post for specific user.
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const post = req.body;

    postData.insert(post)
        .then(post => res.status(201).json(post))
        .catch(error => res.status(500).json({ error: "Server error when posting post." }))
});

// Get all the users.
router.get('/', (req, res) => {
    userData.get()
        // Returning an array of all users.
        .then(users => res.status(200).json(users))
        .catch(error => res.status(500).json({ error: "Server error when getting user." }));
});

// Get a specific user.
router.get('/:id', (req, res) => {
    const id = req.params.id;

    userData.getById(id)
        .then(user => {
            if(user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "Cannot find user with that ID." });
            }
        })
        .catch(error => res.status(500).json({ error: "Server error when getting specific user." }));
});

// Get all posts for a user.
router.get('/:id/posts', (req, res) => {
    const userId = req.params.id;

    userData.getUserPosts(userId)
        .then(posts => {
            if(posts.length !== 0) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ error: "Could not find posts for this user." })
            }
        })
        .catch(error => res.status(500).json({ error: "Server error when getting posts." }))
});

// Delete specific user.
router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id;

    userData.remove(id)
        .then(id => res.status(202).json({ message: "Successfully deleted user!" }))
        .catch(error => res.status(500).json({ error: "Server error when deleting user. " }))
});

// Update specific user.
router.put('/:id', validateUserId, validateUser, (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    userData.update(id, changes)
        .then(id => res.status(202).json({ message: "User successfully updated." }))
        .catch(error => res.status(500).json({ error: "Server error when deleting user." }))
});

// ========== Custom Middleware ===========

function validateUserId(req, res, next) {
    const id = req.params.id;

    userData.getById(id)
        .then(user => {
            if(user) {
                next();
            } else {
                res.status(404).json({ error: "Cannot find user with that ID." });
            }
        })
};

function validateUser(req, res, next) {
    const user = req.body;

    if(user.name) {
        next();
    } else {
        res.status(400).json({ error: "User requires a name." });
    }
};

function validatePost(req, res, next) {
    const post = req.body;

    if(post.text && post.user_id) {
        next();
    } else {
        res.status(400).json({ error: "Post requres some text and a user ID." })
    }
};

module.exports = router;
