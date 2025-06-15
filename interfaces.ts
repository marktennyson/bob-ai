export interface Message {
  role: string;
  content: string;
}

export interface Model {
  id: string;
  digest?: string;
  model: string;
}

export interface UserSession {
  user: {
    name: string;
    email: string;
    image: string;
  };
}
