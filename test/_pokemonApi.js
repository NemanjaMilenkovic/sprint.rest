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
  describe("PATCH /api/pokemon/:idOrName", () => {
    it("should allow modifications", async () => {
      const res = await request.patch("/api/pokemon/Golbat/?update=maxCP,1478");
      JSON.parse(res.text).maxCP.should.equal("1478");
    });
  });
  describe("DELETE /api/pokemon/:idOrName", () => {
    it("should remove a Pokemon from the array", async () => {
      const oldLength = pokeData.pokemon.length;
      const res = await request.delete("/api/pokemon/Golbat/?remove=Golbat");
      JSON.parse(res.text).length.should.equal(oldLength - 1);
    });
  });
  describe("GET /api/pokemon/:idOrName/evolutions", () => {
    it("should return the evolutions a Pokemon has", async () => {
      const bulbasaurEvo = [
        {
          id: 2,
          name: "Ivysaur",
        },
        {
          id: 3,
          name: "Venusaur",
        },
      ];
      const res = await request.get("/api/pokemon/Bulbasaur/evolutions");
      JSON.parse(res.text).should.deep.equal(bulbasaurEvo);
    });
    it("should return an empty array if Pokemon doesn't have evolutions", async () => {
      const res = await request.get("/api/pokemon/Venusaur/evolutions");
      JSON.parse(res.text).should.deep.equal([]);
    });
  });
  describe("GET /api/pokemon/:idOrName/evolutions/previous", () => {
    it("should return the previous evolutions a Pokemon has", async () => {
      const venusaurPreEvo = [
        {
          id: 1,
          name: "Bulbasaur",
        },
        {
          id: 2,
          name: "Ivysaur",
        },
      ];
      const res = await request.get(
        "/api/pokemon/Venusaur/evolutions/previous"
      );
      JSON.parse(res.text).should.deep.equal(venusaurPreEvo);
    });
    it("should return an empty array if Pokemon doesn't have evolutions", async () => {
      const res = await request.get(
        "/api/pokemon/Bulbasaur/evolutions/previous"
      );
      JSON.parse(res.text).should.deep.equal([]);
    });
  });
  describe("GET /api/types", () => {
    it("should return a full list of available types", async () => {
      const res = await request.get("/api/types");
      JSON.parse(res.text).should.deep.equal(pokeData.types);
    });
    it("should take a query parameter limit=n", async () => {
      const res = await request.get("/api/types?limit=2");
      JSON.parse(res.text).length.should.equal(2);
    });
  });
  describe("POST /api/types", () => {
    it("should add a type", async () => {
      const oldLength = pokeData.types.length;
      const res = await request.post("/api/types/?add=Iron");
      JSON.parse(res.text).length.should.equal(oldLength + 1);
    });
  });
  describe("DELETE /api/types/:name", () => {
    it("should delete a given type", async () => {
      const oldLength = pokeData.types.length;
      const res = await request.delete("/api/types/Bug");
      JSON.parse(res.text).length.should.equal(oldLength - 1);
    });
    it("should return the array if the type is not found", async () => {
      const res = await request.delete("/api/types/Bug");
      JSON.parse(res.text).should.deep.equal(pokeData.types);
    });
  });
  describe("GET /api/types/:type/pokemon", () => {
    it("should return all Pokemon of a given type", async () => {
      const firePoke = [];
      for (const poke of pokeData.pokemon) {
        if (poke.types.includes("Fire")) {
          firePoke.push({ name: poke.name, id: poke.id });
        }
      }
      const res = await request.get("/api/types/Fire/pokemon");
      JSON.parse(res.text).should.deep.equal(firePoke);
    });
  });
  describe("GET /api/attacks", () => {
    it("should return a full list of available attacks", async () => {
      const res = await request.get("/api/attacks");
      JSON.parse(res.text).should.deep.equal(pokeData.attacks);
    });
    it("should take a query parameter limit=n", async () => {
      const res = await request.get("/api/types?limit=2");
      JSON.parse(res.text).length.should.equal(2);
    });
  });
});
