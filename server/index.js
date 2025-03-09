import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import { config } from 'dotenv'
config()

import dbConnection from './config/connection.js'
import studentRouter from './routes/student.js'
import hostelRouter from './routes/hostel.js'
import parentRouter from './routes/parent.js'

const app = express()

app.use(logger('dev'));
app.use(express.json())
app.use(cors())

app.use('/', studentRouter)
app.use('/hostel', hostelRouter)
app.use('/parent', parentRouter)

app.use(dbConnection)

app.listen(4000, () => {
    console.log(`Server is running on 4000`);
})