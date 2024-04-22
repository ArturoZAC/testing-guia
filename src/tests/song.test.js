require('../models')
const request = require('supertest')
const app = require('../app')
const Album = require('../models/Album')
const Artist = require('../models/Artist')
const Genre = require('../models/Genre')

const URL_BASE = '/api/v1/songs'

let song
let album
let songId

beforeAll(async()=>{
    album = await Album.create({
        name: "mi primer album",
        image: "random32",
        releaseYear: 2010
    })

    song = {
        name: "Selfless",
        albumId: album.id
    }
})


test("POST -> URL_BASE, should return status code 201, res.body.name === song.name", async () =>{
    const res = await request(app)
        .post(URL_BASE)
        .send(song)

        songId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(song.name)
})

test("GET ALL -> URL_BASE, should return statud code 200, res.body.length === 1", async()=>{
    const res = await request(app)
        .get(URL_BASE)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("GET ONE -> URL_BASE/songId, should return status code 200", async()=>{
    const res = await request(app)
        .get(`${URL_BASE}/${songId}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(song.name)
})

test("UPDATE -> URL_BASE/songId, should return status code 200, res.body.name === updateBody.name", async()=>{

    const updateBody ={
        name: "SOYGOZU"
    }

    const res = await request(app)
        .put(`${URL_BASE}/${songId}`)
        .send(updateBody)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(updateBody.name)
})

test("POST -> URL_BASE/:id/artists, should return statusCode 200 and res.body.length === 1", async()=>{

    const artist = {
         name: "Arturo",
         country: "Peru",
         formationYear: "2009",
         image: "sxz.com"
    }

    const createArtist = await Artist.create(artist)

    const res = await request(app)
        .post(`${URL_BASE}/${songId}/artists`)
        .send([createArtist.id])

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    await createArtist.destroy()
})

test("POST -> URL_BASE/:id/genres, should return statusCode 200, and res.body.length === 1", async()=>{
    const genre = {
        name: "pop"
    }

    const createGenre = await Genre.create(genre)

    const res = await request(app)
        .post(`${URL_BASE}/${songId}/genres`)
        .send([createGenre.id])

        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body).toHaveLength(1)

    await createGenre.destroy()
})



test("DELETE -> URL_BASE/songId, should return status code 204", async()=>{
    const res = await request(app)
        .delete(`${URL_BASE}/${songId}`)

    expect(res.statusCode).toBe(204)

    await album.destroy()
})