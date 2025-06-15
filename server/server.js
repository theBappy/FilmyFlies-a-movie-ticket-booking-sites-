import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()

const PORT = process.env.PORT || 3000

// middlewares
app.use(express.json())
app.use(cors())


// api routes
app.get('/', (req,res) =>{
    res.send('Hello World')
})

app.listen(PORT, ()=> console.log(`Server is listening at http://localhost:${PORT}`))