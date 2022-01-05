import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getRates() {
    const date = new Date('2021-12-27');
    return await this.appService.getRates(date);
  }

  @Get(':calc')
  async currencyCalculate() {
    const from = 'USD';
    const to = 'EUR';
    const amount = 100;
    const date = new Date('2022-01-05');
    return this.appService.currencyCalculate(from, to, amount, date);
  }
}
