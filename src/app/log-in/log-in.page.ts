import { Component, OnInit } from '@angular/core';
import { IUser } from '../User';
import { UserService } from '../services/UserService';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  private email : string;
  private password : string;
  private confirmPassword : string;
  private errMessage: string;
  private user = new IUser();

  constructor(private authService: UserService ,
              private loadingController: LoadingController,
              public router: Router, 
              private storage: Storage,
              private toast: ToastController) { }

  
  ngOnInit() {
  }

  async LogIn(){
    const loading = await this.loadingController.create({
      message: 'logging in...'
    });
    loading.present();
    this.authService.Login(this.email, this.password)
    .subscribe(
      (token) => {
        if(this.CheckToken(token)){
          loading.dismiss();
          this.getAndStoreToken(token);
          this.router.navigate(['home']);
        }else{
          this.toast.create({
            message: 'email or password is incorrect',
            duration: 2000
          });
        }
    },
      (err: any) => {
        console.log(err);
        this.errMessage = 'Server not found';
        loading.dismiss();
      },
      () => {
        console.log('Registration done!');
        loading.dismiss();
      }
    );
  }

  CheckToken(token: any) {
    if(token.Errors)
      return false;
    else
      return true
  }
  getAndStoreToken(token:any){
    this.storage.set('token', token);
    this.user.Email = this.email;
    this.user.password = this.password;
    this.storage.set('user', this.user);
  }

}
