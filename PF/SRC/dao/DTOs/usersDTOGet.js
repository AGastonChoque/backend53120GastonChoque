export default class usersDTOGet {
    constructor(user) {
        this.complete_name = user.complete_name;
        this.email = user.email;
        this.role = user.role;
    }
}