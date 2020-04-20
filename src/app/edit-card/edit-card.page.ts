import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/CardService';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.page.html',
  styleUrls: ['./edit-card.page.scss'],
})
export class EditCardPage implements OnInit {
  private id: number;
  private CardNumber: string;
  private merchantId: number;
  private userId:number; 

  constructor(private cardService: CardService, 
    private loadingContoller: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.id= params.id;
          this.userId= params.userId;
          this.merchantId= params.merchantId;
          this.CardNumber= JSON.parse(params.CardNumber);
        }
      });

     }
  ngOnInit() {
  }

  async edit(){
    const loading = await this.loadingContoller.create({
      message: 'editing card ...',
      duration: 5000
    });
    this.cardService.editCard(this.id, this.userId, this.merchantId, this.CardNumber)
    .subscribe(async res => {
      loading.dismiss();
      const toast = await this.toastController.create({
        message: "Done! Refresh to see change.",
        duration: 2000
      });
      toast.present();
      this.router.navigate(['home']);
    }, async error => {
      const toast = await this.toastController.create({
        message: "can't edit card",
        duration: 2000
      });
      toast.present();
      loading.dismiss();
    },() => {
      loading.dismiss();
    });
  }
}
