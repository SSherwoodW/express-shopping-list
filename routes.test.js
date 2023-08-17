process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");
const expressError = require("./expressError");

let testProduct = { name: "test", price: 3.55 };

beforeEach(function () {
    items.push(testProduct);
});

afterEach(function () {
    // make sure this **mutates**, not redefines, 'users'
    items = [];
});

/** GET /items - returns `{items: [item, ...]}` */

describe("GET /items", () => {
    test("Gets a list of items", async function () {
        const response = await request(app).get(`/items`);
        const { items } = response.body;
        expect(response.statusCode).toBe(200);
        expect(items).toHaveLength(1);
    });
});
// end

/**GET /items/[name of item]  - returns data about item */
describe("GET /items/:name", () => {
    test("Gets a single item", async function () {
        const response = await request(app).get(`/items/${testProduct.name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.foundItem).toEqual(testProduct);
    });

    test("Responds with 404 if can't find item", async function () {
        const response = await request(app).get(`/items/0`);
        expect(response.statusCode).toBe(404);
    });
});
// end

/** POST /items - create item from data, return {added: item} */
describe("POST /items/add", () => {
    test("Creates a new item", async function () {
        const response = await request(app).post(`/items/add`).send({
            name: "fish",
            price: 1.5,
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.added).toHaveProperty("name");
        expect(response.body.added).toHaveProperty("price");
        expect(response.body.added.name).toEqual("fish");
        expect(response.body.added.price).toEqual(1.5);
    });
});
// end

describe("PATCH /items/:name", () => {
    test("Updates an item", async function () {
        const response = await request(app)
            .patch(`/items/${testProduct.name}`)
            .send({
                name: "updatedProduct",
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            Updated: { foundItem: { name: "updatedProduct" } },
        });
    });
});

/** DELETE /items/[name] - delete item,
 *  return `{message: "item deleted"}` */

describe("DELETE /items/:name", () => {
    test("Deletes a single a item", async function () {
        const response = await request(app).delete(
            `/items/${testProduct.name}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Deleted" });
    });
});
// end
