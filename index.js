const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

let app = express()


let result = fs.readFileSync('neighborhoods_data.json')
let neighborhoods = JSON.parse(result)

// {
//     fieldName: "",
//     type: "",
//     amount: ""
// }

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/neighberhoods", (req, res) => {
    let queries = req.body.queries  
    console.log(queries)
   let filteredNeighberhoods =  neighborhoods.filter( (neighberhood) => {

        let trueQueries = []
        for (let i = 0; i < queries.length; i++) {
            let query = JSON.parse(queries[i]) 

            let queryFieldName = query.fieldName
            let fieldValue = neighberhood[queryFieldName]

            console.log(queryFieldName)
            if (query.type === "bigger than") {
                if (fieldValue > query.amount) {
                    trueQueries.push(true)
                }
            }
            else if (query.type === "smaller than" ) {
                if (fieldValue < query.amount) {
                    trueQueries.push(true)
                }
            }
            else if (query.type === "equal") {
                if (fieldValue === query.amount) {
                    trueQueries.push(true)
                }
            }
        }

        if (trueQueries.length == queries.length) {
            return true
        }
        return false
    })


    let ordersNeighberhoods = filteredNeighberhoods.sort( (neighberhood1,neighberhood2) => {
        let averageIncome1 = neighberhood1["average income"]
        let averageIncome2 = neighberhood2["average income"]        
        return  averageIncome2 - averageIncome1
    })

    res.json(filteredNeighberhoods)
})

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(3000)
