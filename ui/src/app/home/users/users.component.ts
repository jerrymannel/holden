import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/utils/common.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: any;
  selectedUser: any;

  username: string;
  password: string;

  error: string;
  errorAddUpdate: string;

  constructor(
    private commonservice: CommonService
  ) { }

  ngOnInit(): void {
    this.__getUsers();
  }

  __resetError(): void {
    this.error = null;
    this.errorAddUpdate = null;
  }

  __getUsers(): void {
    this.__resetError();
    this.commonservice.get('user', '/', null)
    .subscribe(
      users => {
        this.users = users;
        this.selectUser(users[0]);
      },
      () => this.error = 'Unable to fetch users.'
    );
  }

  selectUser(user: any): void {
    this.__resetError();
    this.selectedUser = user;
    this.username = user._id;
  }

  updatePassword(): void {
    this.__resetError();
    this.commonservice.put('user', `/${this.selectedUser._id}`, {password: this.password})
    .subscribe(
      () => this.__getUsers(),
      () => this.errorAddUpdate = 'Error updating password'
    );
  }

  addUser(): void {
    this.__resetError();
    this.commonservice.post('user', '/', {username: this.username, password: this.password})
    .subscribe(
      () => this.__getUsers(),
      () => this.errorAddUpdate = 'Error adding user'
    );
  }

  deleteUser(user: any): void {
    this.__resetError();
    this.commonservice.delete('user', `/${user._id}`)
    .subscribe(
      () => this.__getUsers(),
      () => this.error = 'Error deleting user'
    );
  }

}
