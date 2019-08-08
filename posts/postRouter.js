const router = require('express').Router();
const postData = require('./postDb');

// Get all posts.
router.get('/', (req, res) => {
    postData.get()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(500).json({ error: "Server serror when getting all posts." }))
});

router.get('/:id', validatePostId, (req, res) => {
    const id = req.params.id;

    postData.getById(id)
        .then(post => res.status(200).json(post))
        .catch(error => res.status(500).json({ error: "Server error when getting specific post." }))
});

router.delete('/:id', validatePostId, (req, res) => {
    const id = req.params.id;

    postData.remove(id)
        .then(id => res.status(202).json({ message: "Successfully deleted post." }))
        .catch(error => res.status(500).json({ error: "Server error when deleting post." }))
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    postData.update(id, changes)
        .then(post => res.status(202).json(post))
        .catch(error => res.status(500).json({ error: "Server error when updating post." }))
});

// Custom Middleware

function validatePostId(req, res, next) {
    const id = req.params.id;

    postData.getById(id)
        .then(post => {
            if(post) {
                next();
            } else {
                res.status(404).json({ error: "Cannot find post with that ID." })
            }
        })
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