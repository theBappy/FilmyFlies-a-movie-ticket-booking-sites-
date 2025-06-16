import express from 'express'
import { getFavorites, getUserBookings, updateFavorite } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/bookings', getUserBookings)
userRouter.post('/update-favorite', updateFavorite)
userRouter.get('/favorites', getFavorites)

export default userRouter