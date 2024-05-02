const express = require('express');
const { Todo } = require('../mongo');
const router = express.Router();
const redis = require('../redis');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  await redis.getAsync('counter').then(async (counter) => {
    if (counter !== null) {
      const incrementedCounter = counter++;
      await redis.setAsync('counter', incrementedCounter);
    } else {
      await redis.setAsync('counter', 1);
    };

    console.log(await redis.getAsync('counter'));
  });

  res.send(todo);

  // await redis.setAsync('counter', 1);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  if (req.todo) res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  if (req.todo) {
    const updatedTodo = await Todo.findOneAndUpdate({ _id: req.todo._id }, req.body, { new: true });
    res.send(updatedTodo);
  };
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
