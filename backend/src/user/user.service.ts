import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { User } from './user.model';
import { Response } from 'express';
import { CreationAttributes } from 'sequelize';
import { SignUpUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Sequelize } from 'sequelize-typescript';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepo: typeof User,
    private readonly jwtService: JwtService,
    private readonly sequelize: Sequelize,
  ) {}

  private async getTokens(user: User) {
    const payload = {
      sub: user.id,
      full_name: user.full_name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async registration(createUserDto: SignUpUserDto, res: Response) {
    if (
      !createUserDto.full_name ||
      !createUserDto.email ||
      !createUserDto.phone ||
      !createUserDto.password
    ) {
      throw new BadRequestException(
        'Iltimos, barcha majburiy maydonlarni to‘ldiring.',
      );
    }

    const existUser = await this.userRepo.findOne({
      where: {
        [Op.or]: [
          { email: createUserDto.email },
          { phone: createUserDto.phone },
        ],
      },
    });

    if (existUser) {
      if (existUser.email === createUserDto.email) {
        throw new BadRequestException({
          message: 'Ushbu email allaqachon mavjud!',
          field: 'email',
        });
      }
      if (existUser.phone === createUserDto.phone) {
        throw new BadRequestException({
          message: 'Ushbu telefon raqam allaqachon mavjud!',
          field: 'phone',
        });
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);

    const newUser = await this.userRepo.create({
      ...(createUserDto as unknown as CreationAttributes<User>),
      password_hash: hashedPassword,
      role: Role.Patient,
    });

    const tokens = await this.getTokens(newUser);
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
    await newUser.update({ hashed_refresh_token: hashedRefreshToken });

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      message: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
      user: newUser,
      tokens,
    };
  }

  async login(dto: LoginUserDto, res: Response) {
    if ((!dto.email && !dto.phone) || !dto.password) {
      throw new BadRequestException(
        'Iltimos, barcha majburiy maydonlarni to‘ldiring.',
      );
    }

    const user = await this.userRepo.findOne({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
      attributes: [
        'id',
        'full_name',
        'email',
        'phone',
        'role',
        'password_hash',
      ],
    });

    if (!user) {
      if (dto.email) {
        throw new UnauthorizedException('Bunday email ro‘yxatdan o‘tmagan');
      }
      if (dto.phone) {
        throw new UnauthorizedException(
          'Bunday telefon raqam ro‘yxatdan o‘tmagan',
        );
      }
    }

    if (!user!.password_hash) {
      throw new UnauthorizedException(
        'Ushbu akkaunt uchun parol belgilanmagan',
      );
    }

    const isPassValid = await bcrypt.compare(dto.password, user!.password_hash);
    if (!isPassValid) {
      throw new UnauthorizedException('Parol noto‘g‘ri');
    }

    const tokens = await this.getTokens(user as User);
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
    await user!.update({ hashed_refresh_token: hashedRefreshToken });

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      message: 'Tizimga muvaffaqiyatli kirildi',
      tokens,
    };
  }

  async logout(refreshToken: string, res: Response) {
    const UserData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!UserData) {
      throw new ForbiddenException('Foydalanuvchi topilmadi');
    }

    await this.userRepo.update(
      { hashed_refresh_token: null },
      { where: { id: UserData.sub } },
    );

    res.clearCookie('refresh_token');
    return { message: 'Foydalanuvchi tizimdan chiqdi' };
  }

  async search(keyword: string) {
    return this.userRepo.findAll({
      where: {
        full_name: { [Op.iLike]: `%${keyword}%` },
      },
      order: [['full_name', 'ASC']],
    });
  }

  async update(id: number, dto: any, currentUser: any) {
    const user = await this.userRepo.findByPk(id);
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    if (
      currentUser.role !== Role.Admin &&
      Number(currentUser.userId) !== Number(user.id)
    ) {
      throw new ForbiddenException(
        'Siz faqat o‘zingizning profilingizni o‘zgartirishingiz mumkin',
      );
    }

    if (dto.role && currentUser.role !== Role.Admin) {
      delete dto.role;
    }

    if (dto.phone && dto.phone !== user.phone) {
      const existingPhone = await this.userRepo.findOne({
        where: { phone: dto.phone },
      });
      if (existingPhone) {
        throw new BadRequestException({
          message: 'Ushbu telefon raqam allaqachon mavjud!',
          field: 'phone',
        });
      }
    }

    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (existingEmail) {
        throw new BadRequestException({
          message: 'Ushbu email allaqachon mavjud!',
          field: 'email',
        });
      }
    }

    if (dto.password) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Eski parolni kiriting');
      }

      const isOldPassValid = await bcrypt.compare(
        dto.currentPassword,
        user.password_hash,
      );
      if (!isOldPassValid) {
        throw new UnauthorizedException('Eski parol noto‘g‘ri');
      }

      dto.password_hash = await bcrypt.hash(dto.password, 7);
      delete dto.password;
    }

    await user.update(dto);
    return { message: 'Foydalanuvchi muvaffaqiyatli yangilandi', user };
  }

  async refreshTokenFromCookie(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token topilmadi');

    let payload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch {
      throw new UnauthorizedException('Refresh token noto‘g‘ri');
    }

    const user = await this.userRepo.findByPk(payload.sub);
    if (!user || !user.hashed_refresh_token) {
      throw new UnauthorizedException('Ruxsat rad etildi');
    }

    const isMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token noto‘g‘ri');
    }

    const tokens = await this.getTokens(user);
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
    await user.update({ hashed_refresh_token: hashedRefreshToken });

    return tokens;
  }

  async findAll() {
    return this.userRepo.findAll();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findByPk(id);
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async findMe(currentUser: any): Promise<User> {
    const user = await this.userRepo.findByPk(currentUser.userId);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    return user;
  }

  async remove(id: number) {
    const user = await this.userRepo.findByPk(id);
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    await user.destroy();
    return { message: 'Foydalanuvchi muvaffaqiyatli o‘chirildi' };
  }
}
