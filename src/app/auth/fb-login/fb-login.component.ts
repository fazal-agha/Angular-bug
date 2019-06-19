import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BrandService } from 'src/app/shared/services/brand.service';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-fb-login',
  templateUrl: './fb-login.component.html',
  styleUrls: ['./fb-login.component.scss']
})
export class FbLoginComponent implements OnInit {
  terms;
  termsError;
  showLoader = true;

  constructor(private authService: AuthService,
    private firebaseAuth: AngularFireAuth,
    private ngZone: NgZone,
    public router: Router,
    private afs: AngularFirestore,
    private brandService: BrandService,
    private mainServ: MainService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.firebaseAuth.auth.getRedirectResult()
      .then(async res => {
        if (res.user) {
          console.log(res);
          const firstname = res.additionalUserInfo.profile['first_name'];
          const lastname = res.additionalUserInfo.profile['last_name'];
          const email = res.user.email;
          const uid = res.user.uid;
          const newUser = res.additionalUserInfo.isNewUser;

          localStorage.setItem('userID', res.user.uid);
          localStorage.setItem('usertoken', await res.user.getIdToken());
          localStorage.setItem('access', res.credential['accessToken']);
          console.log(newUser);

          if (newUser) {
            // create user in firestore
            console.log('newUser');

            const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
            await userRef.set({
              account_type: 'starter',
              crated_at: new Date(),
              firstname: firstname,
              lastname: lastname,
              email: email,
              marketing: true,
              user_type: 1,
              avatar: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png'
            });
          }

          this.authService.getUser(uid).subscribe(data => {
            console.log(data);
            localStorage.setItem('user', JSON.stringify(data['data']));
            if (data['data']['activeBrand']) {
              this.brandService.getBrandById(data['data']['activeBrand']).subscribe(res_brand => {
                console.log(res_brand);
                localStorage.setItem('currentBrand', JSON.stringify(res_brand['brand']));
                this.ngZone.run(() => this.router.navigate(['/main/dashboard']));
                this.showLoader = false;
              }, err => {
                this.ngZone.run(() => this.router.navigate(['/fb-connect']));
                this.showLoader = false;
              });
            } else {
              this.ngZone.run(() => this.router.navigate(['/fb-connect']));
              this.showLoader = false;
            }
          }, err => {
            this.showLoader = false;
            console.log(err);
          });
        } else {
          console.log('asdadsdasdasd');
          this.showLoader = false;
        }
      });
    }, 1000);
  }


  loginFB() {
    if (this.terms) {
      this.firebaseAuth.auth.signOut();
      this.authService.doFacebookLogin();
    } else {
      this.termsError = true;
    }
  }
}