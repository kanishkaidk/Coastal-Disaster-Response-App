import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ description: 'Service is healthy' })
  health() {
    return { app: 'Coast-Kavach', status: 'ok', time: new Date().toISOString() };
  }

  @Get('ping')
  @ApiOperation({ summary: 'Liveness ping' })
  @ApiOkResponse({ description: 'Service is alive' })
  ping() {
    return { app: 'Coast-Kavach', status: 'ok', time: new Date().toISOString() };
  }
}


