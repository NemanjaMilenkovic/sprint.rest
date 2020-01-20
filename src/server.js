/* eslint-disable no-prototype-builtins */
const pokeData = require("./data");
const express = require("express");

// console.log("---------->", pokeData.attacks);
/**
 * Create, set up and return your express server, split things into separate files if it becomes too long!
 */

const setupServer = () => {
  const pokemon = pokeData.pokemon;
  const app = express();
  app.use(express.json());

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
    let returnPoke;
    const idOrName = req.params;
    const update = req.query.update;
    const remove = req.query.remove;

    if (idOrName !== undefined && update !== undefined) {
      const updateName = update.split(",")[0];
      const updateValue = update.split(",")[1];
      getPoke(idOrName);

      if (returnPoke.hasOwnProperty(updateName)) {
        returnPoke[updateName] = updateValue;
      }
    } else if (idOrName !== undefined && remove !== undefined) {
      removePoke(idOrName);
      res.send(pokemon);
      return;
    } else {
      getPoke(idOrName);
    }

    function removePoke(idOrName) {
      getPoke(idOrName);
      console.log("pokemon.length :", pokemon.length);
      pokemon.splice(pokemon.indexOf(returnPoke), 1);
      console.log("pokemon.length :", pokemon.length);
    }

    function getPoke(idOrName) {
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
    }
    res.send(returnPoke);
  });

  return app;
};

module.exports = { setupServer };
