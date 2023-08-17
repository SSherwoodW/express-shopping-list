const express = require("express");
const expressError = require("./expressError");
const router = new express.Router();
const items = require("./fakeDb");

router.get("", (req, res, next) => {
    try {
        return res.json({ items });
    } catch (err) {
        return next(err);
    }
});

router.post("/add", (req, res, next) => {
    try {
        const newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        return res.status(201).json({ added: newItem });
    } catch (err) {
        return next(err);
    }
});

router.get("/:name", (req, res, next) => {
    try {
        const foundItem = items.find((item) => item.name === req.params.name);
        if (foundItem === undefined) {
            throw new expressError("Item not found!", 404);
        } else {
            return res.json({ foundItem });
        }
    } catch (err) {
        return next(err);
    }
});

router.patch("/:name", (req, res, next) => {
    try {
        const foundItem = items.find((item) => item.name === req.params.name);
        if (foundItem === undefined) {
            throw new expressError("Item not found!", 404);
        } else {
            foundItem.name = req.body.name;
            foundItem.price = req.body.price;
            return res.json({
                Updated: {
                    foundItem,
                },
            });
        }
    } catch (err) {
        return next(err);
    }
});

router.delete("/:name", (req, res, next) => {
    try {
        let foundIndex = items.findIndex(
            (item) => item.name === req.params.name
        );
        if (foundIndex === -1) {
            throw new expressError("Item not found!", 404);
        } else {
            items.splice(foundIndex, 1);
            return res.json({ message: "Deleted" });
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
