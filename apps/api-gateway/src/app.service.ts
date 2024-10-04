import { USER_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {

  constructor(@Inject(USER_SERVICE) private appClient: ClientProxy){}

  getHello(): string {
    return 'Hello World!';
  }

  // biller(data: any){
  //   return  lastValueFrom(
  //       this.appClient.send('biller', data))
  // }
}
