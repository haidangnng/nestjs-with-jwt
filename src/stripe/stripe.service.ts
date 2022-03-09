import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../shared/services/prisma.service';
import * as dotenv from 'dotenv'
 
dotenv.config();

@Injectable()
export default class StripeService {
  private stripe: Stripe;
 
  constructor(
  ) {
    this.stripe = new Stripe((`${process.env.STRIPE_SECRET_KEY}`), {
      apiVersion: "2020-08-27"
    });
  }

  public async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email
    });
  }

  public async attachCreditCard(paymentMethodId: string, customerId: string) {
    return this.stripe.setupIntents.create({
      customer: customerId,
      payment_method: paymentMethodId,
    })
  }
}