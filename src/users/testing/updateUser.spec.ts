import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserService } from '../services/UpdateUser.service';
import { UpdateUserDto } from '../Dtos/updateUser.dto';
import { Not } from 'typeorm';

describe('UpdateUserService', () => {
  let mockUserRepo;
  let service: UpdateUserService;
  let dtoUser: UpdateUserDto;
  beforeEach(() => {
    mockUserRepo = {
      preload: jest.fn(),
      exists: jest.fn(),
      save: jest.fn(),
    };

    dtoUser = {
      name: 'julian',
      email: 'jucastrohenao@gmail.com',
      phone: '3028121522',
      avatarUrl: 'https://example.com/avatar.jpg',
    };

    service = new UpdateUserService(mockUserRepo as any);
  });

  it('should return NotFoundException the user does not exist', async () => {
    mockUserRepo.preload.mockResolvedValue(null);
    await expect(service.updateUser('123sjae', dtoUser)).rejects.toThrow(
      NotFoundException
    );

    expect(mockUserRepo.preload).toHaveBeenCalledWith({
      id: '123sjae',
      ...dtoUser,
    });

    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });

  it('should return ConflictException if the email already exist', async () => {
    const updateUser = {
      id: '123sjae',
      name: 'Julian',
      email: 'old-email@test.com',
    };
    mockUserRepo.preload.mockResolvedValue(updateUser);
    mockUserRepo.exists.mockResolvedValue(true);
    await expect(service.updateUser('123sjae', dtoUser)).rejects.toThrow(
      ConflictException
    );
    expect(mockUserRepo.exists).toHaveBeenCalledWith({
      where: {
        email: dtoUser.email,
        id: Not('123sjae'),
      },
    });

    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });

  it('should to update the user if exist', async () => {

    const updateDto: UpdateUserDto = { phone: '3111111111', };
    // dato falso que vamos a simular que devolvemos
    //dtoUser es el dato que nos manda el suuario con los nuevos valores
    const updatedUser = {
      id: '123sjae',
      name: 'Carlos',
      email: 'julian@test.com',
      phone: '3111111111',
      avatarUrl: 'https://example.com/avatar.jpg',
    };

    //cuando llamemos al preload simulemos que este me devolvera updatedUser
    mockUserRepo.preload.mockResolvedValue(updatedUser);
    mockUserRepo.save.mockResolvedValue(updatedUser);
    const result = await service.updateUser('123sjae', updateDto);

    expect(result).toEqual(updatedUser);

    expect(mockUserRepo.preload).toHaveBeenCalledWith({
      id: '123sjae',
      ...updateDto,
    });

    expect(mockUserRepo.save).toHaveBeenCalledWith(updatedUser);
  });

  it('should update the user if the new email is available', async () => {


    const updateDto = {
      email: 'newemail@test.com',
    };
    const updatedUser = {
      id: '123sjae',
      name: 'Carlos',
      email: 'newemail@test.com',
      phone: '3111111111',
      avatarUrl: 'https://example.com/avatar.jpg',
    };;

    mockUserRepo.preload.mockResolvedValue(updatedUser);
    mockUserRepo.exists.mockResolvedValue(false);
    mockUserRepo.save.mockResolvedValue(updatedUser);

    const result = await service.updateUser(
      '123sjae',
      updateDto,
    );

    expect(result).toEqual(updatedUser);

    expect(mockUserRepo.exists).toHaveBeenCalledWith({
      where: {
        email: updateDto.email,
        id: Not('123sjae'),
      },
    });

    expect(mockUserRepo.save).toHaveBeenCalledWith(updatedUser);
  });
});
