const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();

function logger(req, res, next) {
    console.log("Request method: ", req.method);
    console.log("Request url: ", req.url);
    console.log(Date.now());

    next();
};

server.use(express.json());
server.use(logger);
server.use('/users', userRouter);
server.use('/posts', postRouter);

const port = 8000;
server.listen(port, console.log(`Server is running on ${port}.`))