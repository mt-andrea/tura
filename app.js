const express = require("express")
const livereload = require("livereload")
const connectLiveReload = require("connect-livereload")
const liveReloadServer = livereload.createServer()
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/")
    }, 100)
})
const mysql = require("mysql")
const app = express()
app.use(connectLiveReload())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs")
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'tura',
    dateStrings: true
})

app.get("/", function (req, res) {
    const q = "select * from lista"
    const q_="select sum(tav) from lista"
    let ossz
    pool.query(q_,function (error,result) {
        if (!error) {
            ossz=result[0]['sum(tav)']
        }
    })
    pool.query(q, function (error, results) {
        if (!error) {
            /*let ossz = 0
            results.forEach(element => {
                ossz += element.tav
            }); ez előbb jutott eszembe minthogy 2 queryt futtassak*/
            res.render("home", {
                title: "Túráim",
                content: "Eddig megtett távolság: ",
                items: results,
                ossz: ossz
            })
        }
    })
})
app.get("/delete/:id",function(req,res) {
    const q="delete from lista where id=?"
    pool.query(q,[req.params.id],function(error,results) {
        if (!error) {
            res.redirect("/")
        }
    })
})
app.get("/new",function (req,res) {
    res.render("new",{
        title:"Új túra",
        content:"Bejegyzés létrehozása: "
    })
})
app.post("/new",function (req,res) {
    const q="insert into lista (datum,hely,tav) values (?,?,?)"
    pool.query(q,[req.body.datum, req.body.hely,req.body.tav],function(error,results) {
        if (!error) {
            res.redirect("/")
        }
    })
})


app.listen(3000, function () {
    console.log("Server listen 3000...");
});