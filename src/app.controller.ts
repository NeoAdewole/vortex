import { Get, Controller, Res, Render } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private appService: AppService) {}
  @Get()
  root(@Res() res: Response) {
    return res.render(this.appService.getIndex(), {
      message: 'Hello Mutter!',
      status: 'Service Operational',
      logged_in: false
    });
  }
}
