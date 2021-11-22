const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://nqkiax:123qweasdzxc4rfv@posts.n3mgo.mongodb.net/shop_helmet_dev?retryWrites=true&w=majority', {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('Connect successfully!!!')
    }
    catch (error) {
        console.log('Connect failure!!!')
    }
}

module.exports = { connect }
