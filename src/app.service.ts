import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIndex(): string {
    // console.log('message: Here in AppService getViewName');
    const status = 'index';
    return status;
  }
  getViewName(): string {
    throw new Error('Method not implemented, in AppService.');
  }
}
