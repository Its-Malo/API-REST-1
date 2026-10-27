const express = require('express');
const Joi = require('joi');
const app = express();
const port = 3000;

app.use(express.json());

const productFields = {
    name: Joi.string().min(1).max(100).pattern(/\S/),
    category: Joi.string().min(1).max(50).pattern(/\S/),
    description: Joi.string().min(1).max(500).pattern(/\S/),
    price: Joi.number().min(0)
};

const productSchema = Joi.object(
    Object.fromEntries(
        Object.entries(productFields).map(([field, schema]) => [field, schema.required()])
    )
);
const productUpdateSchema = Joi.object(productFields).min(1);
const productIdSchema = Joi.number().integer().positive().max(Number.MAX_SAFE_INTEGER);

const validate = (schema, value, res, options = { convert: false }) => {
    const { error, value: validatedValue } = schema.validate(value, {
        ...options,
        abortEarly: false
    });

    if (error) {
        res.status(400).json({
            message: "Données invalides",
            details: error.details.map(({ path, message }) => ({
                field: path.join("."),
                message
            }))
        });
        return null;
    }

    return validatedValue;
};

const products = [
    {
        id: 1,
        name: "S 26",
        category: "Phone",
        description: "It's a smartphone",
        price: 1000
    },
    {
        id: 2,
        name: "iPhone 12",
        category: "Phone",
        description: "It's an iPhone",
        price: 1200
    },
    {
        id: 3,
        name: "iPad Pro",
        category: "Tablet",
        description: "It's an iPad",
        price: 800
    },
    {
        id: 4,
        name: "MacBook Air",
        category: "Laptop",
        description: "It's a MacBook",
        price: 1000
    },
    {
        id: 5,
        name: "Dell XPS",
        category: "Laptop",
        description: "It's a Dell laptop",
        price: 900
    }
]

app.get("/products", (req, res) => {
    res.json(products);
    res.status(200).json({ message: "OK" });
});

app.get("/products/:id", (req, res) => {
    const productId = validate(productIdSchema, req.params.id, res, { convert: true });
    if (productId === null) {
        return;
    }

    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
        res.status(200).json({ message: "OK" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
})

app.post("/products/add", (req, res) => {
    const productData = validate(productSchema, req.body, res);
    if (productData === null) {
        return;
    }

    const newProduct = {
        id: products.length + 1,
        ...productData
    };

    products.push(newProduct);
    res.status(201).json({ message: "Created", products: newProduct });
})

app.delete("/products/:id", (req, res) => {
    const productId = validate(productIdSchema, req.params.id, res, { convert: true });
    if (productId === null) {
        return;
    }

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

app.patch("/products/:id", (req, res) => {
    const productId = validate(productIdSchema, req.params.id, res, { convert: true });
    if (productId === null) {
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const updates = validate(productUpdateSchema, req.body, res);
    if (updates === null) {
        return;
    }

    Object.assign(product, updates);
    res.status(200).json({ message: "Product updated", product });
});

app.listen(port, () => {
    console.log(`Serveur en ligne sur http://localhost:${port}`);
});