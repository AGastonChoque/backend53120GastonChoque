import fs from "fs";

const path = "./SRC/FS/users.json";

export default class usersMemory {
    
    constructor() {
        this.fs = fs
        this.path = path
        this.fs.existsSync(path) ? this.users : this.fs.writeFileSync(path, "[]");
        this.users = JSON.parse(this.fs.readFileSync(this.path));
        this.currentId = this.users.reduce((max, user) => {
            return typeof user._id === 'number' && user._id > max ? user._id : max;
        }, 0);
    }

    async findUser(user) {
        let inUsersByUsername = this.users.find((data) => data.username === user.username)
        return inUsersByUsername ? inUsersByUsername : console.log("Not found");
    }

    async createUser(newUser) {
        this.currentId++
        const userNew = {
            _id: this.currentId,
            ...newUser
        }
        const allUsers = this.getUsers();
        allUsers.push(userNew);
        const users = JSON.stringify(allUsers, null, "\t");
        this.fs.writeFileSync(this.path, users);
        return (`El user "${userNew._id}" fue agregado correctamente`);
    }

    getUsers() {
        return this.users;
    }

    async findUserLean(user) {
        const foundUser = await this.users.find(
            (data) => data.username === user.username || data.email === user.email
          );
        
          if (!foundUser) {
            console.log("Not found");
            return null;
          }
        
          return foundUser;
    }

    async findById(id) {
        let inUsersById = this.users.find((data) => data._id === id)
        return inUsersById ? inUsersById : console.log("Not found");
    }
}