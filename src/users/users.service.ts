import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    const existingUsername = await this.userModel.findOne({ username }).exec();
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    const existingEmail = await this.userModel.findOne({ email }).exec();
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });

    return user.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const birthday = new Date(createProfileDto.birthday);
    const horoscope = this.calculateHoroscope(birthday);
    const zodiac = this.calculateZodiac(birthday);
    user.profile = { ...createProfileDto, birthday, horoscope, zodiac };
    return user.save();
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedProfile = { ...user.profile, ...updateProfileDto };
    if (updateProfileDto.birthday) {
      const birthday = new Date(updateProfileDto.birthday);
      updatedProfile.birthday = birthday;
      updatedProfile.horoscope = this.calculateHoroscope(birthday);
      updatedProfile.zodiac = this.calculateZodiac(birthday);
    }
    user.profile = updatedProfile;
    return user.save();
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async deleteProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    user.profile = {
      image: '',
      name: '',
      gender: 'other',
      birthday: null,
      horoscope: '',
      zodiac: '',
      height: 0,
      weight: 0,
    };

    return user.save();
  }

  private calculateHoroscope(birthday: Date): string {
    const month = birthday.getUTCMonth() + 1;
    const day = birthday.getUTCDate();
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18))
      return 'Aquarius';
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces';
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
    if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return 'Gemini';
    if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return 'Cancer';
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
    if ((month == 9 && day >= 23) || (month == 10 && day <= 23)) return 'Libra';
    if ((month == 10 && day >= 24) || (month == 11 && day <= 21))
      return 'Scorpio';
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21))
      return 'Sagittarius';
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19))
      return 'Capricorn';
  }

  private calculateZodiac(birthday: Date): string {
    const year = birthday.getUTCFullYear();
    const chineseZodiacYears = [
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2023-01-22'), end: new Date('2024-02-09'), animal: 'Rabbit' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2022-02-01'), end: new Date('2023-01-21'), animal: 'Tiger' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2021-02-12'), end: new Date('2022-01-31'), animal: 'Ox' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2020-01-25'), end: new Date('2021-02-11'), animal: 'Rat' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2019-02-5'), end: new Date('2020-01-24'), animal: 'Pig' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2018-02-16'), end: new Date('2019-02-4'), animal: 'Dog' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2017-01-28'), end: new Date('2018-02-15'), animal: 'Rooster' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2016-02-8'), end: new Date('2017-01-17'), animal: 'Monkey' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2015-02-19'), end: new Date('2016-02-7'), animal: 'Goat' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2014-01-31'), end: new Date('2015-02-18'), animal: 'Horse' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2013-02-10'), end: new Date('2014-01-30'), animal: 'Snake' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2012-01-23'), end: new Date('2013-02-9'), animal: 'Dragon' },
      // eslint-disable-next-line prettier/prettier
      { start: new Date('2011-02-3'), end: new Date('2012-01-22'), animal: 'Rabbit' },

    ];

    for (const range of chineseZodiacYears) {
      if (birthday >= range.start && birthday <= range.end) {
        return range.animal;
      }
    }

    // Fallback if no match is found
    const animals = [
      'Rat',
      'Ox',
      'Tiger',
      'Rabbit',
      'Dragon',
      'Snake',
      'Horse',
      'Goat',
      'Monkey',
      'Rooster',
      'Dog',
      'Pig',
    ];
    return animals[(year - 4) % 12];
  }
}
