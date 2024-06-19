
export default class tiketsDTO {
    constructor(user, purchasedProducts, amount) {

        this.code = this.generateUniqueCode()
        this.purchase_datetime = new Date().toISOString();
        this.amount = amount
        this.purchaser = user.email
        this.products = purchasedProducts.products
    }

    generateUniqueCode() {
        const randomString = Math.random().toString(36).substring(2, 10);
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace(/[-:]/g, "");
        const uniqueCode = `${randomString}-${formattedDate}`;
    
        return uniqueCode;
    }


}