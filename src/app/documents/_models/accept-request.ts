export interface AcceptRequest {
  approver: string; // username утверждающего
  resolution: string; // резолюция утверждения
  comment: string; // комментарий
  state: number; // статус действия 1-утвердить, 0-отклонить
}
