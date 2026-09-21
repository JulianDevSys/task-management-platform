jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    sign: jest.fn(),
    verify: jest.fn(),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../service/auth.service';
import { User } from 'src/users/entity/User.entity';
import { RefreshToken } from '../entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: any;
  let refreshRepo: any;
  let jwtService: any;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';

    userRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    refreshRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(RefreshToken), useValue: refreshRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should load JWT secret from the env and sign access/refresh tokens during login', async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);

    userRepo.findOne.mockResolvedValue({
      id: 'user-1',
      email: 'ana@test.com',
      name: 'Ana',
      role: 'member',
      password: hashedPassword,
    });

    jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

    const result = await service.login('ana@test.com', '123456');

    expect(process.env.JWT_SECRET).toBe('test-secret');
    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { email: 'ana@test.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });
    expect(jwtService.sign).toHaveBeenCalledTimes(2);
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user.email).toBe('ana@test.com');
  });

  it('should reject login when user does not exist', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(service.login('missing@test.com', '123456')).rejects.toThrow(NotFoundException);
  });

  it('should reject login when password is invalid', async () => {
    userRepo.findOne.mockResolvedValue({
      id: 'user-1',
      email: 'ana@test.com',
      name: 'Ana',
      role: 'member',
      password: await bcrypt.hash('other-pass', 10),
    });

    await expect(service.login('ana@test.com', '123456')).rejects.toThrow(UnauthorizedException);
  });

  it('should refresh access token when refresh token is valid', async () => {
    refreshRepo.findOne.mockResolvedValue({
      token: 'refresh-token',
      expiresAt: new Date(Date.now() + 60_000),
      user: {
        id: 'user-1',
        email: 'ana@test.com',
        name: 'Ana',
        role: 'member',
      },
    });

    jwtService.verify.mockReturnValue({ sub: 'user-1', email: 'ana@test.com', role: 'member' });
    jwtService.sign.mockReturnValueOnce('new-access-token');

    const result = await service.refreshAccessToken('refresh-token');

    expect(result.accessToken).toBe('new-access-token');
    expect(result.user.email).toBe('ana@test.com');
  });

  it('should delete refresh token on logout', async () => {
    refreshRepo.findOne.mockResolvedValue({
      token: 'refresh-token',
      id: 'rt-1',
    });

    await expect(service.logout('refresh-token')).resolves.toEqual({ message: 'Logout successful' });
    expect(refreshRepo.remove).toHaveBeenCalledWith({ token: 'refresh-token', id: 'rt-1' });
  });

  it('should reject registration when email already exists', async () => {
    userRepo.findOne.mockResolvedValue({ id: 'user-1' });

    await expect(
      service.registerUser({
        email: 'ana@test.com',
        name: 'Ana',
        avatarUrl: 'https://example.com/avatar.png',
        phone: '123456789',
        password: '123456',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
