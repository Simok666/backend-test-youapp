import { Controller, Post, Body } from '@nestjs/common';
// import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // console.log('tes');
    return this.authService.login(loginDto);
  }
}
