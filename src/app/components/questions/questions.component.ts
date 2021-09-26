import { Component, EventEmitter, Input, Output, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
// import { AuthService } from '../auth/auth.service';
import { Questions } from '../models/questions.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import simple from "../../../assets/simpleexam.json";
import { CountdownEvent, CountdownModule } from 'ngx-countdown';

// Ibrahim Code
const browser = <any>navigator;

browser.getUserMedia = (browser.getUserMedia ||
  browser.webkitGetUserMedia ||
  browser.mozGetUserMedia ||
  browser.msGetUserMedia);

declare const MediaRecorder;


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  private url: string = 'http://localhost:8080';
  videoSaved;

  // stepper

  isLinear = true;
  FreeText: FormGroup;
  select: FormGroup;
  formPasswordGroup: FormGroup;
  formEmailGroup: FormGroup;
  formPhoneGroup: FormGroup;

  

  // Ibrahim code

  @Input() isSaving;
  @Input() timeout = 15 * 60000; // in ms
  @Input() minLength = 10000; // in ms
  @Input() playerOptions: MediaStreamConstraints = {
    audio: true,
    video: { width: 320, height: 240 }
  };
  @Input() recorderOptions = { mimeType: 'video/webm' };

  @Output() save = new EventEmitter();
  @ViewChild('recordVideo') video: { nativeElement: HTMLVideoElement };
  @ViewChild('downloadLink') downloadLink2: ElementRef;

  mediaRecorder;
  stream: MediaStream;
  recordedChunks = [];

  isRecording;
  blob: Blob;

  timer;
  startTime: Date;
  timePassed;
  downloadLinkToServer;
  recordVideoElement;
  // Ibrahim Code
  downloadLink;

  userId;
  simple: any[] = [];
  simpleList: [] = simple;




  constructor(public router: ActivatedRoute, private routers: Router, config: NgbCarouselConfig, private fb: FormBuilder, private http: HttpClient, private authServ: AuthService) {
    this.createForm();
    config.interval = 0;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {

    //   this.authServ.getJSON().subscribe(data => {      

    //     this.simple = data;
    //     console.log(this.simple);
    // });

    this.start();

    // Get Team
    this.router.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId = paramMap.get('userId');
    });
  }

  // Ibrahim Code
  async start() {
    if (this.isRecording) {
      this.stop();
    }

    try {

      this.blob = null;
      this.stream = await browser.mediaDevices.getUserMedia(this.playerOptions);
      this.video.nativeElement.srcObject = this.stream;
      this.mediaRecorder = new MediaRecorder(this.stream, this.recorderOptions);
      this.recordedChunks = [];
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => this.onStop();
      this.mediaRecorder.start();
      this.video.nativeElement.play();

      this.startTimer();

      this.isRecording = true;
    } catch (e) {
      // show error feedback
    }

  }

  stop() {
    if (!this.isRecording) {
      return;
    }

    this.mediaRecorder.stop();
    this.stream.getTracks().forEach(track => track.stop());
  }

  convertFileToBase64(): void {
    let base64;
    let reader = new FileReader();
    reader.readAsDataURL(this.blob as Blob);
    reader.onloadend = () => {
      base64 = reader.result as string;
      // console.log('base64', base64);
      //pure base64
      let myBase64 = base64.replace("data:video/webm;base64,", "");
      // console.log('myBase64', myBase64);
      this.videoSaved = myBase64;
      // console.log(this.videoSaved);
    }
  }


  onStop() {
    this.isRecording = false;
    this.stopTimer();

    // if (this.timePassed > this.minLength) {
    this.blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    this.recordedChunks = [];
    // }

    this.video.nativeElement.srcObject = undefined;
    if (this.video.nativeElement.src) {
      URL.revokeObjectURL(this.video.nativeElement.src);

    }
    this.video.nativeElement.src = URL.createObjectURL(this.blob);
    this.convertFileToBase64();
    // this.downloadLink2.nativeElement.href = URL.createObjectURL(this.blob);
    // this.downloadLink2.nativeElement.download = this.downloadLink2.nativeElement.href;

    //  this.downloadLinkToServer = 'blob:'+this.downloadLink2.nativeElement.href;


  }


  startTimer() {
    this.startTime = new Date();
    this.timePassed = new Date().getTime() - this.startTime.getTime();
    this.timer = setInterval(() => {
      requestAnimationFrame(() => {
        this.timePassed = new Date().getTime() - this.startTime.getTime();
        this.checkTimeout();
      });
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  checkTimeout() {
    if (this.timePassed >= this.timeout) {
      this.stop();
    }
  }

  submit() {
    this.stop();
    this.onSubmit();
  }

  onSubmit() {


    // wait for blob to be saved
    setTimeout(() => {
      if (this.blob) {
        let body = {
          name: this.userId,
          base64: this.videoSaved
        };

        this.authServ.createFirstVideo(body);

      } else {
        this.onSubmit();
      }
    }, 200);
  }

  // Ibrahim Code



  onAddAnswers(answersForm: NgForm) {
    this.routers.navigate(["/thanks", this.userId]);
  }



  ngOnDestroy() {

  }


  createForm() {
    this.FreeText = this.fb.group({
      userName: ['', Validators.required]
    });

    this.select = this.fb.group({
      userName: ['', Validators.required]
    });

    this.formPasswordGroup = this.fb.group({
      passWord: ['', Validators.required]
    });
    this.formEmailGroup = this.fb.group({
      emailID: ['', Validators.compose([Validators.required, Validators.email])]
    });
    this.formPhoneGroup = this.fb.group({
      mobile: ['', Validators.compose([Validators.required, Validators.min(10)])]
    });
  }

  handleEvent(e: CountdownEvent) {
    if (e.action == 'done') {
      console.log('time finish');
    this.submit();
    }
  }

}
