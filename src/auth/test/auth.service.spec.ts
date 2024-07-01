import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUser: any = {
    _id: '6678fb9da781fc186f7c6c9d',
    email: 'testuser@example.com',
    username: 'testuser',
    password: '$2a$10$q0UglDzbNyJMsAxABC4DyOVRJyREF0fl9V7RIqHFm9SbdI46pov0K',
    toObject: jest.fn().mockReturnValue({
      username: 'testuser',
      email: 'testuser@example.com',
      _id: '6678fb9da781fc186f7c6c9d',
    }),
  };

  const mockUsersService = {
    findByUsername: jest.fn().mockResolvedValue(mockUser),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getModelToken('User'), useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user credentials and return the user data', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(mockUser.username, 'password');

      expect(result).toEqual({
        username: 'testuser',
        email: 'testuser@example.com',
        _id: '6678fb9da781fc186f7c6c9d',
      });
    });

    it('should return null if password is incorrect', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await service.validateUser(
        mockUser.username,
        'wrongpassword',
      );

      expect(result).toBeNull();
    });

    it('should return null if user does not exist', async () => {
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);

      const result = await service.validateUser(
        mockUser.username,
        mockUser.password,
      );

      expect(result).toBeNull();
    });
  });
});
