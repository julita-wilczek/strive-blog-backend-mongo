import express from "express"
import createError from "http-errors"
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware.js"
import { generateAccessToken } from "../../auth/tools.js"
import AuthorsModel from "./model.js"

const authorsRouter = express.Router()

authorsRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body)
    const { _id } = await newAuthor.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/login", async (req, res, next) => {
  try {
    const {email, password} = req.body
    const author = await AuthorsModel.checkCredentials(email, password)
    if (author) {
      const accessToken = await generateAccessToken({_id: author._id, role: author.role})
      res.send({ accessToken })
    } else {
      next(createError(401, `Wrong credentials`))
    }
  
  } catch (error) {
    next(error)
  }
})


authorsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
      const authors = await AuthorsModel.find()
      res.send(authors)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
      const author = await AuthorsModel.findById(req.params.id)
      if (author) {
      res.send(author)
    } else {
        next(createError(404, `Author of id ${req.params.id} not found`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
      const updatedAuthor = await AuthorsModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          {new: true, runValidators: true}
      )
      if (updatedAuthor) {
          res.send(updatedAuthor)
      } else {
        next(createError(404, `Author of id ${req.params.id} not found`))
      }
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
      const deletedAuthor = await AuthorsModel.findByIdAndDelete(req.params.id)
      if (deletedAuthor) {
          res.status(204).send()
      } else {
          next(createError(404, `Author with id ${req.params.id} not found` ))
      }
  } catch (error) {
    next(error)
  }
})

export default authorsRouter
  
  
  
  
  
  
  
  