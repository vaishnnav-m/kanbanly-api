export interface IPasswordUtils {
  hash(password: string): Promise<string>;
  compare(current: string, original: string): Promise<boolean>;
}