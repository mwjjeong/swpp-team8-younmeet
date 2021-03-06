import { User } from '../models/user';

export class AccountServiceSpy {

  private TEST_USERS = [
      new User(1, 'Alice', 'alice@gmail.com', 'alice_ps', 'alice'),
      new User(2, 'Bob', 'bob@gmail.com', 'bob_ps', 'bob'),
      new User(3, 'Chris', 'chris@gmail.com', 'chris_ps', 'chris'),
  ];

  getUserDetail = jasmine.createSpy('getUser').and.callFake(() => {
    return Promise.resolve(this.TEST_USERS[ 0 ]);
  });

  putUser = jasmine.createSpy('putUser').and.callFake((user: User) => {
    const found = this.TEST_USERS.filter(u => u.id === user.id)[ 0 ];
    found.username = user.username;
    found.email = user.email;
    found.password = user.password;
    found.name = user.name;
    return Promise.resolve(found);
  });

  postUserSignUp = jasmine.createSpy('postUserSignUp').and.callFake(
      (username: string, email: string, password: string, name: string) => {
    this.TEST_USERS.push(new User(
        this.TEST_USERS.length, username, email, password, name
    ));
    return Promise.resolve(true);
  });

  deleteUser = jasmine.createSpy('deleteUser').and.callFake((id: number) => {
    this.TEST_USERS = this.TEST_USERS.filter(u => u.id !== id);
    return Promise.resolve(true);
  });
}
