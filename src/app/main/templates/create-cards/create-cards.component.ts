import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-cards',
  templateUrl: './create-cards.component.html',
  styleUrls: ['./create-cards.component.scss']
})
export class CreateCardsComponent implements OnInit {

  constructor(private mainServise: MainService, private router: Router) { }

  ngOnInit() {
  }

  getType(type) {
    this.mainServise.cardType = type;
    switch (type) {
      case 'coupons':
        this.mainServise.cardTypeId = 1;
        break;
      case 'cards':
        this.mainServise.cardTypeId = 2;
        break;
      case 'tickets':
        this.mainServise.cardTypeId = 3;
        break;
      default:
        break;
    }
    this.router.navigate(['/main/templates/create-coupon']);
  }

}
