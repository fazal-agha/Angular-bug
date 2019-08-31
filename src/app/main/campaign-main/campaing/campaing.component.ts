import { Component, OnInit } from '@angular/core';
import { CompaignService } from 'src/app/shared/services/compaign.service';
import { Router } from '@angular/router';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-campaing',
  templateUrl: './campaing.component.html',
  styleUrls: ['./campaing.component.scss']
})
export class CampaingComponent implements OnInit {
  showActions;
  couponColumns = ['Type', 'Campaign', 'Integrations', 'Issued', 'Redeemed', 'Start Date', 'End Date', 'Status', 'Action'];
  cardColumns = ['Type', 'Campaign', 'Integrations', 'Issued', 'Status', 'Action'];
  ticketColumns = ['Type', 'Campaign', 'Integrations', 'Issued', 'Redeemed', 'Start Date', 'Time', 'Status', 'Action'];
  //  defaultColumns = ['Campaign Name', 'Description', 'Template', 'Issued', 'Redeemed', 'Start Date', 'End Date', 'Status', 'Action'];
  allCouponColumns = this.couponColumns;
  allCardColumns = this.cardColumns;
  allTicketColumns = this.ticketColumns;
  campaigns;
  inChangeStatus = '';
  searchText;

  type = 'Coupons';
  dataCoupon;
  dataCard;
  dataTicket;
  filteredDataCoupon = [];
  filteredDataCard = [];
  filteredDataTicket = [];
  showLoader;

  constructor(private campaignService: CompaignService, private router: Router, private mainService: MainService) {
    if (JSON.parse(localStorage.getItem('user'))['user_type'] !== 4) {
      this.showLoader = true;
      this.getCampaigns();
    }
  }

  ngOnInit() {
  }

  getCampaigns() {
    // this.mainService.showLoader.emit(true);

    this.campaignService.getСampaignsBrands(JSON.parse(localStorage.getItem('currentBrand'))['brand_id']).subscribe(data => {
      this.dataCoupon = [];
      this.dataCard = [];
      this.dataTicket = [];

      console.log(data);
      this.campaigns = data['data'];

      this.campaigns.forEach(element => {
        // let type;
        // switch (element.campaign_type) {
        //   case 1:
        //     type = 'Coupon in %';
        //     break;

        //   case 2:
        //     type = 'Coupon in $';
        //     break;

        //   case 3:
        //     type = 'Birthday Coupon';
        //     break;

        //   case 4:
        //     type = 'Referral Coupon';
        //     break;

        //   default:
        //     break;
        // }
        // if(element.campaign_type == 5 || element.campaign_type == 6){
        //   this.data.unshift({
        //     data: {
        //       'Type': { name: this.getTypeImage(element.campaign_type) },
        //       'Campaign': { name: element.campaign_name },
        //       'Integrations': { name: element.integrations },
        //       // 'Template': { name: element.campaign_type_formatted },
        //       'Issued': { name: element.coupons_created },
        //       'Redeemed': { name: element.total_redeems },
        //       'Start Date': { name: element.startDateFormatted },
        //       'End Date': { name: element.endDateFormatted },
        //       'Status': { name: element.is_active },
        //       'Action': { name: '' },
        //       'Id': { name: element.id },
        //       'Brand_Id': { name: element.brand_id }
        //     }
        //   });
        // }else{
        if (element.campaign_type <= 4) {
          this.dataCoupon.push({
            data: {
              'Type': { name: this.getTypeImage(element.campaign_type) },
              'Campaign': { name: element.campaign_name },
              'Integrations': { name: element.integrations },
              // 'Template': { name: element.campaign_type_formatted },
              'Issued': { name: element.coupons_created },
              'Redeemed': { name: element.total_redeems },
              'Start Date': { name: element.startDateFormatted },
              'End Date': { name: element.endDateFormatted },
              'Status': { name: element.is_active },
              'Action': { name: '' },
              'Id': { name: element.id },
              'Brand_Id': { name: element.brand_id }
            }
          });
        } else if (element.campaign_type <= 7) {
          this.dataCard.push({
            data: {
              'Type': { name: this.getTypeImage(element.campaign_type) },
              'Campaign': { name: element.campaign_name },
              'Integrations': { name: element.integrations },
              // 'Template': { name: element.campaign_type_formatted },
              'Issued': { name: element.cards_created },
              'Status': { name: element.is_active },
              'Action': { name: '' },
              'Id': { name: element.id },
              'Brand_Id': { name: element.brand_id }
            }
          });
        } else if (element.campaign_type <= 9) {
          this.dataTicket.push({
            data: {
              'Type': { name: this.getTypeImage(element.campaign_type) },
              'Campaign': { name: element.campaign_name },
              'Integrations': { name: element.integrations },
              // 'Template': { name: element.campaign_type_formatted },
              'Issued': { name: element.tickets_created },
              'Redeemed': { name: element.total_redeems },
              'Start Date': { name: element.startDateFormatted },
              'Time': { name: element.time },
              'Status': { name: element.is_active },
              'Action': { name: '' },
              'Id': { name: element.id },
              'Brand_Id': { name: element.brand_id }
            }
          });
        }
        // console.log(this.dataCoupon);
      });

      this.filteredDataCoupon = this.dataCoupon;
      this.filteredDataCard = this.dataCard;
      this.filteredDataTicket = this.dataTicket;

      // this.mainService.showLoader.emit(false);
      this.showLoader = false;
    }, err => {
      console.log(err);
      this.dataCoupon = [];
      this.dataCard = [];
      this.dataTicket = [];
      // this.mainService.showLoader.emit(false);
      this.filteredDataCoupon = [];
      this.filteredDataCard = [];
      this.filteredDataTicket = [];
      this.showLoader = false;
    });
  }

  changeStatus(label, input, id, status, event) {
    event.stopPropagation();
    this.inChangeStatus = id;
    label.classList.add('disable');
    this.campaignService.updateСampaign(id, { is_active: !status }).subscribe(result => {
      console.log(result);
      const msg = (!status) ? 'activated' : 'deactivated';
      this.mainService.showToastrSuccess.emit({text: `Campaign has been ${msg}`});
      this.getCampaigns();
      (document.getElementById(input) as HTMLInputElement).checked = !((document.getElementById(input) as HTMLInputElement).checked);
      label.classList.remove('disable');
      this.inChangeStatus = '';
    }, err => {
      console.log(err);
      label.classList.remove('disable');
      this.inChangeStatus = '';
    });
  }

  edit(id, event) {
    event.stopPropagation();

    this.router.navigate(['/main/campaign-main/create-campaign/' + id.name]);
  }

  delete(id, brand_id, event) {
    event.stopPropagation();

    console.log({ campaign_id: id });
    this.campaignService.deleteСampaign({ campaign_id: id, brand_id: brand_id }).subscribe(result => {
      console.log(result);
      if (result['success']) {
        this.mainService.showToastrSuccess.emit({text: 'Campaign deleted'});
        this.getCampaigns();
      }
    });
  }

  filterCampaigns(type) {
    if (type === 'Coupons') {
      this.filteredDataCoupon = this.dataCoupon.filter(element => {
        console.log(element);
        console.log(element.data['Campaign']);
        if (element.data['Campaign'].name.toLowerCase().includes(this.searchText.toLowerCase())) {
          return true;
        }
      });
      console.log(this.filteredDataCoupon);
    } else if (type === 'Cards') {
      this.filteredDataCard = this.dataCard.filter(element => {
        console.log(element);
        console.log(element.data['Campaign']);
        if (element.data['Campaign'].name.toLowerCase().includes(this.searchText.toLowerCase())) {
          return true;
        }
      });
      console.log(this.filteredDataCard);
    } else if (type === 'Tickets') {
      this.filteredDataTicket = this.dataTicket.filter(element => {
        console.log(element);
        console.log(element.data['Campaign']);
        if (element.data['Campaign'].name.toLowerCase().includes(this.searchText.toLowerCase())) {
          return true;
        }
      });
      console.log(this.filteredDataTicket);
    }
  }

  goToDetails(id) {
    this.router.navigate(['/main/campaign-main/details/' + id]);
  }

  showShared(row, event) {
    event.stopPropagation();
    this.showActions = row;
  }

  refresh() {
    this.showLoader = true;
    this.getCampaigns();
  }

  addCampaign() {
    this.mainService.dataCampaign = {
      name: '',
      description: '',
      selectedCustomField: '',
      card_id: '',
      discount: '',
      startDate: '',
      endDate: '',
      campaign_type: '',
      brand_id: '',
      coupon_validity: '',
      currency: '',
      event_name: '',
      venue: '',
      time: '',
      cardType: '',
      points: ''
    };
    this.router.navigate(['/main/campaign-main/create-campaign']);
  }

  onChangeTab(evt) {
    if (evt.tabTitle === 'Coupons') {
      this.type = 'Coupons';
    } else if (evt.tabTitle === 'Cards') {
      this.type = 'Cards';
    } else if (evt.tabTitle === 'Tickets') {
      this.type = 'Tickets';
    }
  }

  getTypeImage(type){
    switch (type){
      case 1:{
        return 'assets/img/Coupon.png';
      }
      case 2:{
        return 'assets/img/Coupon-in-$.png';
      }
      case 3:{
        return 'assets/img/Birthday-Coupon.png';
      }
      case 4:{
        return 'assets/img/Referral-Coupon.png';
      }
      case 5:{
        return 'assets/img/LoyaltyCard.png';
      }
      case 6:{
        return 'assets/img/stampCard.png';
      }
      case 7:{
        return 'assets/img/membershipCard.png';
      }
      case 8:{
        return 'assets/img/eventTickets.png';
      }
      case 9:{
        return 'assets/img/webinarIcon.png';
      }
    }
  }
}
