const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());



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
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
        res.status(200).json({ message: "OK" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
})

app.post("/products/add", (req, res) => {
    const { name, category, description, price } = req.body || {};

    if (!name || !category || !description || price === undefined) {
        return res.status(400).json({
            message: "Champs requis : name, category, description, price"
        });
    }

    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({ message: "price doit être un nombre positif" });
    }

    const newProduct = {
        id: nextId++,
        name,
        category,
        description,
        price
    };

    products.push(newProduct);
    res.status(201).json({ message: "Created", products: newProduct });
})



app.listen(port, () => {
  console.log(`Serveur en ligne sur http://localhost:${port}`);
});