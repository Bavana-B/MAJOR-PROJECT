const express=require('express');
const app=express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions = { secret : "mysupersecretstring", resave: false , saveUninitialized: true};

// app.use(cookieParser("secretcode"));
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    // console.log(req.session);
    req.session.name=name;
    if(name === "anonymous"){
        req.flash("error","user not registered!")
    }else{
        req.flash("success","user registered successfully!")
    }
    // console.log(req.session.name);
    // res.send(name);
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    // res.locals.successMsg = req.flash("success");
    // res.locals.errorMsg = req.flash("error");
    res.render("page.ejs",{name: req.session.name});
})

// app.get("/reqcount",(req,res)=>{
//     if (req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test",(req,res)=>{
//     res.send("Test Successful!");
// })

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("Signed cookie sent");
// });

// app.get("/verify",(req,res)=>{
    
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","Namaste");
//     res.cookie("MadeIn","India");
//     res.send("Sent you Some cookies!!");
// });

// app.get("/greet",(req,res)=>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi,${name}!`);
// });

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi,I am Root!");
// });

// app.use("/users",users);
// app.use("/posts",users);

// //Index - Users
// app.get("/users",(req,res)=>{
//     res.send("GET for users");
// })

// //Show - Users
// app.get("/users/:id",(req,res)=>{
//     res.send("GET for user id");
// })

// //POST - Users
// app.post("/users",(req,res)=>{
//     res.send("POST for users");
// })

// //DELETE - Users
// app.delete("/users/:id",(req,res)=>{
//     res.send("DELETE for user id");
// })

// //Posts //Index
// //Index - Users
// app.get("/posts",(req,res)=>{
//     res.send("GET for posts");
// })

// //Show 
// app.get("/posts/:id",(req,res)=>{
//     res.send("GET for posts id");
// })

// //POST 
// app.post("/posts",(req,res)=>{
//     res.send("POST for posts");
// })

// //DELETE 
// app.delete("/posts/:id",(req,res)=>{
//     res.send("DELETE for posts id");
// })

app.listen(3000,()=>{
    console.log("Server is listening to 3000");
});