export class ClientError extends Error {
  constructor(message: string, data?: any) {
    message = `${message}\n${JSON.stringify(data)}`;

    super(message);
  }
}
