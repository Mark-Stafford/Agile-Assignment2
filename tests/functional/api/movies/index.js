import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import api from "../../../../index";
import User from "../../../../api/users/userModel";

const expect = chai.expect;
let db;
let user2token;

describe("Movies endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      await User.deleteMany();
      // Register two users
      await request(api).post("/api/users?action=register").send({
        username: "user1",
        password: "test1",
      });
      await request(api).post("/api/users?action=register").send({
        username: "user2",
        password: "test2",
      });
    } catch (err) {
      console.error(`failed to Load user test Data: ${err}`);
    }
    return request(api)
    .post("/api/users?action=authenticate")
    .send({
      username: "user2",
      password: "test2",

    })
    .expect(200)
    .then((res) => {
      expect(res.body.success).to.be.true;
      expect(res.body.token).to.not.be.undefined;
      user2token ="Bearer "+ res.body.token.substring(7); //assinging user2 a bearer token
      console.log(user2token)

  });

  });



    it("should return tmdb upcoming movies and a status 200", (done) => {
      request(api)
        .get("/api/movies/tmdb/upcoming")
        .set("Authorization", user2token )
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("object");
          //console.log(res.body)
          done();
        });
    });

    it("should return tmdb trending movies and a status 200", (done) => {
      request(api)
        .get("/api/movies/tmdb/trending")
        .set("Authorization", user2token )
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("object");
          //console.log(res.body)
          done();
        });
    });

  describe("GET /api/movies/tmdb/.., returns object", () => {
      it("should return tmdb discover movies and a status 200", (done) => {
        request(api)
          .get("/api/movies/tmdb/discover")
          .set("Authorization", user2token )
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.be.a("object");
            // console.log(res.body)
            done();
          });
      });

    it("should return tmdb the tv Shows and a status 200", (done) => {
      request(api)
        .get("/api/movies/tmdb/tvShows")
        .set("Authorization", user2token )
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("object");
          //console.log(res.body)
          done();
        });
    });

  });

  describe("GET /api/movies/tmdb/.., returns the genres", () => {

      it("should return tmdb the tv Show genres  and a status 200", (done) => {
        request(api)
          .get("/api/movies/tmdb/tvGenres")
          .set("Authorization", user2token )
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.be.a("object");
            //console.log(res.body)
            done();
          });
      });

      it("should return tmdb movies genres  and a status 200", (done) => {
        request(api)
          .get("/api/movies/tmdb/movieGenres")
          .set("Authorization", user2token )
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.be.a("object");
            done();
          });
      });

    });

  afterEach(() => {
    api.close(); // Release PORT 8080
  });
});