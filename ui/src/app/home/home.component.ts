import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../utils/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  menuItem = 'tests';
  version = '1.0.0';
  user: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonservice: CommonService
  ) {
    this.user = commonservice.getUser();
  }

  ngOnInit(): void {
    this.commonservice.get('version', '', null)
    .subscribe(
      version => this.version = version.version,
      err => console.error(err)
    );
  }

  menuClick(menu: string) {
    this.menuItem = menu;
    this.router.navigate([menu], {relativeTo: this.route});
  }

  logout(): void {
    this.commonservice.logout();
  }

}
