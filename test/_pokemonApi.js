const chai = require("chai");
const pokeData = require("../src/data");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { setupServer } = require("../src/server");
const app = setupServer();
chai.should();
/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */
const server = setupServer();
describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(server);
  });

  describe("GET /api/pokemon", () => {
    it("should return the full list of Pokemon", async () => {
      const res = await request.get("/api/pokemon/");
      JSON.parse(res.text).should.deep.equal(pokeData.pokemon);
    });
    it("should return first n Pokemon", async () => {
      const res = await request.get("/api/pokemon/?limit=10");
      JSON.parse(res.text).length.should.equal(10);
    });
    it("should return first Pokemon of the array", async () => {
      const res = await request.get("/api/pokemon/?limit=10");
      JSON.parse(res.text)[0].should.deep.equal(pokeData.pokemon[0]);
    });
  });

  describe("POST /api/pokemon", () => {
    it("should add a Pokemon to the array", async () => {
      const oldLength = pokeData.pokemon.length;
      const res = await request.post("/api/pokemon/?add=Nel");
      JSON.parse(res.text).length.should.equal(oldLength + 1);
    });
    it("should return first Pokemon of the array", async () => {
      const res = await request.post("/api/pokemon/?add=10");
      JSON.parse(res.text)[0].should.deep.equal(pokeData.pokemon[0]);
    });
  });

  describe("GET /api/pokemon/:id", () => {
    it("should return the Pokemon with the given id", async () => {
      const res = await request.get("/api/pokemon/042");
      JSON.parse(res.text).name.should.equal("Golbat");
    });
  });

  describe("GET /api/pokemon/:name", () => {
    it("should return the Pokemon with the given name", async () => {
      const res = await request.get("/api/pokemon/Golbat");
      JSON.parse(res.text).name.should.equal("Golbat");
    });
  });
});
