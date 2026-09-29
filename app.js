const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World !');
});

app.listen(port, () => {
  console.log(`Serveur en ligne sur http://localhost:${port}`);
});

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
    const newProduct = req.body;
    newProduct.id = products.length + 1;
    newProduct.name = req.body.name;
    newProduct.category = req.body.category;
    newProduct.description = req.body.description;
    newProduct.price = req.body.price;
    products.push(newProduct);
    res.status(201).json({ message: "Created", product: newProduct });
})