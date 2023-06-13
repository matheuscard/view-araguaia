import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail } from 'src/app/araguaia/api/mail';
import { MailService } from 'src/app/araguaia/components/apps/mail/service/mail.service';

@Component({
    templateUrl: './mail-archive.component.html'
})
export class MailArchiveComponent implements OnDestroy {

    archivedMails: Mail[] = [];

    subscription: Subscription;

    constructor(private mailService: MailService) {
        this.subscription = this.mailService.mails$.subscribe(data => {
            this.archivedMails = data.filter(d => d.archived);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
