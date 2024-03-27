export enum Opcodes {
  Dispatch = 0, // receive
  Heartbeat = 1, // send
  HeartbeatACK = 3, // receive
  Identify = 4 // send
}

export enum CloseCodes {
  UnknownError = 4000,
  UnknownOpcode = 4001,
  DecodeError = 4002,
  NotAuthenticated = 4003,
  AuthenticationFailed = 4004,
  Forbidden = 4005,
  AlreadyAuthenticated = 4006,
  RateLimited = 4007,
  Forced = 4008
}

export const noReconnectCodes = [CloseCodes.Forced, CloseCodes.Forbidden, CloseCodes.AuthenticationFailed];

export enum EventTypes {
  Ready = 0,
  MessageCreate = 1,
  MessageEdit = 2,
  MessageDelete = 3,
  PresenceUpdate = 4,
  TypingStart = 5,
  UserUpdate = 6
}

export enum ClientEvents {
  Ready = 'ready',
  MessageCreate = 'messageCreate',
  MessageEdit = 'messageEdit',
  MessageDelete = 'messageDelete',
  PresenceUpdate = 'presenceUpdate',
  TypingStart = 'typingStart',
  UserUpdate = 'userUpdate',
  UserCreate = 'userCreate',
  AvatarUpdate = 'avatarUpdate'
}

export enum HttpStatusCodes {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  PayloadTooLarge = 413,
  RateLimited = 429
}

export enum UserState {
  Waitlist = 'Waitlist',
  Active = 'Active',
  Suspended = 'Suspended'
}

export const maxUsernameLength = 32;
export const heartbeatInterval = 20000;
export const maxContentLength = 2000;
export const messagesPerFetch = 100;
export const rateLimitDuration = 5000;