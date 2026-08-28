import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginatedResponseDto } from 'src/common/dtos/paginationResponse.dto';
import { UserResponseDto } from '../Dtos/response/userResponseDto';
import { UserFiltersDto } from '../Dtos/userFilters.dto';


@Injectable()
export class GetUserService {
  logger = new Logger(GetUserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAllUser(filter: UserFiltersDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page, limit, role, sortBy, sortOrder,search } = filter;

  let where: FindOptionsWhere<User> | FindOptionsWhere<User>[] = {}; 
  // because we want to search by either name or email let's check if search is provided

    if (search) {
  where = [
    { name: ILike(`%${search}%`) },
    { email: ILike(`%${search}%`) }
  ];

  if (role) {
    // combine role with search
    where = [
      { role, name: ILike(`%${search}%`) },
      { role, email: ILike(`%${search}%`) }
    ];
  }
}

 this.logger.warn(page, limit);
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where,
      order: sortBy ? { [sortBy]: sortOrder || 'ASC' } : undefined,

    });
    return {
      total,
      page,
      limit,
      data : data.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone ?? undefined,
          avatarUrl: user.avatarUrl ?? undefined,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
      })
    };
  }
}
