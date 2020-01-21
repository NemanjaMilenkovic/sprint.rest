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
  app.use(express.urlencoded({ extended: true }));

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
      const allAttacks = attacks.fast.concat(attacks.special);
      res.send(allAttacks.slice(0, limit));
    }
  });

  app.get("/api/attacks/fast", (req, res) => {
    const limit = req.query.limit;
    if (limit === undefined) {
      res.send(attacks.fast);
    } else {
      res.send(attacks.fast.slice(0, limit));
    }
  });

  app.get("/api/attacks/special", (req, res) => {
    const limit = req.query.limit;
    if (limit === undefined) {
      res.send(attacks.special);
    } else {
      res.send(attacks.special.slice(0, limit));
    }
  });

  app.get("/api/attacks/:name", (req, res) => {
    let name = req.params;
    name =
      name.name.charAt(0).toUpperCase() + name.name.substring(1).toLowerCase();
    const allAttacks = attacks.fast.concat(attacks.special);
    const att = allAttacks.filter((poke) => {
      return poke.name === name;
    });
    res.send(att[0]);
  });

  app.get("/api/attacks/:name/pokemon", (req, res) => {
    let name = req.params;
    name =
      name.name.charAt(0).toUpperCase() + name.name.substring(1).toLowerCase();
    const pokeByAttack = pokemon
      .filter((poke) => {
        const loopThroughAttacks = () => {
          for (const attack of poke.attacks.fast) {
            if (attack.name === name) return true;
          }
          for (const attack of poke.attacks.special) {
            if (attack.name === name) return true;
          }
          return false;
        };
        return loopThroughAttacks();
      })
      .map((poke) => ({ name: poke.name, id: poke.id }));
    res.send(pokeByAttack);
  });
  app.post("/api/attacks/fast", (req, res) => {
    const add = req.body;
    attacks.fast.push(add);
    res.send(add);
  });
  app.post("/api/attacks/special", (req, res) => {
    const add = req.body;
    attacks.special.push(add);
    res.send(add);
  });
  app.patch("/api/attacks/:name", (req, res) => {
    const update = req.body;
    let modifiedAttack;
    let name = req.params;
    name =
      name.name.charAt(0).toUpperCase() + name.name.substring(1).toLowerCase();
    for (let attack of attacks.fast) {
      if (attack.name === name) {
        attack = update;
        modifiedAttack = attack;
      }
    }
    for (let attack of attacks.special) {
      if (attack.name === name) {
        attack = update;
        modifiedAttack = attack;
      }
    }
    res.send(modifiedAttack);
  });

  app.delete("/api/attacks/:name", (req, res) => {
    let name = req.params;
    name =
      name.name.charAt(0).toUpperCase() + name.name.substring(1).toLowerCase();
    for (const attack of attacks.fast) {
      if (attack.name === name) {
        attacks.fast.splice(attacks.fast.indexOf(attack), 1);
      }
    }
    for (const attack of attacks.special) {
      if (attack.name === name) {
        attacks.special.splice(attacks.special.indexOf(attack), 1);
      }
    }
    const allAttacks = attacks.fast.concat(attacks.special);
    res.send(allAttacks);
  });

  return app;
};

module.exports = { setupServer };
