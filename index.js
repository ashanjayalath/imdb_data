const port=process.env.PORT || 8000;
const express=require("express");
const axios = require("axios");
const cheerio = require("cheerio")
const app=express()
const url="https://www.imdb.com/chart/top/?ref_=nv_mv_250"
const url2="https://www.imdb.com/search/title/?genres=sci-fi&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=3396781f-d87f-4fac-8694-c56ce6f490fe&pf_rd_r=89EDCCTHF97ET0SZMV5R&pf_rd_s=center-1&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr1_i_2"
const movieList = []
const movieList2 = []


app.get('/',(req,res)=> {
    res.send("Welcome my first API")
});

app.get('/movies',(req,res)=>{
    axios.get(url)
        .then((response)=>{
            const html=response.data
            const $=cheerio.load(html)
            $('.lister-list>tr',html).each((i,movie)=>{
                const image=$(movie).find('.posterColumn img').attr("src")
                const title=$(movie).find('.titleColumn a').text()
                const all_details="https://www.imdb.com"+$(movie).find('.titleColumn a').attr("href")
                const movie_year=$(movie).find('.titleColumn span').text()
                const rating=$(movie).find('.ratingColumn strong').text()
                movieList.push({
                    title,
                    image,
                    movie_year,
                    all_details,
                    rating
                })
            })
            res.json(movieList)

    }).catch((e)=>console.log(e))

})
app.get('/sci-fi',(req,res)=>{
    axios.get(url2)
        .then((response)=>{
            const html=response.data
            const $=cheerio.load(html)
            $('.lister-list>div',html).each((i,movie)=>{
                const id=i
                const title=$(movie).find('.lister-item-content h3 a').text()
                const movie_year=$(movie).find('.lister-item-content h3 span.lister-item-year').text()
                const average_time=$(movie).find('.lister-item-content p span.runtime').text()
                const rating=$(movie).find('.lister-item-content div div strong').text()
                const description=$(movie).find('.lister-item-content p.text-muted').text()
                const vote_count=$(movie).find('.lister-item-content p.sort-num_votes-visible>span').text()
                movieList2.push({
                    id,
                    title,
                    movie_year,
                    average_time,
                    rating,
                    description,
                    vote_count
                })
            })
            res.json(movieList2)

        }).catch((e)=>console.log(e))

})
app.listen(port,()=>console.log(`Server Start on PORT ${port}`))