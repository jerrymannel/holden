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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonservice: CommonService
  ) {}

  ngOnInit(): void {
    // this.router.navigate(['home']);
    this.commonservice.get('version', '', null)
    .subscribe(
      version => this.version = version,
      err => console.error(err)
    );
  }

  login(): void {
    // this.router.navigate(['home']);
    const data = {
      username: this.username,
      password: this.password
    };
    this.commonservice.post('user', '/login', data)
    .subscribe(
      loginResponse => this.commonservice.saveSessionData(loginResponse),
      err => console.error(err)
    );
  }

}
