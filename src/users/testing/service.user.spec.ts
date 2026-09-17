import { ConflictException } from '@nestjs/common';
import { CreateUserService } from '../services/createUser.service';

describe('CreateUserService', () => {
  let mockRepositoryUser;
  let service: CreateUserService;

  beforeEach(() => {
    mockRepositoryUser = {
      exists: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    service = new CreateUserService(mockRepositoryUser as any);
  });

  it('should create a user when email does not exist', async () => {
    mockRepositoryUser.exists.mockResolvedValue(false);

    const user = {
      id: 1,
      name: 'Julian',
      email: 'julian@test.com',
    };

    mockRepositoryUser.create.mockReturnValue(user);
    mockRepositoryUser.save.mockResolvedValue(user);

    const result = await service.createUser({
      name: 'Julian',
      email: 'julian@test.com',
    });

    expect(result).toEqual(user);
  });

  it('should throw a ConflictException when email already exists', async () => {
    mockRepositoryUser.exists.mockResolvedValue(true);

    await expect(
      service.createUser({
        name: 'Julian',
        email: 'julian@test.com',
      })
    ).rejects.toThrow(ConflictException);

    expect(mockRepositoryUser.exists).toHaveBeenCalledWith({
      where: {
        email: 'julian@test.com',
      },
    });

    //Cuántas veces fue ejecutada esta función?, es útil cuando quieres verificar que tu servicio no está haciendo llamadas innecesarias.
    expect(mockRepositoryUser.exists).toHaveBeenCalledTimes(1);

    //Esta función NO debería haberse ejecutado, Si el email ya existe, no deberíamos intentar crear ni guardar el usuario.
    expect(mockRepositoryUser.create).not.toHaveBeenCalled();
    expect(mockRepositoryUser.save).not.toHaveBeenCalled();
  });

  it('should throw when try to save in data Base', async () => {
    mockRepositoryUser.exists.mockResolvedValue(false);
    const user = {
      id: 1,
      name: 'Julian',
      email: 'julian@test.com',
    };

    mockRepositoryUser.create.mockReturnValue(user);

    mockRepositoryUser.save.mockRejectedValue(new Error('Database error'));

    await expect(
      service.createUser({
        name: 'Julian',
        email: 'julian@test.com',
      })
    ).rejects.toThrow('Database error');
    expect(mockRepositoryUser.save).toHaveBeenCalledWith(user);
  });
});
