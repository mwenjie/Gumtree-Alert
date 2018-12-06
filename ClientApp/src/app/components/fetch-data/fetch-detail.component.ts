import { switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'fetch-detail',
  templateUrl: './fetch-detail.component.html',
  styleUrls: ['./fetch-detail.component.css']
})
export class FetchDetailComponent implements OnInit {
  advertisement$: Observable<Advertisement[]>;
  notificationId: string;
  displayedColumns: string[] = ['Title'];
  dataSource: Advertisement[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.advertisement$ = this.route.paramMap.pipe(
       switchMap((params: ParamMap) =>
          this.notificationService.getMutedAdvertisement(params.get('id'))
          )
      )
    ;

      this.advertisement$.subscribe(result => { this.dataSource = result; console.log(result);});
  }

  goBacktoNotification() {
    let notificationId = this.notificationId ? this.notificationId : null;
    // Pass along the hero id if available
    // so that the HeroList component can select that hero.
    // Include a junk 'foo' property for fun.
    this.router.navigate(['/fetch-data', { id: notificationId, foo: 'foo' }]);
  }
}
