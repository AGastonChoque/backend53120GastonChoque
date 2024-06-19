const socket = io();

function handleAddToCart(pId) {
    socket.emit("addProductToCart", pId)
}