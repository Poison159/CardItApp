import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { IUser } from '../User';
import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';


@Injectable()
export class UserService {

    private localUrl              = 'https://Carditweb.conveyor.cloud';
    private _localRegisterUrl     = this.localUrl + '/api/RegisterUser';
    private _localLoginUrl        = this.localUrl + '/api/CheckToken';
    private _localUserDataUrl     = this.localUrl + '/api/UserData';

    constructor(private _http: HttpClient, private storage: Storage){}

    registerUser(name , email, mobileNumber, password): Observable<any> {
        console.log('Registering user .....');
        return this._http.get<any>(this._localRegisterUrl + '?name=' + name + '&email='
        + email + '&mobileNumber=' + null + '&password=' + password);
    }

    Login(email: string,password: string) : Observable<boolean> {
      return this._http.get<boolean>(this._localLoginUrl + '?email=' + email + '&password=' + password) ;
    }

    getUserData(){
        const email = '';
        this.storage.get('user').then((res: IUser) =>{
            this._http.get<any>(this._localUserDataUrl + '?email')
        });
    }

}
