"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("./entities/User");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUsers() {
        return await this.userRepository.find();
    }
    async addUser(createUserDto) {
        const userExists = await this.userRepository.findOneBy({ email: createUserDto.email });
        if (userExists) {
            throw new common_1.ConflictException('A user with this email already exists');
        }
        const createdUser = this.userRepository.create(createUserDto);
        return await this.userRepository.save(createdUser);
    }
    async findUserById(id) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findUserByEmail(email) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUser(id, updateUserDto) {
        await this.findUserById(id);
        if (updateUserDto.email) {
            const emailExists = await this.userRepository.findOne({
                where: { email: updateUserDto.email, id: (0, typeorm_2.Not)(id) },
            });
            if (emailExists) {
                throw new common_1.ConflictException('A user with this email already exists');
            }
        }
        await this.userRepository.update(id, updateUserDto);
        return "User updated successfully";
    }
    async deleteUser(id) {
        await this.findUserById(id);
        await this.userRepository.delete(id);
        return "User deleted successfully";
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map