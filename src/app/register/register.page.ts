import { Component, OnInit } from '@angular/core';
import { IUser } from '../User';
import {Storage} from '@ionic/storage';
import { LoadingController } from '@ionic/angular';
import { UserService } from '../services/UserService';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  private email : string;
  private password : string;
  private confirmPassword : string;
  private errMessage: string;
  constructor(private storage: Storage, 
              private loadingController: LoadingController,
              private authService: UserService,
              public router: Router) { }

  ngOnInit() {
  }

  Register(){
    if(this.email && this.password && this.confirmPassword){
      if(this.password.trim().toLocaleLowerCase() === this.confirmPassword.trim().toLocaleLowerCase()){
        this.registerUser(this.email, this.password);
      }else{
        alert("Passwords do not match");
      }
    }
  }

   async registerUser(email,password){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        email: JSON.stringify(this.email)
      }
    };
    const loading = await this.loadingController.create({
      message: 'Registering user...'
    });
    loading.present();
    this.authService.registerUser(email,email,null,password)
    .subscribe(
      (obj) => {
        if(this.CheckToken(obj)){
          loading.dismiss();
          this.storage.set('token', obj);
          this.router.navigate(['home'], navigationExtras);
        }else{
          loading.dismiss();
          alert(obj.Errors[0]);
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

  
}
