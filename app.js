const express = require('express')
const app = express()
const {createPool} = require('mysql')
var bodyParser = require('body-parser')

const pool = createPool({
    host : "localhost",
    user : "root",
    password : "",
    database : "dblab",
    connectionLimit : 10,
    port : 3307
})


app.use(bodyParser.json())




app.get('/api/v1/longest-duration-movies',(req,res) => {

    pool.query(`select tconst, primaryTitle, runtimeMinutes, genres from movies order by runtimeMinutes DESC LIMIT 10 `, (err, result, fields) => {
        if(err){
            return console.log(err)
        }
        return res.send(result)
    })
})

app.post('/api/v1/new-movie',(req,res) => {
    const {tconst, titleType,primaryTitle,runtimeMinutes, genres} = req.body;

    pool.query(`insert into movies(tconst,titleType,primaryTitle,runtimeMinutes,genres) values('${tconst}','${titleType}','${primaryTitle}',${runtimeMinutes},'${genres}')`, (err, result, fields) => {
        if(err){
            return console.log(err)
        }
        return res.status(200).json({message:'Success'})
    })
    
})

app.get('/api/v1/top-rated-movies',(req,res) => {

    pool.query(`select r.tconst, m.primaryTitle, m.genres, r.averageRating from ratings as r, movies as m where averageRating>=6.0 and r.tconst=m.tconst`, (err, result, fields) => {
        if(err){
            return console.log(err)
        }
        return res.send(result)
    })
})

app.get('/api/v1/genre-movies-with-subtotals',(req,res) => {

    pool.query(`select movies.genres, sum(ratings.numVotes) as total from movies, ratings where movies.tconst=ratings.tconst group by movies.genres order by genres asc`, (err, result, fields) => {
        if(err){
            return console.log(err)
        }
        return res.send(result)
    })
})

app.post('/api/v1/update-runtime-minutes',(req,res) => {

    pool.query(`update movies set runtimeMinutes = ( case genres when 'Documentary' then runtimeMinutes+15 when 'Animation' then runtimeMinutes+30 else runtimeMinutes+45 end )`, (err, result, fields) => {
        if(err){
            return console.log(err)
        }
        return res.status(200).json({message:'Success'})
    })
})



app.listen(3000,() => {
    console.log('Connected to port 3000');
})