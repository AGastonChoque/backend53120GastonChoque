export default class usersDTOGet {
    constructor(user) {
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
    }
}