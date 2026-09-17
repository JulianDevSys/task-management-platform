import { NotFoundException } from '@nestjs/common';
import { DeleteUserService } from '../services/deleteUser.service';

describe('DeleteUserService', () => {
  let mockUserRepository;
  let service: DeleteUserService;

  beforeEach(() => {
    mockUserRepository = {
      findOneBy: jest.fn(),
      softRemove: jest.fn(),
    };

    service = new DeleteUserService(mockUserRepository as any);
  });
  it('should delete the user if exist', async () => {
    const user = {
      id: '123sjae',
      name: 'Julian',
      email: 'julian@test.com',
    };

    mockUserRepository.findOneBy.mockResolvedValue(user);
    mockUserRepository.softRemove.mockResolvedValue(user);

    const result = await service.deleteUser('123sjae');

    expect(result).toEqual(user);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
      id: '123sjae',
    });

    // 6. Verificamos que intentó eliminar ESE usuario
    expect(mockUserRepository.softRemove).toHaveBeenCalledWith(user);

    // Ahora NO esperamos el usuario.
    // Esperamos el mensaje definido por el servicio. este es el caso donde se devuevla el mensaje
/*     expect(result).toEqual({
      message: 'User deleted successfully',
    }); */

  });
  it('should return NotFoundException if the user does not exist', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);

    await expect(service.deleteUser('123sjae')).rejects.toThrow(
      NotFoundException
    );

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
      id: '123sjae',
    });
  });
});
