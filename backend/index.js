const axios = require("axios")
const express = require("express")
const cors = require("cors")
const { config } = require("dotenv")

const app = express()
config({path : "./config/config.env"})

app.use(cors({
    origin : [process.env.FRONTEND_URL],
    methods : ["GET"],
    credentials : true
}))

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.get("/convert", async (req , res) => {

    const { base_currency, currencies } = req.query

    try {
        const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.API_KEY}&base_currency=${base_currency}&currencies=${currencies}`

        console.log(base_currency, currencies)        
        console.log("Request send");
        
        const response = await axios.get(url)
        console.log("Request get");
        console.log(response.data)        

        res.json(response.data)
        
    } catch (error) {
        console.log("someting went wrong during getting currency", error.message, error.response?.data)
        res.status(500).json({
            success : false,
            message : "error fetching data"
        })
    }
})

const port = process.env.PORT || 4000

app.listen( port, () => {
    console.log(`Server is running at ${port}`)
})