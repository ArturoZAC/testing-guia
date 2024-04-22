require('../models')
const request = require('supertest')
const app = require('../app')

const URL_BASE = '/api/v1/albums'
const album = {
    name: "God",
    image: "arte.com",
    releaseYear: 2011,
    // artirstId: 1
}

let albumId

test("POST -> URL_BASE, should return statusCode 201, res.body.name === album.name", async () =>{
    const res = await request(app)
        .post(URL_BASE)
        .send(album)

        albumId = res.body.id

        expect(res.statusCode).toBe(201)
        expect(res.body).toBeDefined()
        expect(res.body.name).toBe(album.name)
})

test("GET ALL -> URL_BASE, should return statusCode 200, res.body.length === 1", async()=>{
    const res = await request(app)
        .get(URL_BASE)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("GET ONE -> URL_BASE/albumId, should return statusCode 200", async()=>{
    const res = await request(app)
        .get(`${URL_BASE}/${albumId}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(album.name)
})

test("UPDATE -> URL_BASE/albumId, should return statusCode 200, res.body.name === bodyUpdate.name", async() =>{
    const bodyUpdate ={
        name: "OKEY"
    }

    const res = await request(app)
        .put(`${URL_BASE}/${albumId}`)
        .send(bodyUpdate)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(bodyUpdate.name)

})

test("DELETE -> URL_BASE/albumId, should return statusCode 204", async()=>{
    const res = await request(app)
        .delete(`${URL_BASE}/${albumId}`)

    expect(res.statusCode).toBe(204)
})