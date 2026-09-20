import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/User.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDtoRegister } from '../dto/register.dto';
import { UserResponseDto } from 'src/users/Dtos/response/userResponseDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //firmanar y validar tokens
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>
  ) {}

  async registerUser(
    createUserDto: CreateUserDtoRegister
  ): Promise<UserResponseDto> {
    const { email, name, avatarUrl, phone, password } = createUserDto;
    const registerUser = await this.userRepo.findOne({
      where: { email },
    });
    if (registerUser) {
      throw new ConflictException('this email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepo.create({
      avatarUrl,
      email,
      name,
      phone,
      password: hashedPassword,
    });

    const saveUser = await this.userRepo.save(newUser);

    return {
      id: saveUser.id,
      email: saveUser.email,
      name: saveUser.name,
      avatarUrl: saveUser.avatarUrl,
      role: saveUser.role,
      phone: saveUser.phone,
      updatedAt: saveUser.updatedAt,
      createdAt: saveUser.createdAt,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role }; //gurdamos en el token
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const refreshEntity = this.refreshRepo.create({
      user,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.refreshRepo.save(refreshEntity);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    // 1. Buscar el refresh token en la base
    const storedToken = await this.refreshRepo.findOne({
      where: { token: refreshToken },
      relations: { user: true }, //  para traer el usuario asociado
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 2. Verificar expiración
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // 3. Verificar firma del token
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token signature');
    }

    // 4. Generar nuevo access token
    const newAccessToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, role: payload.role },
      { expiresIn: '15m' }
    );

    // 5. Devolver respuesta
    return {
      accessToken: newAccessToken,
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        name: storedToken.user.name,
        role: storedToken.user.role,
      },
    };
  }

  async logout(refreshToken: string) {
    // 1. Buscar el refresh token en la base
    const storedToken = await this.refreshRepo.findOne({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 2. Eliminarlo
    await this.refreshRepo.remove(storedToken);

    // 3. Respuesta
    return { message: 'Logout successful' };
  }
}
