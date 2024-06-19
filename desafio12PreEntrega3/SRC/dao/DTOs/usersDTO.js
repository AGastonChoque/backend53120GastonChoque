export default class usersDTO {
    constructor(user) {
        this.username = user.username ?? `${user.first_name}${user.last_name}`
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.complete_name = user.complete_name ?? `${user.first_name} ${user.last_name}`
        this.email = user.email ?? `${user.username}@coder.com`
        this.age = user.age ?? ""
        this.password = user.password ?? ""
        this.role = user.role ?? "USER"
        this.cId = user.cId
    }
}