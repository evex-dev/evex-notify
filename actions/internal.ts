export abstract class NotifyAction {
  constructor() {}

  public abstract polling(): Promise<void>;
}
