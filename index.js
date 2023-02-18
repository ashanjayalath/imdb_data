const port=process.env.PORT || 8000;
const express=require("express");
const axios = require("axios");
const cheerio = require("cheerio")
const {json} = require("express");
const app=express()
const url="https://www.imdb.com/chart/top/?ref_=nv_mv_250"
const url2="https://www.imdb.com/search/title/?genres=sci-fi&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=3396781f-d87f-4fac-8694-c56ce6f490fe&pf_rd_r=89EDCCTHF97ET0SZMV5R&pf_rd_s=center-1&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr1_i_2"
const movieList = []
const movieList2 = []

app.get('/',async (req,res)=> {
    const Author= "Welcome ashan jayalath free movie API"
    const Notice="This api is released for free and all the data here is provided by IMDB website.The data here is owned by IMDB."
    const _____________="See how to use this API."
    const use__________="Here you can get only 2 services"
    const ______Ex01_________="https://imdb-data.vercel.app/movies"
    const ______Ex02_________="https://imdb-data.vercel.app/sci-fi"
    res.send({Author,Notice,_____________,use__________,______Ex01_________,______Ex02_________})
});
app.get('/movies',async (req,res)=>{
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
app.get('/sci-fi',async (req,res)=>{
    axios.get(url2)
        .then((response)=>{
            const html=response.data
            const $=cheerio.load(html)
            $('.lister-list .lister-item-content',html).each((i,movie)=>{
                const id=i
                const title=$(movie).find(' h3 a').text()
                const movie_year=parseInt($(movie).find(' h3 span.lister-item-year').text().slice(1,5))
                const average_time_minute=parseFloat($(movie).find(' p span.runtime').text().slice(0,-4))
                const rating=parseFloat($(movie).find(' div div strong').text())
                const certificate=$(movie).find(' p.text-muted>span.certificate').text()
                const genre =$(movie).find(' p.text-muted>span.genre').text().trim().slice(1)
                $(movie).find(' p.text-muted>span').remove()
                const description=$(movie).find(' p.text-muted').text().trim()
                const vote_count=$(movie).find(' p.sort-num_votes-visible>span').text().trim().slice(6)
                movieList2.push({
                    id,
                    title,
                    movie_year,
                    certificate,
                    genre,
                    average_time_minute,
                    rating,
                    description,
                    vote_count
                })
            })
            res.json(movieList2)

        }).catch((e)=>console.log(e))

})

app.listen(port,()=>console.log(`Server Start on PORT ${port}`))