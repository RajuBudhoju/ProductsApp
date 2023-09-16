document.addEventListener('DOMContentLoaded', function () {
    // Get references to the HTML elements
    const contactForm = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');
    const totalWorth = document.getElementById('productsId');
    const proIdInput = document.getElementById('proId');
    const amountInput = document.getElementById('amountid');
    let products = [];
    let total = 0;

    // Function to fetch products from the API and initialize the product list
    function fetchProducts() {
        axios.get("https://crudcrud.com/api/10d37a3a0cc24a8fafc67d6253f4760b/products")
            .then((response) => {
                // Filter out products that are marked as deleted
                products = response.data.filter(product => !product.isDeleted);
                renderProductList();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Function to add a new product
    function addProduct(price, name) {
        const product = { price: parseFloat(price), name };
        products.push(product);
        total += product.price;
        return product;
    }

    // Function to render the product list
    function renderProductList() {
        contactList.innerHTML = '';
        products.forEach((product, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${product.name}: $${product.price.toFixed(2)}
                <button class="delete-button" data-index="${index}">Delete</button>
            `;
            contactList.appendChild(listItem);
        });
        totalWorth.textContent = `Total Worth of Products: $${total.toFixed(2)}`;
    }

    // Event listener for the form submission
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const price = amountInput.value;
        const name = proIdInput.value;

        if (price && name) {
            const product = addProduct(price, name);

            // Save the new product to the API
            axios.post("https://crudcrud.com/api/10d37a3a0cc24a8fafc67d6253f4760b/products", product)
                .then((response) => {
                    // Refresh the product list after adding
                    fetchProducts();

                    // Clear input fields
                    amountInput.value = '';
                    proIdInput.value = '';
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });

    // Event listener for delete buttons
    contactList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-button')) {
            const index = e.target.getAttribute('data-index');
            if (index !== null) {
                const deletedProduct = products[index];

                // Mark the product as deleted in the API
                axios.put(`https://crudcrud.com/api/10d37a3a0cc24a8fafc67d6253f4760b/products/${deletedProduct.id}`, { isDeleted: true })
                    .then((response) => {
                        // Product successfully marked as deleted in the API
                        // Refresh the product list after marking as deleted
                        fetchProducts();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    });

    // Initialize the product list
    fetchProducts();
});
