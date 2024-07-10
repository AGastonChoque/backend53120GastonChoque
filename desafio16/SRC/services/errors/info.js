export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name : needs to be a String, received ${user.first_name}
    * last_name  : needs to be a String, received ${user.last_name}
    * email      : needs to be a String, received ${user.email}`;
}

export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title: ${product.title}
    * description: ${product.description}
    * price: ${product.price}
    * code: ${product.code}
    * stock: ${product.stock}
    * category: ${product.category}`;
}

export const generateProductCodeErrorInfo = (product) => {
    return `Code product already exist:
    * El code: ${product.code} ya fue cargado previamente`;
}