export interface CommandData {
  name: string;
  description: string;
  args: string;
  aliases?: string[];
  admin?: boolean;
  clientAdmin?: boolean;
}