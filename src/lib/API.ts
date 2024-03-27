import { Client } from './Client';

export class API {
  public client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async get(route: string) {
    return this.req(route, 'GET');
  }

  public async post(route: string, data?: any) {
    return this.req(route, 'POST', data);
  }

  public async patch(route: string, data?: any) {
    return this.req(route, 'PATCH', data);
  }

  public async delete(route: string, data?: any) {
    return this.req(route, 'DELETE', data);
  }

  private async req(route: string, method: 'GET' | 'POST' | 'DELETE' | 'PATCH', data?: any) {
    const req = await fetch(`${process.env.ENDPOINT}${route}`, {
      method,
      headers: {
        authorization: this.client.token,
        'Content-Type': 'application/json'
      },
      ...(data && { body: JSON.stringify(data) })
    });

    try {
      const res = await req.json();
      if (!req.ok) return { error: true, status: req.status, message: res.message };

      return res;
    } catch {
      if (req.ok) return { status: req.status };

      return { error: true, status: req.status };
    }
  }
}
