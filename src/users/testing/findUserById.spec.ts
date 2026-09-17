import { NotFoundException } from '@nestjs/common';
import { GetUserByIdService } from '../services/GetUserById.service';

describe('findUserById', () => {
  let mockRepositoryUser;
  let service: GetUserByIdService;

  beforeEach(() => {
    mockRepositoryUser = {
      findOneBy: jest.fn(),
    };

    //Crea mi servicio real, pero en lugar de darle el Repository real de TypeORM, dale este objeto falso.
    service = new GetUserByIdService(mockRepositoryUser as any);
  });

  it('should return NotFoundException if the user does not exist', async () => {
    //cuando el servicio llame a findOneBy, simula que la base de datos respondió null
    mockRepositoryUser.findOneBy.mockResolvedValue(null);

    await expect(service.findUserById('123sjae')).rejects.toThrow(
      NotFoundException
    );

    expect(mockRepositoryUser.findOneBy).toHaveBeenCalledWith({
      id: '123sjae',
    });
  });

  it('should return the user', async () => {
    const user = {
      id: '123sjae',
      name: 'Julian',
      email: 'julian@test.com',
    };

    mockRepositoryUser.findOneBy.mockResolvedValue(user);

    const result = await service.findUserById('123sjae');

    //toBe (valores como false, true , numeros, string pero no objetos)
    //toEqual mismo contenido,compara la estructura y el contenido
    expect(result).toEqual(user);

    //Mi función mock fue llamada con estos argumentos
    expect(mockRepositoryUser.findOneBy).toHaveBeenCalledWith({
      id: '123sjae',
    });
  });
});
