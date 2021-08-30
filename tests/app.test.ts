import { getConnection } from 'typeorm';
import { startApp } from '../src/startApp';

describe('App', () => {
  it('starts the app', async () => {
    const app = await startApp();

    expect(await app.ready()).toBeTruthy();

    await getConnection().close();

    await app.close();
  });
});
