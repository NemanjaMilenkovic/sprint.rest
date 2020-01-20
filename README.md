# sprint.rest
### This was created during my time as a [Code Chrysalis](https://codechrysalis.io) Student

It's time to get more used to express while writing RESTful API endpoints.
In this sprint you will create an API to easily access and manipulate data from Pokemon.

## Objectives

- Be able to setup a RESTful CRUD API using `express`
- Get more comfortable working with multiple files
- Learn a new library (`chai-http`) to help you with testing `express` endpoints
- Re-inforce the importance of TDD by forcing you to write your own tests

## Getting Started

Look at `package.json` and get a feel for how this repository is set up.
Look around the different files, get an understanding for how data flows between them and where you will mainly be working.
While there is a minimum skeleton laid out here, setting up the `express` server (and maybe organizing your routes) is all up to you.
`underscore` is already added to this repository, so feel free to use it, of course you can also use a different library if you want.

## Basic Requirements

**Important**: There is no need to modify the source `.json` files. Do any modifications to the object/array directly. This does mean that changes are lost upon restart of the server, but the focus today is on getting familiar with `express` and RESTful design.

Write tests and implement the following endpoints:

- `GET /api/pokemon`
  - It should return the full list of Pokemon
  - It is able to take a query parameter `limit=n` that makes the endpoint only return the first `n` Pokemon
- `POST /api/pokemon`
  - It should add a Pokemon. For Basic Requirements, verification that the data is good is not necessary
- `GET /api/pokemon/:id`
  - It should return the Pokemon with the given id. Example: `GET /api/pokemon/042` should return the data for Golbat
  - Leading zeroes should not be necessary, so `GET /api/pokemon/42` would also return Golbat
- `GET /api/pokemon/:name`
  - It should return the Pokemon with given name. Example: `GET /api/pokemon/Mew` should return the data for Mew
  - The name should be case-insensitive
  - Hint: You might want to try handling this one and the last one in the same route.
- `PATCH /api/pokemon/:idOrName`
  - It should allow you to make partial modifications to a Pokemon
- `DELETE /api/pokemon/:idOrName`
  - It should delete the given Pokemon
- `GET /api/pokemon/:idOrName/evolutions`
  - It should return the evolutions a Pokemon has.
    - Note that some Pokemon don't have evolutions, it should return an empty array in this case
    - Example: `GET /api/pokemon/staryu/evolutions` should return `[ { "id": 121, "name": "Starmie" } ]`
- `GET /api/pokemon/:idOrName/evolutions/previous`
  - For evolved Pokemon, this should return it's previous evolutions
  - Example: `GET /api/pokemon/17/evolutions/previous` should return `[ { "id": 16, "name": "Pidgey" } ]`
- `GET /api/types`
  - It should return a list of all available types
  - It is able to take a query parameter `limit=n` that makes the endpoint only return `n` types
- `POST /api/types`
  - Adds a Type
- `DELETE /api/types/:name`
  - Deletes the given type
- `GET /api/types/:type/pokemon`
  - It should return all Pokemon that are of a given type
    - You only need to return `id` and `name` of the Pokemon, not the whole data for the Pokemon
- `GET /api/attacks`
  - It should return all attacks
  - It is able to take a query parameter `limit=n` that makes the endpoint only return `n` attacks
- `GET /api/attacks/fast`
  - It should return fast attacks
  - It is able to take a query parameter `limit=n` that makes the endpoint only return `n` attacks
- `GET /api/attacks/special`
  - It should return special attacks
  - It is able to take a query parameter `limit=n` that makes the endpoint only return `n` attacks
- `GET /api/attacks/:name`
  - Get a specific attack by name, no matter if it is fast or special
- `GET /api/attacks/:name/pokemon`
  - Returns all Pokemon (`id` and `name`) that have an attack with the given name
- `POST /api/attacks/fast` or `POST /api/attacks/special`
  - Add an attack
- `PATCH /api/attacks/:name`
  - Modifies specified attack
- `DELETE /api/attacks/:name`
  - Deletes an attack

## Medium Requirements

- Add proper validation of data for all operations.
- Add pagination to your collection endpoints `GET /api/pokemon` `GET /api/types` `GET /api/attacks` `GET /api/attacks/fast` `GET /api/attacks/special`
  - You will need additional query parameters so your client can page through a collection correctly

## Advanced Requirements

Make all endpoints ending in `/pokemon` truly RESTful, by properly nesting the Pokemon resource
Example: `GET /api/attacks/:attackName/pokemon/:idOrName/evolutions` should also work, including proper verification of the parameters, because obviously if a Pokemon id or name was given that does not have the attack, then a 404 should be thrown.

## Nightmare Mode

Add a database, put your Pokemon data in it and use that to retrieve and store changes.
