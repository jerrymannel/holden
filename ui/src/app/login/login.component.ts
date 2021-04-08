import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from '../utils/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version = '1.0.0';
  username: string;
  password: string;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonservice: CommonService
  ) {
    if (this.commonservice.getToken()) {
      this.router.navigate(['home']);
    }
  }

  ngOnInit(): void {
    // this.router.navigate(['home']);
    this.commonservice.get('version', '', null)
    .subscribe(
      version => this.version = version.version,
      err => console.error(err)
    );
  }

  login(): void {
    this.error = null;
    const data = {
      username: this.username,
      password: this.password
    };
    this.commonservice.post('user', '/login', data)
    .subscribe(
      loginResponse => {
        this.commonservice.saveSessionData(loginResponse);
        this.router.navigate(['home']);
      },
      err => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    );
  }

}
