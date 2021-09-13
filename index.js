const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://admin:1234@boiler-plate.7s3oa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//버전 이슈인지 아래 코드 못찾음. 검색해보니 6버전? 이후 
/*,{       useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true, 
        useFindAndModify: false,
}*/).then(() => console.log('MongoDB Connected.')).catch( err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!~ 안녕하세요!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})