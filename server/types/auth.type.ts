export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  avater?: string;
}

export interface IActivationToken {
  token: string;
  activationCode: string;
}

export interface IEmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: {} };
}
