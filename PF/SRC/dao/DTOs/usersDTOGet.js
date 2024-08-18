export default class usersDTOGet {
    constructor(user) {
        this._id = user._id
        this.complete_name = user.complete_name;
        this.email = user.email;
        this.role = user.role;
        this.last_connection = user.last_connection
    }
}