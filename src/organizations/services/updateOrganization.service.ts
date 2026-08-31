import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Organization } from '../entity/Organization.entity';
import { Repository } from 'typeorm';
import { UpdateOrganizationDto } from '../Dtos/updateOrganizationDto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UpdateOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>
  ) {}

  async updateOrganization(
    updateOrganizationDto: UpdateOrganizationDto,
    id: string
  ) {
    const organizationExists = await this.organizationRepo.preload({
      id,
      ...updateOrganizationDto,
    });

    if (!organizationExists) {
      throw new NotFoundException('Organization not found');
    }

    if (
      updateOrganizationDto.name &&
      updateOrganizationDto.name !== organizationExists.name
    ) {
      const nameExists = await this.organizationRepo.exists({
        where: { name: updateOrganizationDto.name },
      });
      if (nameExists) {
        throw new ConflictException('that name is already in use');
      }
    }

    const updatedOrganization =
      await this.organizationRepo.save(organizationExists);

    return {
      id: updatedOrganization.id,
      name: updatedOrganization.name,
      description: updatedOrganization.description,
      createdAt: updatedOrganization.createdAt,
      updatedAt: updatedOrganization.updatedAt,
    };
  }
}
