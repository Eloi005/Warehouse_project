document.addEventListener("DOMContentLoaded", function() {
    const productList = document.getElementById('product-list');
    const adminPanel = document.getElementById('admin-panel');
    const adminButton = document.getElementById('admin-button');
    const productForm = document.getElementById('product-form');
    const adminProductList = document.getElementById('admin-product-list');
    const cancelButton = document.getElementById('cancel-button');

    let products = JSON.parse(localStorage.getItem('products')) || [];

    function renderProducts() {
        productList.innerHTML = '';
        adminProductList.innerHTML = '';

        products.forEach((product, index) => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';

            const productImage = document.createElement('img');
            productImage.src = product.image;
            productItem.appendChild(productImage);

            const productTitle = document.createElement('div');
            productTitle.className = 'product-title';
            productTitle.innerText = product.title;
            productItem.appendChild(productTitle);

            const productPrice = document.createElement('div');
            productPrice.className = 'product-price';
            productPrice.innerText = `Price: ${product.price}`;
            productItem.appendChild(productPrice);
          
            const productQuantity = document.createElement('div');
            productQuantity.className = 'product-quantity';
            productQuantity.innerText = `Quantity: ${product.quantity}`;
            productItem.appendChild(productQuantity);

            const productActions = document.createElement('div');
            productActions.className = 'product-actions';

            const editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.onclick = () => {
                editProduct(index);
            };
            productActions.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.onclick = () => {
                deleteProduct(index);
            };
            productActions.appendChild(deleteButton);

            productItem.appendChild(productActions);
            productList.appendChild(productItem);

            const adminProductItem = productItem.cloneNode(true);
            adminProductItem.querySelector('.product-actions').remove();

            const adminProductActions = document.createElement('div');
            adminProductActions.className = 'product-actions';

            const adminEditButton = document.createElement('button');
            adminEditButton.innerText = 'Edit';
            adminEditButton.onclick = () => {
                editProduct(index);
            };
            adminProductActions.appendChild(adminEditButton);

            const adminDeleteButton = document.createElement('button');
            adminDeleteButton.innerText = 'Delete';
            adminDeleteButton.onclick = () => {
                deleteProduct(index);
            };
            adminProductActions.appendChild(adminDeleteButton);

            adminProductItem.appendChild(adminProductActions);
            adminProductList.appendChild(adminProductItem);
        });
    }

    function saveProducts() {
        localStorage.setItem('products', JSON.stringify(products));
    }

    function deleteProduct(index) {
        products.splice(index, 1);
        saveProducts();
        renderProducts();
    }

    function editProduct(index) {
        const product = products[index];
        document.getElementById('product-id').value = index;
        document.getElementById('product-title').value = product.title;
        document.getElementById('product-image').value = '';
              document.getElementById('product-price').value = product.price;
        document.getElementById('product-quantity').value = product.quantity;
        adminPanel.style.display = 'block';
    }

    productForm.onsubmit = function(event) {
        event.preventDefault();
        const id = document.getElementById('product-id').value;
        const title = document.getElementById('product-title').value;
        const imageInput = document.getElementById('product-image');
        const price = parseInt(document.getElementById('product-price').value);
        const quantity = parseInt(document.getElementById('product-quantity').value);

        if (id !== '') {
            // Update existing product
            products[id].title = title;
            products[id].price = price;
            products[id].quantity = quantity;
            
            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    products[id].image = e.target.result;
                    saveProducts();
                    renderProducts();
                    productForm.reset();
                    adminPanel.style.display = 'none';
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                saveProducts();
                renderProducts();
                productForm.reset();
                adminPanel.style.display = 'none';
            }
        } else {
            // Create new product
            const reader = new FileReader();
            reader.onload = function(e) {
                const image = e.target.result;
                products.push({ title, image, price, quantity });
                saveProducts();
                renderProducts();
                productForm.reset();
                adminPanel.style.display = 'none';
            };
            reader.readAsDataURL(imageInput.files[0]);
        }
    };

    adminButton.onclick = function() {
        adminPanel.style.display = 'block';
    };

    cancelButton.onclick = function() {
        productForm.reset();
        adminPanel.style.display = 'none';
    };

    renderProducts();
});
