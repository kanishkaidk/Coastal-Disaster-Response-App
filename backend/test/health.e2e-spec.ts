import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/modules/app.module';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health/ping (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health/ping');
    expect(res.status).toBe(200);
    expect(res.body.app).toBe('Coast-Kavach');
  });
});


