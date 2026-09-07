import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MembersOrganization } from '../entity/memberOrganization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { DeleteMemberDto } from '../dto/deleteMember.dto';
import { MemberRole } from '../enum/memberRole.enum';

@Injectable()
export class DeleteMemberService {
  constructor(
    @InjectRepository(MembersOrganization)
    private readonly memberRepo: Repository<MembersOrganization>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>
  ) {}

  async deleteMember(idUser: string, deleteMemberDto: DeleteMemberDto) {
    const { organizationId, userMemberId } = deleteMemberDto;

    const organization = await this.organizationRepo.exists({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new NotFoundException('the organization doesnot exist');
    }

    const memberToDelete = await this.memberRepo.findOne({
      where: {
        userMember: { id: userMemberId },
        organization: { id: organizationId },
      },
    });

    if (!memberToDelete) {
      throw new NotFoundException('that user does not exist');
    }

    const verifyAdmin = await this.memberRepo.findOne({
      where: {
        userMember: { id: idUser },
        organization: { id: organizationId },
        role: MemberRole.ADMIN,
      },
    });

    if (!verifyAdmin) {
      throw new ConflictException('the user can not be delete');
    }

    await this.memberRepo.remove(memberToDelete);
  }
}
