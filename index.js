const port=process.env.PORT || 8000;
const express=require("express");
const axios = require("axios");
const cheerio = require("cheerio")
const {json} = require("express");
const app=express()
const url="https://www.imdb.com"
const movieList = []
const movie_Genres=[
    {name:"movies", link:"https://www.imdb.com/chart/top/?ref_=nv_mp_mv250"},
    {name:"comedy", link:"https://www.imdb.com/search/title/?genres=comedy&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=3396781f-d87f-4fac-8694-c56ce6f490fe&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-1&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr1_i_1"},
    {name:"sci_fi", link:"https://www.imdb.com/search/title/?genres=sci-fi&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=3396781f-d87f-4fac-8694-c56ce6f490fe&pf_rd_r=1VJMH1KEW0JNCYF5SEB4&pf_rd_s=center-1&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr1_i_2"},
    {name:"horror", link:"https://www.imdb.com/search/title/?genres=horror&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=3396781f-d87f-4fac-8694-c56ce6f490fe&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-1&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr1_i_3"},
    {name:"romance", link:"https://www.imdb.com/search/title/?genres=romance&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e0da8c98-35e8-4ebd-8e86-e7d39c92730c&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-2&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr2_i_1"},
    {name:"action", link:"https://www.imdb.com/search/title/?genres=action&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e0da8c98-35e8-4ebd-8e86-e7d39c92730c&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-2&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr2_i_2"},
    {name:"thriller", link:"https://www.imdb.com/search/title/?genres=thriller&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e0da8c98-35e8-4ebd-8e86-e7d39c92730c&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-2&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr2_i_3"},
    {name:"drama", link:"https://www.imdb.com/search/title/?genres=drama&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=f1cf7b98-03fb-4a83-95f3-d833fdba0471&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-3&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr3_i_1"},
    {name:"mystery", link:"https://www.imdb.com/search/title/?genres=mystery&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=f1cf7b98-03fb-4a83-95f3-d833fdba0471&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-3&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr3_i_2"},
    {name:"crime", link:"https://www.imdb.com/search/title/?genres=crime&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=f1cf7b98-03fb-4a83-95f3-d833fdba0471&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-3&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr3_i_3"},
    {name:"animation", link:"https://www.imdb.com/search/title/?genres=animation&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=fd0c0dd4-de47-4168-baa8-239e02fd9ee7&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-4&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr4_i_1"},
    {name:"adventure", link:"https://www.imdb.com/search/title/?genres=adventure&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=fd0c0dd4-de47-4168-baa8-239e02fd9ee7&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-4&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr4_i_2"},
    {name:"fantasy", link:"https://www.imdb.com/search/title/?genres=fantasy&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=fd0c0dd4-de47-4168-baa8-239e02fd9ee7&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-4&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr4_i_3"},
    {name:"commedy_romance", link:"https://www.imdb.com/search/title/?genres=comedy,romance&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=a581b14c-5a82-4e29-9cf8-54f909ced9e1&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-5&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr5_i_1"},
    {name:"action_commedy", link:"https://www.imdb.com/search/title/?genres=action,comedy&explore=title_type,genres&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=a581b14c-5a82-4e29-9cf8-54f909ced9e1&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-5&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr5_i_2"},
    {name:"super_hero", link:"https://www.imdb.com/search/keyword?keywords=superhero&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=a581b14c-5a82-4e29-9cf8-54f909ced9e1&pf_rd_r=Z5WFPWAYRBCFP0XWW8T7&pf_rd_s=center-5&pf_rd_t=15051&pf_rd_i=genre&ref_=ft_gnr_pr5_i_3"}
]


app.get('/',async (req,res)=> {
    const Author= "Welcome ashan jayalath free movie API"
    const Notice="This api is released for free and all the data here is provided by IMDB website.The data here is owned by IMDB."
    const _____________="See how to use this API."
    const use__________="Here you can get only 2 services"
    const ______Ex01_________="https://imdb-data.vercel.app/movies"
    const ______Ex02_________="https://imdb-data.vercel.app/genres/comedy"
    const ______Ex03_________="https://imdb-data.vercel.app/genres/sci_fi"
    const ______Ex04_________="https://imdb-data.vercel.app/genres/horror"
    const ______Ex05_________="https://imdb-data.vercel.app/genres/romance"
    const ______Ex06_________="https://imdb-data.vercel.app/genres/action"
    const ______Ex07_________="https://imdb-data.vercel.app/genres/thriller"
    const ______Ex08_________="https://imdb-data.vercel.app/genres/drama"
    const ______Ex09_________="https://imdb-data.vercel.app/genres/mystery"
    const ______Ex10_________="https://imdb-data.vercel.app/genres/crime"
    const ______Ex11_________="https://imdb-data.vercel.app/genres/animation"
    const ______Ex12_________="https://imdb-data.vercel.app/genres/adventure"
    const ______Ex13_________="https://imdb-data.vercel.app/genres/fantasy"
    const ______Ex14_________="https://imdb-data.vercel.app/genres/commedy_romance"
    const ______Ex15_________="https://imdb-data.vercel.app/genres/action_commedy"
    const ______Ex16_________="https://imdb-data.vercel.app/genres/super_hero"
    const doc={
        Author,
        Notice,
        _____________,
        ______Ex01_________,______Ex02_________,______Ex03_________,______Ex04_________,______Ex05_________,______Ex06_________,
        ______Ex07_________,______Ex08_________,______Ex09_________,______Ex10_________,______Ex11_________,______Ex12_________,
        ______Ex13_________,______Ex14_________,______Ex15_________,______Ex16_________
    }
    res.send(doc)
});
app.get('/movies',async (req,res)=>{
    movieList.length=0
    axios.get(movie_Genres[0].link)
        .then((response)=>{
            const html=response.data
            const $=cheerio.load(html)
            $('.lister-list>tr',html).each((i,movie)=>{
                const image=$(movie).find('.posterColumn img').attr("src")
                const title=$(movie).find('.titleColumn a').text()
                const all_details=url+$(movie).find('.titleColumn a').attr("href")
                const movie_year=parseInt($(movie).find('.titleColumn span').text().slice(1,5))
                const rating=parseFloat($(movie).find('.ratingColumn strong').text())
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
app.get('/genres/:category',async (req,res)=>{
    movieList.length=0
    const category = req.params.category
    const match_url=movie_Genres.filter(item => item.name === category )[0].link
    axios.get(match_url)
        .then((response)=>{
            const html=response.data
            const $=cheerio.load(html)
            $('.lister-list .lister-item-content',html).each((i,movie)=>{
                const id=i
                const title=$(movie).find(' h3 a').text()
                const link=url+$(movie).find(' h3 a').attr('href')
                const movie_year=parseInt($(movie).find(' h3 span.lister-item-year').text().slice(1,5))
                const average_time_minute=parseFloat($(movie).find(' p span.runtime').text().slice(0,-4))
                const rating=parseFloat($(movie).find(' div div strong').text())
                const certificate=$(movie).find(' p.text-muted>span.certificate').text()
                const genre =$(movie).find(' p.text-muted>span.genre').text().trim()
                $(movie).find(' p.text-muted>span').remove()
                const description=$(movie).find(' p.text-muted').text().trim()
                const vote_count=$(movie).find(' p.sort-num_votes-visible>span').text().trim().slice(6)
                movieList.push({
                    id,
                    title,
                    link,
                    movie_year,
                    certificate,
                    genre,
                    average_time_minute,
                    rating,
                    description,
                    vote_count
                })
            })
            res.json(movieList)

        }).catch((e)=>console.log(e))

})

app.listen(port,()=>console.log(`Server Start on PORT ${port}`))