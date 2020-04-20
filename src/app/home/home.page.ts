import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { CardService } from '../services/CardService';
import {Storage} from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private email: string;
  private temp:any;
  private user: any;
  private cards = new Array<any>();
  private merchants = new Array<any>();
  constructor(private router: Router,
    public modalController: ModalController, 
    private cardService: CardService, 
    public loadingController: LoadingController,
    private storage: Storage,
    public route: ActivatedRoute,
    private barcodeScanner:BarcodeScanner,
    public toastController: ToastController) 
    { 
      this.route.queryParams.subscribe(params => {
        if (params && params.email) {
          this.email = JSON.parse(params.email);
        }
      });
    }
  
  async ngOnInit() {    
    this.storage.get('user').then(user => {
      this.user = user;
    });
    this.getCardsAndShowLoading();
  }


  async getCardsAndShowLoading(){
    
    if(this.email || this.user !== null){
      const loading = await this.loadingController.create({
        message: 'Fetching cards...',
        duration: 5000
      });
      loading.present();
      if(this.user !== null){
        this.temp = this.user.Email;
      }else{
        this.temp = this.email;
      }
      this.cardService.getCards(this.temp).subscribe(res => {
        this.cards = res.Cards;
        this.merchants = res.Merchants;
        this.storage.set('user',res.User)
        loading.dismiss();
      }, async error => {
        const toast = await this.toastController.create({
          message: "can't get cards",
          duration: 2000
        });
        toast.present();
        loading.dismiss();
      },() => {
        loading.dismiss();
      });
    }else{
      const toast = await this.toastController.create({
        message: "can't get cards",
        duration: 2000
      });
      toast.present();
    }
  }

  async presentModal(cardId: number) {
    const modal = await this.modalController.create({
      component: ModalPagePage,
      componentProps: {
        cardId: cardId
      }
    });
    return await modal.present();
  }

  clearCards(){
    this.storage.clear();
    this.router.navigate(['landing']);
  }

  addCard(){
    this.router.navigate(['add-card']);
  }

  encodeText(cardNumber: number){
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,cardNumber).then((encodedData) => {
        alert(encodedData);
      }, (err) => {
          console.log("Error occured : " + err);
          alert('error encodind')
      });                 
  }

  goToEdit(id:number){
    let card = this.cards.find(x => x.Id == id);
    if(card){
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: card.Id,
          merchantId: card.merchantId,
          userId:card.userId,
          CardNumber: card.CardNumber
        }
      };
      this.router.navigate(['edit-card'],navigationExtras);
    }else{
      alert('card not found');
    }
    
  }

  doRefresh(event) {
      this.getCardsAndShowLoading();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
}
