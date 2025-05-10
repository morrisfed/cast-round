export interface DomainEvent {
  _tag: string;
  [key: string]: any;
}
