import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  constructor(public authService: AuthService) { }
isLoading = false;
authStatusSub: Subscription;
  ngOnInit(): void {
    this.authStatusSub = this.authService.geAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form : NgForm) {
    if (form.invalid) {
     return
    }
    this.isLoading = true;
    this.authService.createUser(form.value.fName,  form.value.lName)
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
