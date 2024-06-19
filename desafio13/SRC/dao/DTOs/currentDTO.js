export default class currentDTO {
    constructor(user) {
        this.username = user.username ?? `${user.first_name}${user.last_name}`
        this.complete_name = user.complete_name ?? `${user.first_name} ${user.last_name}`
        this.email = user.email ?? `${user.username}@coder.com`
        this.role = user.role
    }
}