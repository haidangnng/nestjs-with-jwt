import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
const jwt = require('jsonwebtoken');
import { SECRET } from '../config';
import { UserRO } from './user.interface';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../shared/services/prisma.service';
import StripeService from '../stripe/stripe.service';
import AddCreditCardDto from './dto/credit-card.dto';

const select = {
  email: true,
  username: true,
};

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService
  ) {}

  async findAll(): Promise<any[]> {
    return await this.prisma.user.findMany({ select });
  }

  async login(payload: LoginUserDto): Promise<any> {
    const _user = await this.prisma.user.findUnique({
      where: {email: payload.email}
    });

    const errors = { User: 'email or password wrong' };

    if (!_user) {
      throw new HttpException({errors}, 401);
    }

    const authenticated = await argon2.verify(_user.password, payload.password);

    if (!authenticated) {
      throw new HttpException({errors}, 401);
    }

    const token = await this.generateJWT(_user);
    const {password, ...user} = _user;
    return {
      user: {token, ...user}
    };
  }

  async addCreditCard(id: number, dto: AddCreditCardDto): Promise<any> {
    const { paymentMethodId } = dto;
    console.log('paymentMethodId', {paymentMethodId})

    const user = await this.prisma.user.findUnique({
      where: {id}
    })

    if (!user) return;

    const { stripeCustomerId } = user;

    const response = await this.stripeService.attachCreditCard(paymentMethodId, stripeCustomerId);
    console.log('response', response)

    // const 
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    const {username, email, password} = dto;

    const userNotUnique = await this.prisma.user.findUnique({
      where: {email}
    });

    if (userNotUnique) {
      const errors = {username: 'Username and email must be unique.'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
    }

    const stripeCustomer = await this.stripeService.createCustomer(username, email);
    
    const { id, name } = stripeCustomer
    // check uniqueness of username/email

    const hashedPassword = await argon2.hash(password);

    const data = {
      stripeCustomerId: id,
      username: name,
      email,
      password: hashedPassword,
    };
    const user = await this.prisma.user.create({ data, select });

    return {user};
  }

  async update(id: number, data: UpdateUserDto): Promise<any> {
    const where = { id };
    const user = await this.prisma.user.update({ where, data, select });

    return {user};
  }

  async findById(id: number): Promise<any>{
    const user = await this.prisma.user.findUnique({ where: { id }, select: {id: true, ...select} });
    return { user };
  }

  async findByEmail(email: string): Promise<any>{
    const user = await this.prisma.user.findUnique({ where: { email }, select });
    return { user };
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };
}
