const socket = io();

purchaserEmail = tBodyContainer.getAttribute("data-purchaser");

getTiket(purchaserEmail)

function getTiket(purchaserEmail) {
    socket.emit("getTiket", purchaserEmail);
}

function renderTiket(tiketData) {
    const tBodyContainer = document.getElementById("tBodyContainer");
    let accu = 0
    let productTiket = "";
    tiketData.products.forEach((prod) => {
        const subt = parseFloat(prod.product.price)*prod.quantity
        accu++
        productTiket += `
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
    </tr>
            `
    })

    tBodyContainer.innerHTML = productTiket;
}

socket.on("tiketRender", (tiketData) => {
    renderTiket(tiketData);
});

