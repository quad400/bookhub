import { Controller } from '@nestjs/common';
import { HubService } from './hub.service';

@Controller('hub')
export class HubController {
  constructor(private readonly hubService: HubService) {}
}
