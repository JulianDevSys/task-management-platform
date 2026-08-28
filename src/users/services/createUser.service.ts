import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/User.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../Dtos/createUser.dto";
import { UserResponseDto } from "../Dtos/response/userResponseDto";
import { UserRole } from "../enums/user-role.enum";



@Injectable()
export class CreateUserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const userExists = await this.userRepository.exists({
      where: { email: userData.email },
    })

    if(userExists){
      throw new ConflictException(`the email ${userData.email} is already in use`);
    }

    const newUser = this.userRepository.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phone ?? undefined,
      avatarUrl: userData.avatarUrl ?? undefined,
      role: UserRole.MEMBER

    })
    return this.userRepository.save(newUser);
  }
}