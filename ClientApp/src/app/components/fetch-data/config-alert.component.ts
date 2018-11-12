import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { NotificationService } from '../../services/notification.service';
import { AlertService} from '../../services/alert.service';


@Component({
    selector: 'config-alert',
    templateUrl: 'config-alert.component.html',
    styleUrls: ['./config-alert.component.css']
  })
  export class ConfigureAlertDialogComponent {
    form: FormGroup;
    frequencies: string[] = ['Every hour', 'Every 4 hour', 'Daily'];


    constructor(
      public dialogRef: MatDialogRef<ConfigureAlertDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Notification,
      fb: FormBuilder,
      private notificationService: NotificationService,
      private alertService: AlertService) 
      {
        this.form = fb.group({
          "id": [""],
          "subject": ["", [Validators.required]],
          "url": ["", [Validators.required]],
          "email": ["", [Validators.required]],
          "frequency": ["", [Validators.required]],
          "min": [""],
          "max": [""],
        })

        this.form.get('id').setValue(this.data.id);
        this.form.get('subject').setValue(this.data.subject);
        this.form.get('url').setValue(this.data.url);
        this.form.get('email').setValue(this.data.email);
        this.form.get('frequency').setValue(this.data.frequency);
        this.form.get('min').setValue(this.data.min);
        this.form.get('max').setValue(this.data.max);
      }
  
    close(): void {
      this.dialogRef.close();
    }

    save(): void {
      let newNotification  = <Notification>{}
      newNotification.id = this.form.value.id;
      newNotification.subject = this.form.value.subject;
      newNotification.url = this.form.value.url;
      newNotification.email = this.form.value.email;
      newNotification.frequency = this.form.value.frequency;
      newNotification.min = this.form.value.min;
      newNotification.max = this.form.value.max;
      this.notificationService.saveNotification(newNotification)
      .subscribe(
        data => {
          this.alertService.success("Notification created");
          this.dialogRef.close();
        },
        error => {
          this.alertService.error(error);
        });
    }

    get subject() { return this.form.get('subject'); }

    get url() { return this.form.get('url'); }

    get email() { return this.form.get('email'); }
  
    get frequency() { return this.form.get('frequency'); }
  
    get min() { return this.form.get('min'); }

    get max() { return this.form.get('max'); }
  
  }
  