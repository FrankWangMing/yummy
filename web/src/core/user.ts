import { Peer } from "./peer";

export class UserController extends Map<string, User> {
  constructor() {
    super();
  }
}

class User {
  peer: Peer | undefined;
  constructor() {}
}
