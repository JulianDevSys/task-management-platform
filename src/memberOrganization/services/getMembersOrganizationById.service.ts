import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { Repository } from 'typeorm';
import { MembersOrganization } from '../entity/memberOrganization.entity';
import { GetMembersOrganizationByIdResponse } from '../dto/response/getMember.response';

@Injectable()
export class GetMembersOrganizationByIdService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(MembersOrganization)
    private readonly memberRepository: Repository<MembersOrganization>
  ) {}
  async getMembersOrganizationById(id: string) : Promise<GetMembersOrganizationByIdResponse>{
    const existOrganization = await this.organizationRepo.exists({
      where: { id },
    });

    if (!existOrganization) {
      throw new NotFoundException('Organization not found');
    }

    const membersOrganization = await this.memberRepository.find({
      where: { organization: { id } },
      relations: { userMember: true, organization: true },
    });

    if (!membersOrganization) {
      throw new NotFoundException('Members organization not found');
    }

    return {
      organizationName: membersOrganization[0].organization.name,
      members: membersOrganization.map((m) => ({
        id: m.userMember.id,
        name: m.userMember.name,
        role: m.role,
      })),
      length: membersOrganization.length,
    };
  }
}
