if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
console.log(process.env.secret)

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret:"mysupersecretcode", 
    resave:false, 
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);


main().then(()=>{
    console.log('Connected to DB');
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');

  }

app.listen(3000,()=>{
    console.log('Server is Listening to Port 3000');
});



// //Index Route
// app.get("/listings",wrapAsync(async (req,res)=>{
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs",{ allListings});
// }));

// //New Route
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs")
// })

// //Show Route
// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing= await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing});
// }))

// //Create Route
// app.post('/listings',validateListing,wrapAsync(async (req,res,next)=>{
   
//     //let {title,description,image,price,country,location}=req.body;
//     // let listing=req.body.listing;
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     // console.log(listing);
//     res.redirect("/listings");
// }));

// //Edit Route
// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing= await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing})
// }));

// //Update Route
// app.put("/listings/:id",validateListing, wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }));

// //Delete Route
// app.delete("/listings/:id",wrapAsync(async (req,res)=>{
//     let{id}= req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));


//Reviews
//Post Review Route
// app.post("/listings/:id/reviews", validateReview,wrapAsync(async(req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     // console.log("New Review Saved");
//     // res.send("New Review Saved");

//     res.redirect(`/listings/${listing._id}`);
// }));

// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
//     let {id,reviewId}= req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }));

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calanguate,Goa",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful Testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something Went wrong!"}= err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

// app.get('/',(req,res)=>{
//     res.send('Hi I am Root');
// });