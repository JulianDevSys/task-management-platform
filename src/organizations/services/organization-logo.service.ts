import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entity/Organization.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { MemberRole } from 'src/memberOrganization/enum/memberRole.enum';
import { FileStorageService } from 'src/common/storage/file-storage.service';

@Injectable()
export class OrganizationLogoService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(MembersOrganization)
    private readonly membersOrganizationRepository: Repository<MembersOrganization>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async uploadLogo(
    organizationId: string,
    authenticatedUser: { userId: string; email: string; role: string },
    file: any,
  ) {
    if (!file) {
      throw new NotFoundException('Logo file is required');
    }

    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const membership = await this.membersOrganizationRepository.findOne({
      where: {
        organization: { id: organizationId },
        userMember: { id: authenticatedUser.userId },
        role: MemberRole.ADMIN,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Only organization admins can update the logo');
    }

    const previousKey = organization.logoKey;
    const savedFile = await this.fileStorageService.save(file, 'organizations/logos');

    organization.logoKey = savedFile.key;
    organization.logoMimeType = savedFile.mimeType;

    await this.organizationRepository.save(organization);

    if (previousKey && previousKey !== savedFile.key) {
      await this.fileStorageService.delete(previousKey);
    }

    return {
      id: organization.id,
      logoKey: organization.logoKey,
      logoMimeType: organization.logoMimeType,
    };
  }

  async getLogo(
    organizationId: string,
    authenticatedUser: { userId: string; email: string; role: string },
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const membership = await this.membersOrganizationRepository.findOne({
      where: {
        organization: { id: organizationId },
        userMember: { id: authenticatedUser.userId },
      },
    });

    if (!membership && authenticatedUser.role !== 'admin') {
      throw new ForbiddenException('You do not have access to this organization');
    }

    if (!organization.logoKey) {
      throw new NotFoundException('Organization logo not found');
    }

    return {
      fileKey: organization.logoKey,
      mimeType: organization.logoMimeType ?? 'image/jpeg',
      originalName: `${organization.name}-logo`,
    };
  }
}
