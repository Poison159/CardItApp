import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/CardService';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import {Storage} from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Card } from '../Card';
import { Router } from '@angular/router';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
})
export class AddCardPage implements OnInit {

  private user : any;
  private merchants: any[];
  private card = new Card();
  private cards = new Array<any>();

  constructor(private cardService: CardService, 
              private loadingCtr: LoadingController, 
              private storage: Storage, 
              private barcodeScanner:BarcodeScanner,
              private router: Router,
              private platform: Platform,
              private alertController : AlertController,
              private loadingContoller: LoadingController,
              public modalController: ModalController,
              public toastController: ToastController) {}
  

  async ngOnInit() {
    this.storage.get('user').then(res => {
      this.user = res;
    });
      const loading = await this.loadingCtr.create({
        message: 'Fetching merchants'
      });
      loading.present();
      this.cardService.getMerchants().subscribe(res => {
        this.merchants = res;
        loading.dismiss();
      },async error => {
        const toast = await this.toastController.create({
          message: "can't get merchants",
          duration: 2000
        });
        toast.present();
        loading.dismiss();
      },() => {
        loading.dismiss();
      });
  }

  
  async addCard(shopName: string,website: string, imagePath:string) {
    if(this.platform.is('cordova')){
      this.barcodeScanner.scan().then(barcodeData => {
        this.saveTolocalStorage(shopName,barcodeData.text,website,imagePath);
        this.router.navigate(['home']);
      }).catch(err => {
          alert(err);
      });
    }else{
      const alert = await this.alertController.create({
        header: 'Prompt!',
        inputs: [
          {
            name: 'code',
            type: 'text',
            placeholder: 'Placeholder 1'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (alertData) => {
              this.saveTolocalStorage(shopName,alertData.code,website,imagePath);
              this.router.navigate(['home']);
            }
          }
        ]
      });
      await alert.present();
    }
  }

  addMerchant(){
    this.cardService.addMerchant("Jet","https://www.jet.co.za","imageUrlPath").subscribe(res => {
      if(res.status === 405){
        alert('Bad Request');
      }else{
        alert('Card Added!');
      }
    });
  }

  async saveTolocalStorage(shopName: string, cardNumber: string, website:string, imagePath: string) {
     this.card.cardNumber = cardNumber;
     this.card.shopName = shopName;
     this.card.website = website;
     this.card.imagePath = imagePath;
    
     const loading = await this.loadingContoller.create({
      message: 'adding card...',
      duration: 5000
    });
    loading.present();

    this.cardService.saveCard(shopName,cardNumber,this.user.Id)
    .subscribe((cardRes) => {
      this.card.id = cardRes.Id;
      this.cards.push(this.card);
      loading.dismiss();
    }, async error => {
      const toast = await this.toastController.create({
        message: "can't get cards",
        duration: 2000
      });
      toast.present()
      loading.dismiss();
    }, async () => {
      const toast = await this.toastController.create({
        message: "card added, pull to refresh!!",
        duration: 2000
      });
      toast.present()
      loading.dismiss();
    }); 
  }

  checkIfExists(card: Card,cards: Array<Card>){
    cards.forEach(element => {
      if(element.cardNumber === card.cardNumber){
        return true;
      }
    });
    return false;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
