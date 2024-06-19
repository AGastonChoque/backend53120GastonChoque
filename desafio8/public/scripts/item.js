const socket = io();

function handleAddToCart(cId, pId) {
    socket.emit("addProductToCart", cId, pId)
}