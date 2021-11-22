const Contact = require('../models/Contact')
class ContactController {
    //[GET] /contact
    contact(req, res) {
        res.render('contact/contact')
    }
    message(req, res){
        const contact=new Contact(req.body.data)
        contact.save()
        .then(()=>{
            res.json({
                success:1//thành công
            })
        })
        .catch((err)=>{
            res.send('lỗi')
        })
    }
}

module.exports = new ContactController()
