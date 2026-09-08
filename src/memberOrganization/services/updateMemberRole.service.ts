import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembersOrganization } from '../entity/memberOrganization.entity';
import { Repository } from 'typeorm';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { UpdateMemberDto } from '../dto/updateMember.dto';
import { MemberRole } from '../enum/memberRole.enum';
import { MemberResponseDto } from '../dto/response/memberResponse.dto';


@Injectable()
export class UpdateMemberService {
  constructor(
    @InjectRepository(MembersOrganization)
    private readonly memberRepo: Repository<MembersOrganization>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>
  ) {}

  async updateMember(userId: string, updateMemberDto: UpdateMemberDto): Promise<MemberResponseDto>{
    const { organizationId, role, userMemberId } = updateMemberDto;

    const organizationExists = await this.organizationRepo.exists({
      where: { id: organizationId },
    });
    if (!organizationExists) {
      throw new NotFoundException('Organization does not exist');
    }

    const adminVerify = await this.memberRepo.findOne({
      where: {
        userMember: { id: userId },
        organization: { id: organizationId },
        role: MemberRole.ADMIN,
      },
    });
    if (!adminVerify) {
      throw new ForbiddenException('User is not admin of this organization');
    }

    // 3. Verificar que el miembro existe
    const memberChange = await this.memberRepo.findOne({
      where: {
        userMember: { id: userMemberId },
        organization: { id: organizationId },
      },
    });
    if (!memberChange) {
      throw new NotFoundException('Member not found in this organization');
    }

    // 4. Actualizar rol si se envió
    if (role) {
      memberChange.role = role;
    }

    // 5. Guardar cambios
    const updatedMember = await this.memberRepo.save(memberChange);

    // 6. Respuesta clara
    return {
      id: updatedMember.id,
      organizationId: updatedMember.organization.id,
      organizationName: updatedMember.organization.name,
      userId: updatedMember.userMember.id,
      userName: updatedMember.userMember.name,
      role: updatedMember.role,
    };
  }
}
