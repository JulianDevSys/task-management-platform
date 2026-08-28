import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/User.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "../Dtos/updateUser.dto";



@Injectable()
export class UpdateUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    const user= await this.userRepository.preload({id, ...userData})

    if(!user){
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (userData.email && userData.email !== user.email) {
      const emailExists = await this.userRepository.exists({
        where: { email: userData.email },
      });
      if (emailExists) {
        throw new ConflictException(`Email ${userData.email} is already in use`);
      }
    }
    return this.userRepository.save(user);
  }
}