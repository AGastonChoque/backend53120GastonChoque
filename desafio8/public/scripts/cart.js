const socket = io();

cId = tBodyContainer.getAttribute("data-cid");

getCart(cId)

function getCart(cId) {
    socket.emit("getCart", cId);
}

function renderCart(cartData) {
    const tBodyContainer = document.getElementById("tBodyContainer");
    let productCard = "";
    cartData.products.forEach((prod) => {
        productCard += `
        <tr key=${prod.product._id}>
        <th scope="row"></th>
        <td>
            <a href="http://localhost:8080/products/${prod.product._id}">
                <img src="${prod.product.thumbnail}" alt="${prod.product.title}" width="50" />
            </a>
        </td>
        <td>${prod.product.title}</td>
        <td>${prod.quantity}</td>
        <td>$${prod.product.price}</td>
        <td>$${prod.product.price}</td>
        <td><button type="button" class="btn-close" aria-label="Close" onclick='deleteProductToCart("${cId}", "${prod.product._id}")'></button></td>
    </tr>
            `
    })

    tBodyContainer.innerHTML = productCard;
}

socket.on("cartRender", (cartData) => {
    renderCart(cartData);
});


function deleteProductToCart(cId, pId) {
    socket.emit("deleteProductToCart", cId, pId)
}

function clearCart(cId) {
    socket.emit("clearCart", cId)
}