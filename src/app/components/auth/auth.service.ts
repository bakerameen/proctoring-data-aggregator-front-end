import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = '';
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private playersUpdated = new Subject<AuthData[]>();
  private userCredential = new Subject<any>();
  private tokenTimer: any;
  private userId: string;
  private userName: string;
  private playersNew: AuthData[] = [];
  animatedd: string;
  private disableAniamtion;


  private answerUpdate = new Subject<any>();
  private animationUpdate = new Subject<any>();
  private disableAniamtionUpdate = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) { }

  // auth functions
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  geAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    const autInformation = this.getAuthData();
    if (!autInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = autInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = autInformation.token;
      this.isAuthenticated = true;
      this.userId = autInformation.userId;
      this.userName = autInformation.userName;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userName: userName
    }

  }


  private saveAuthData(token: string, expirationDate: Date, userId: string, userName: string) {
    // localstorage api we can access
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);

  }

  private clearAuthdata() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }


  private setAuthTimer(duration: number) {

    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }


  getuserId() {
    return this.userId;
  }

  getUserName() {
    return this.userName;
  }
  // user funcions

  createUser(fName: string,  lName: string) {
    const authData: AuthData = { fName: fName, lName: lName };
    this.router.navigate(["/questions", fName + lName]);
    // this.http.post(this.url + '/api/user/signup', authData)
    //   .subscribe(response => {

    //   }, error => {
    //     this.authStatusListener.next(false);
    //   });
  }

  login(email: string, password: string) {
    // const authData: AuthData = { email: email, password: password, name: null }
    // this.http.post<{ token: string, expiresIn: number, userID: string, name: string }>(this.url + '/api/user/login', authData).subscribe(response => {
    //   // console.log(response);
    //   const token = response.token;
    //   this.token = token;
    //   if (token) {
    //     const expiresInDuration = response.expiresIn;
    //     this.setAuthTimer(expiresInDuration);
    //     this.isAuthenticated = true;
    //     this.userId = response.userID;
    //     this.userName = response.name;
    //     this.authStatusListener.next(true);
    //     const now = new Date;
    //     const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
    //     this.saveAuthData(token, expirationDate, this.userId, this.userName);
    //     this.router.navigate(["/match"]);
    //   }

    // }, error => {
    //   this.authStatusListener.next(false);
    // });
  }

  logOut() {
    this.router.navigate(['/login']);
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.userName = null;
    this.clearAuthdata();

  }


  getPlayerUpdateListener() {
    return this.playersUpdated.asObservable();
  }

  getPlayers() {
    this.http.get<{ message: string, users: any }>(this.url  + '/api/user/users').subscribe((players) => {
      const playersArray = players.users;
      this.playersNew = playersArray;
      this.playersUpdated.next([...this.playersNew]);
    });
  }



  // Answer Start



  

  
  getVideo(base64) {   
     // const authData = { fName: "baqer"};
  this.http.post<{message: string; videoId: null}>(this.url + '/api/video', base64)
      .subscribe(response => {
        console.log(response.message);
      });

  }

  

  //  asObservable
  getAnswerUpdateListener() {
    return this.answerUpdate.asObservable();
  }

  getAnimationUpdateListener() {
    return this.animationUpdate.asObservable();
  }

  getdisbaleListener() {
    return this.disableAniamtionUpdate.asObservable();
  }


  // Answer End

  createSecondVideo(body) {
    this.http.post(this.url + '/api/video/complex', body).subscribe( res => {
      this.router.navigate(["/"]);
    });
  }


  // createFirstVideo
  createFirstVideo(body) {
    this.http.post<{message: string, name: string}>(this.url + '/api/video/simple', body).subscribe( res => {
      
      this.router.navigate(["/complex", res.name]);
      
      
    });
  }


}
