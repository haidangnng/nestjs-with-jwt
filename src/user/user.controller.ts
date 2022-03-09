import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRO } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

import {
  ApiBearerAuth, ApiTags
} from '@nestjs/swagger';
import AddCreditCardDto from './dto/credit-card.dto';
import StripeService from '../stripe/stripe.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService,private readonly stripeService: StripeService) {}

  @Get('user')
  async findMe(@User('email') email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  @Put('user')
  async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
    console.log('userData', userData)
    console.log('userId', userId)
    return await this.userService.update(userId, userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Put('users/add-payment')
  async addCreditCard(@User('id') userId: number, @Body() creditCard: AddCreditCardDto) {
    console.log('creditCard', creditCard)
    console.log('userId', userId)
    return this.userService.addCreditCard(userId, creditCard);
  }

  @UsePipes(new ValidationPipe())
  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
    return await this.userService.login(loginUserDto);
  }
}
