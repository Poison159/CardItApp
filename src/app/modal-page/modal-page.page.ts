import { Component, OnInit } from '@angular/core';
import { Card } from '../Card';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import {Storage} from '@ionic/storage';
import { CardService } from '../services/CardService';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {
  cardId: number;
  cards = new Array<Card>();
  constructor(public modalController: ModalController,
    private storage: Storage,
    public loadingController: LoadingController,
    private cardService: CardService,
    public toastController: ToastController ) { }

  ngOnInit() {
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  async delete(cardId:number){ // returned list will be new cards
    const loading = await this.loadingController.create({
      message: 'Removing card...'
    });
      this.storage.get('user').then((user) => {
        if(user){
          loading.present();
          this.cardService.removeCard(cardId,user.Email).subscribe(async res => {
            const toast = await this.toastController.create({
              message: "Card removed, Pull down to refresh!",
              duration: 2000
            });
            toast.present();
            loading.dismiss();
            loading.dismiss();
          },async error => {
            const toast = await this.toastController.create({
              message: "Card can't be removed",
              duration: 2000
            });
            toast.present();
            loading.dismiss();
          },() => {
            loading.dismiss();
          });
        }else{
          alert('user not found')
        }  
      });
    this.dismiss();
  }

}
