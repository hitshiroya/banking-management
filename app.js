const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const alert = require('alert');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static('public'));


let flag = 0;

// ----------------Mongoose-----------------

mongoose.connect('mongodb+srv://admin-sujal:suryashekhar@cluster0.ftquu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/tsf',
 {useNewUrlParser:true, useFindAndModify:true}
 ).then(() => console.warn('db connection done'))

const usersSchema = {
    name : String,
    email : String,
    balance : Number,
    accountNo : Number
}

const User = mongoose.model('User', usersSchema);

const user1 = new User({
    name: "Hit Shiroya",
    email: "hitp123@gmail.com",
    balance: 100000,
    accountNo: 12015951
})

const user2 = new User({
    name: "Pal Pujara",
    email: "palji@gmail.com",
    balance: 100000,
    accountNo: 12015952
})

const user3 = new User({
    name: "Shn panchasara",
    email: "sonu@gmail.com",
    balance: 100000,
    accountNo: 12015953
})

const user4 = new User({
    name: "Samarth Kariya",
    email: "sam@gmail.com",
    balance: 100000,
    accountNo: 12015954
})

const user5 = new User({
    name: "Yesha Makwana",
    email: "yesh@gmail.com",
    balance: 100000,
    accountNo: 12015955
})

const user6 = new User({
    name: "Neel Sanghvi",
    email: "simplicity@gmail.com",
    balance: 100000,
    accountNo: 12015956
})

const userArray = [user1, user2, user3, user4, user5, user6];


// -------x--------Mongoose-------x---------



// ------------------Date-----------------

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
let day = today.toLocaleDateString("en-US", options);

// ---------x--------Date-------x---------



const history = [];
let amount = 0;


app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
})

app.get('/get-started', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {
                if(err) console.log(err);
            })
        } else {
            res.render('get-started', {
                balance : foundUsers[0].balance
            })
        }
    } )
    
})

app.get('/add', (req, res) => {
    User.find({}, (err, foundUsers) => {
        res.render('add', {
            balance: foundUsers[0].balance
        })
    })
})



app.get('/transaction', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            res.render('transaction', {
                users : foundUsers,
                balance : foundUsers[0].balance 
            })
        }
    } )

})

app.get('/members', (req, res) => {

    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })

            res.redirect('/members');
        } else {

            res.render('members', {
                users : foundUsers,
                balance : foundUsers[0].balance 
            })
        }
    } )

})

app.post('/get-started', (req, res) => {

    amount = Number(req.body.amount);

    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            
            if(amount > foundUsers[0].balance) {
                alert('failed')
                res.redirect('/transaction');
            }

            else {
                foundUsers[0].balance -= amount;

                foundUsers[0].save();

            User.findById(req.body.select, (err, found) => {
                found.balance += amount;
                found.save();
                console.log(found.balance)
                history.push({
                    sender : foundUsers[0].name,
                    receiver : found.name,
                    amount : amount,
                    date : day
                })
            })

            alert('successful')
            res.render('get-started', {
                balance : foundUsers[0].balance
            })
            }

        }
    } )

  
})

app.post('/members', (req, res) => {
  
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {

            let newuser = new User({
                name : req.body.name,
                email : req.body.email,
                balance : Number(req.body.balance),
                accountNo : Number(req.body.account)
            })

            foundUsers[0].balance += Number(req.body.money);
            foundUsers[0].save();

           newuser.save();

           res.redirect('/members');

        }
    } )

})

app.get('/add-money', (req, res) => {
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            res.render('add-money', {
                history : history,
                balance : foundUsers[0].balance 
            })
        }
    } )
})

app.get('/transaction-history', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            res.render('history', {
                history : history,
                balance : foundUsers[0].balance 
            })
        }
    } )

})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
