import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { CustomerService } from 'src/app/demo/service/customerservice';
import { UserUpdate } from 'src/app/models/Account/UserUpdate';
import { AccountService } from 'src/app/services/Account.service';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.scss'],
  providers: [MessageService]
})
export class SelectCompanyComponent implements OnInit {

    constructor(public accountService: AccountService, private router: Router, private customerService: CustomerService,public app: AppComponent, private messageService: MessageService) {}
    customerCarousel: any[];
    userUpdate = {} as UserUpdate;
  ngOnInit() {
    this.customerCarousel = [
        {user: 'Araguaia Agro', value: '$8,362,478', image: 'farm'},
        {user: 'ICL', value: '$7,927,105', image: 'icl-icon'},
        {user: 'ICA', value: '$6,471,594', image: 'dentist'},
        {user: 'Dr Silvio Alves', value: '$5,697,883', image: 'doctor'},
        {user: 'Interv Center', value: '$7,653,311', image: 'interv'},
    ];
  }
  public logout():void{
    this.accountService.logout()
    this.router.navigateByUrl('/user/login').then(() => {
        window.location.reload();
      });

}
  carouselResponsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
];

}
