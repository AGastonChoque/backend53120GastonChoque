const socket = io();

cId = tBodyContainer.getAttribute("data-cid");

getCart(cId)

function getCart(cId) {
    socket.emit("getCart", cId);
}

function renderCart(cartData) {
    const tBodyContainer = document.getElementById("tBodyContainer");
    let productCard = "";
    let accu = 0
    cartData.products.forEach((prod) => {
        const subt = parseFloat(prod.product.price)*prod.quantity
        accu++
        productCard += `
        <tr key=${prod.product._id}>
        <th scope="row">${accu}</th>
        <td>
            <a href="https://backend53120gastonchoque.onrender.com/products/${prod.product._id}">
                <img src="${prod.product.thumbnail}" alt="${prod.product.title}" width="50" />
            </a>
        </td>
        <td>${prod.product.title}</td>
        <td>${prod.quantity}</td>
        <td>$${prod.product.price}</td>
        <td>$${subt}</td>
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

function buyCart(cId, userEmail, useRole) {
    socket.emit("buyCart", cId, userEmail, useRole)
}

socket.on("toPurchase", (data) => {
    const { url } = data;
    window.location.href = url;
  });