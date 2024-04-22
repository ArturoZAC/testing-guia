require('../models')
const request = require("supertest");
const app = require("../app");
const Genre = require('../models/Genre');

const URL_BASE = '/api/v1/artists'
const artist = {
    name: "Julian",
    country: "Colombia",
    formationYear: 2010,
    image: "randomtext"
}

let artistId

test("POST -> URL_BASE, should return status code 201, res.body.name === artist.name", async () => {
    const res = await request(app)
        .post(URL_BASE)
        .send(artist)

    artistId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(artist.name)
})

test("GET ALL -> URL_BASE, should return status code 200,res.body.lentgh === 1", async() =>{
    const res = await request(app)
        .get(URL_BASE)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("GET ONE -> URL_BASE, should return status code 200, res.body.name === artist.name", async()=>{
    const res = await request(app)
        .get(`${URL_BASE}/${artistId}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(artist.name)
})

test("UPDATE -> URL_BASE/artistId, should return status code 200, res.body.name === updateBody.name", async () =>{

    const bodyUpdate = {
        name: "PepitoGod"
    }

    const res = await request(app)
        .put(`${URL_BASE}/${artistId}`)
        .send(bodyUpdate)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(bodyUpdate.name)
})

test("POST -> URL_BASE/:id/genres, should return statusCode 200 and res.body.length === 1 ", async()=>{
    const createGenre = await Genre.create({name: "Pop"})

    const res = await request(app)
        .post(`${URL_BASE}/${artistId}/genres`)
        .send([createGenre.id])

    // console.log(res.body)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    await createGenre.destroy()
})



test("DELETE -> URL_BASE/artistId, should return status code 204", async()=>{
    const res = await request(app)
        .delete(`${URL_BASE}/${artistId}`)
    
    expect(res.statusCode).toBe(204)
})