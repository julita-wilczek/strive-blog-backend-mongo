import express from "express"
import createError from "http-errors"
import PostModel from "./model.js"

const postsRouter = express.Router()

postsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body) 

    const { _id } = await newPost.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostModel.find()
    res.send(posts)
  } catch (error) {
    next(error)
  }
})

postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId)
    if (post) {
      res.send(post)
    } else {
      next(createError(404, `Post with id ${req.params.postId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

postsRouter.put("/:postId", async (req, res, next) => {
  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true, runValidators: true }
    )

    if (updatedPost) {
      res.send(updatedPost)
    } else {
      next(createError(404, `Post with id ${req.params.postId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

postsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.params.postId)
    if (deletedPost) {
      res.status(204).send()
    } else {
      next(createError(404, `Post with id ${req.params.postId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})



postsRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const newComment = {...req.body, date: new Date()}
    const commentedPost = await PostModel.findByIdAndUpdate(
    req.params.postId, 
    {$push: {comments: newComment}}, 
    {new: true, runValidators: true})
    if (commentedPost) {
      res.send(commentedPost)
    } else {
      next(createError(404, `Post with id ${req.params.postId} not found!`))
    }
  } catch(error) {
    next(error)
  }
  })

postsRouter.get("/:postId/comments", async (req, res, next) => {
try {
  const post = await PostModel.findById(req.params.postId)
  if (post) {
    res.send(post.comments)
  } else {
    next(createError(404, `Post with id ${req.params.postId} not found!`))
  }

} catch(error) {
  next(error)
}
})

postsRouter.get("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId)
    if (post) {
      const searchedComment = post.comments.find(comment => comment._id.toString() === req.params.commentId)
      if (searchedComment) {
        res.send(searchedComment)
      } else {
        next(createError(404, `Comment with id ${req.params.commentId} not found!`))
      }
    } else {
      next(createError(404, `Post with id ${req.params.postId} not found!`))
    }
  } catch(error) {
    next(error)
  }
  })


postsRouter.put("/:postId/comments/:commentId", async (req, res, next) => {
    try {
    const post = await PostModel.findById(req.params.postId)
    if (post) {
      const index = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId)
      if (index !== -1) {
        post.comments[index] = {...post.comments[index].toObject(), ...req.body}
        await post.save()
        res.send(post)

      } else {
        next(createError(404, `Comment with id ${req.params.commentId} not found!`))
      }

    } else {
      next(createError(404, `Post with id ${req.params.postId} not found!`))
    }
    } catch(error) {
      next(error)
    }
    })

    

postsRouter.delete("/:postId/comments/:commentId", async (req, res, next) => {
      try {
      const postToDelete = await PostModel.findByIdAndUpdate(
        req.params.postId,
        {$pull: {comments: {_id: req.params.commentId}}},
        {new: true}
      )
      if (postToDelete) {
        res.send(postToDelete)
      } else {
        next(createError(404, `Post with id ${req.params.postId} not found!`))
      }
      } catch(error) {
        next(error)
      }
      })

export default postsRouter



