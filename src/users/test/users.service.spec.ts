import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../../users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { getModelToken } from '@nestjs/mongoose';

describe('AuthService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            findByUsername: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    // authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
        confirmPassword: 'testpassword',
      };

      // Mock findByUsername and findByEmail to return null (indicating user does not exist)
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      // Mock the create method of UsersService
      const mockUser: Partial<User> = {
        _id: '123',
        username: registerDto.username,
        password: await bcrypt.hash(registerDto.password, 10),
        email: registerDto.email,
        profile: {
          image: '',
          name: '',
          gender: 'other',
          birthday: null,
          horoscope: '',
          zodiac: '',
          height: 0,
          weight: 0,
        },
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          username: registerDto.username,
          email: registerDto.email,
          profile: {
            image: '',
            name: '',
            gender: 'other',
            birthday: null,
            horoscope: '',
            zodiac: '',
            height: 0,
            weight: 0,
          },
        }),
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as User);

      // Call register method and assert
      const result = await usersService.create(registerDto);
      expect(result.username).toEqual(registerDto.username);
      expect(result.email).toEqual(registerDto.email);
    });
  });
});
