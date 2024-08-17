const socket = io();


function handleAddToCart(cId, pId, userEmail) {
    socket.emit("addProductToCart", cId, pId, userEmail)
}