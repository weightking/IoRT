const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost/IoRT',{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{console.log('database connection')})
    .catch(()=>{console.log('database connection fail')})