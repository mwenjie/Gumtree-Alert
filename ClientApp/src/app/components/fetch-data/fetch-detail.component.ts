import { switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'fetch-detail',
  templateUrl: './fetch-detail.component.html',
  styleUrls: ['./fetch-detail.component.css']
})
export class FetchDetailComponent implements OnInit {
  notification: Notification;
  notificationId: string;
  displayedColumns: string[] = ['select', 'title', 'price', 'location', 'dateListed'];
  dataSource: Advertisement[] = [];
  selection = new SelectionModel<Advertisement>(true, []);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.notificationService.getNotification(params.get('id')
        )
      )
    ).subscribe(result => {
      this.notification = result;
      this.notificationId = "" + result.id;
      this.dataSource = result.advertisement;
      result.advertisement ? result.advertisement.filter(r => r.seen == true).forEach(row => this.selection.select(row)) : null;
    });


    this.selection.onChange.subscribe(x => {
      if (x.added[0]) {
        this.notificationService.updateAdvertisementSeenFlag(this.notification.id, x.added[0].id, true).subscribe();
      }
      if (x.removed.length > 0) {
      x.removed.forEach(row => {
        this.notificationService.updateAdvertisementSeenFlag(this.notification.id, row.id, false).subscribe();
      });
    }
  });
}

goBacktoNotification() {
  let notificationId = this.notificationId ? this.notificationId : null;
  this.router.navigate(['/']);
}

/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.forEach(row => this.selection.select(row));
}

}

