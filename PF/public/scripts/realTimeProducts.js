const socket = io();

const userDataElement = document.getElementById('userData');
const userEmail = userDataElement.getAttribute('data-user-email');
const userRole = userDataElement.getAttribute('data-user-role');

getProducts()

function getProducts() {
    socket.emit("getProducts");
}

function renderProducts(productsData) {
    const productsContainer = document.getElementById("productsContainer");
    let productCard = "";
    productsData.forEach((product) => {
        productCard += `
            <div class="card m-2" style="width: 18rem;">
                <a id="thumbnails" href=${product.thumbnail}><img src=${product.thumbnail} height="250" class="card-img-top rounded p-1"
                        alt=${product.title}></a>
                <div class="card-body">
                    <h5 id="price" class="card-title">$${product.price}</h5>
                    <p id="title" class="card-text text-secondary">${product.title}</p>
                    <a class="btn btn-outline-danger" onclick="deleteProductById('${product._id}', '${userEmail}', '${userRole}')">Delete</a>
                </div>
            </div>
            `
    })

    productsContainer.innerHTML = productCard;
}

socket.on("productsRender", (productsData) => {
    renderProducts(productsData.docs);
});

const form = document.getElementById('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let title = document.getElementById('formTitle').value;
    let description = document.getElementById('formDescription').value;
    let price = document.getElementById('formPrice').value;
    let code = document.getElementById('formCode').value;
    let stock = document.getElementById('formStock').value;
    let category = document.getElementById('formCategory').value;
    let thumbnail = document.getElementById('formThumbnails').value;

    let product = {
        title: title,
        description: description,
        price: price,
        code: code,
        stock: stock,
        category: category,
        thumbnail: thumbnail
    };

    socket.emit("addProduct", product, userEmail, userRole)

    document.getElementById('formTitle').value = "";
    document.getElementById('formDescription').value = "";
    document.getElementById('formPrice').value = "";
    document.getElementById('formCode').value = "";
    document.getElementById('formStock').value = "";
    document.getElementById('formCategory').value = "";
    document.getElementById('formThumbnails').value = "";

});

function deleteProductById(pId, userEmail, userRole) {
    socket.emit("deleteProduct", pId, userEmail, userRole);
}