const express = require("express");
const cron = require("node-cron");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { error } = require("console");
const expenseEmail = require("./EmailService/Expense");

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION).then(()=>{
    console.log("DB connection is successfull")
}).catch((err) =>{
    console.log(err)
});

const schedule = () =>{
    cron.schedule('* * * * *', () => {
       expenseEmail()
      });
}

schedule();
app.listen(process.env.PORT,() =>{
    console.log(`Server is running on port ${process.env.PORT}`)
})