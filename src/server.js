/* eslint-disable no-prototype-builtins */
const pokeData = require("./data");
const express = require("express");

/**
 * Create, set up and return your express server, split things into separate files if it becomes too long!
 */

const setupServer = () => {
  const pokemon = pokeData.pokemon;
  const types = pokeData.types;
  const attacks = pokeData.attacks;
  const app = express();
  app.use(express.json());

  function getPoke(idOrName) {
    let returnPoke;
    if (parseInt(idOrName.idOrName)) {
      if (pokemon[parseInt(idOrName.idOrName) - 1]) {
        returnPoke = pokemon[parseInt(idOrName.idOrName) - 1];
      }
    } else {
      idOrName = idOrName.idOrName.toLowerCase();
      for (const poke of pokemon) {
        if (poke.name.toLowerCase() === idOrName) {
          returnPoke = poke;
        }
      }
    }
    return returnPoke;
  }

  app.get("/api/pokemon/", (req, res) => {
    const limit = req.query.limit;
    if (limit === undefined) {
      res.send(pokemon);
      return;
    }
    res.send(pokemon.slice(0, limit));
  });

  app.post("/api/pokemon/", (req, res) => {
    const add = req.query.add;
    const newPokemon = pokeData.newPoke[0];
    newPokemon.id =
      parseInt(pokeData.pokemon[pokeData.pokemon.length - 1].id) + 1;
    if (add !== undefined) {
      newPokemon.name = add;
      pokemon.push(newPokemon);
    }
    res.send(pokemon);
  });

  app.get("/api/pokemon/:idOrName/", (req, res) => {
    const idOrName = req.params;
    res.send(getPoke(idOrName));
  });

  app.patch("/api/pokemon/:idOrName/", (req, res) => {
    let returnPoke;
    const idOrName = req.params;
    const update = req.query.update;

    if (idOrName !== undefined && update !== undefined) {
      const updateName = update.split(",")[0];
      const updateValue = update.split(",")[1];
      returnPoke = getPoke(idOrName);

      if (returnPoke.hasOwnProperty(updateName)) {
        returnPoke[updateName] = updateValue;
      }
    } else {
      returnPoke = getPoke(idOrName);
    }

    res.send(returnPoke);
  });

  app.delete("/api/pokemon/:idOrName/", (req, res) => {
    let returnPoke;
    const idOrName = req.params;
    const remove = req.query.remove;

    if (idOrName !== undefined && remove !== undefined) {
      removePoke(idOrName);
    }
    function removePoke(idOrName) {
      returnPoke = getPoke(idOrName);
      pokemon.splice(pokemon.indexOf(returnPoke), 1);
    }
    res.send(pokemon);
  });

  app.get("/api/pokemon/:idOrName/evolutions", (req, res) => {
    const idOrName = req.params;
    const returnPoke = getPoke(idOrName);
    if (!returnPoke.evolutions) {
      res.send([]);
    } else {
      res.send(returnPoke.evolutions);
    }
  });

  app.get("/api/pokemon/:idOrName/evolutions/previous", (req, res) => {
    const idOrName = req.params;
    const returnPoke = getPoke(idOrName);
    if (!returnPoke["Previous evolution(s)"]) {
      res.send([]);
    } else {
      res.send(returnPoke["Previous evolution(s)"]);
    }
  });

  app.get("/api/types", (req, res) => {
    const limit = req.query.limit;
    if (limit === undefined) {
      res.send(types);
    } else {
      res.send(types.slice(0, limit));
    }
  });

  app.post("/api/types", (req, res) => {
    let add = req.query.add;
    add = add.charAt(0).toUpperCase() + add.substring(1).toLowerCase();
    types.push(add);
    res.send(types);
  });

  app.delete("/api/types/:name", (req, res) => {
    let name = req.params;
    name =
      name.name.charAt(0).toUpperCase() + name.name.substring(1).toLowerCase();
    const indexOfName = types.indexOf(name);
    if (indexOfName >= 0) {
      types.splice(indexOfName, 1);
    }
    res.send(types);
  });

  app.get("/api/types/:type/pokemon", (req, res) => {
    let type = req.params;
    type =
      type.type.charAt(0).toUpperCase() + type.type.substring(1).toLowerCase();
    const pokeByType = pokemon
      .filter((poke) => {
        return poke.types.includes(type);
      })
      .map((poke) => ({ name: poke.name, id: poke.id }));

    res.send(pokeByType);
  });

  app.get("/api/attacks", (req, res) => {
    const limit = req.query.limit;
    if (limit === undefined) {
      res.send(attacks);
    } else {
      res.send(attacks.slice(0, limit));
    }
  });

  return app;
};

module.exports = { setupServer };
