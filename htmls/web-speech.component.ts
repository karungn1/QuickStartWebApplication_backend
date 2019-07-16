import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SpeechRecognizerService } from './shared/services/speech-recognizer.service';

import { SpeechNotification } from './shared/model/speech-notification';
import { SpeechError } from './shared/model/speech-error';
import { ActionContext } from './shared/model/strategy/action-context';
import { CmdExecutorService } from './../cmd-executor.service';

@Component({
  selector: 'wsa-web-speech',
  templateUrl: './web-speech.component.html',
  styleUrls: ['./web-speech.component.css']
})
export class WebSpeechComponent implements OnInit {

  finalTranscript = '';
  recognizing = false;
  notification: string;
  languages: string[] =  ['en-US', 'es-ES'];
  currentLanguage: string;
  actionContext: ActionContext = new ActionContext();

  constructor(private changeDetector: ChangeDetectorRef,
			  private speechRecognizer: SpeechRecognizerService,
			  private cmdExecutorService: CmdExecutorService) { }

  ngOnInit() {
    this.currentLanguage = this.languages[0];
	this.speechRecognizer.initialize(this.currentLanguage);
	this.speechRecognizer.start(new Date());
    this.initRecognition();
    this.notification = null;
  }

  startButton(event) {
    if (this.recognizing) {
      this.speechRecognizer.stop();
      return;
    }

    this.speechRecognizer.start(event.timeStamp);
  }

  onSelectLanguage(language: string) {
    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage);
  }

  private initRecognition() {
    this.speechRecognizer.onStart()
      .subscribe(data => {
        this.recognizing = true;
        this.notification = 'I\'m listening...';
        this.detectChanges();
      });

    this.speechRecognizer.onEnd()
      .subscribe(data => {
        this.recognizing = false;
        this.detectChanges();
        this.notification = null;
      });

	  var cmd: any = {};
	  var cmdDecoder: any = [{"key":"create", "value":"create new project"},
	  						  {"key":"page", "value":"add new page"},
	 						  {"key":"user", "value":"add input field with label user name"},
							  {"key":"password", "value":"add input field with label password"},
							  {"key":"login", "value":"add button with label login"},
							  {"key":"reset", "value":"add button with label reset"},
							  {"key":"email", "value":"change label of first input field to email"},
							  {"key":"middle", "value":"justify content to middle"},
							  {"key":"revert", "value":"revert previous change"},
							  {"key":"one", "value":"change theme one"},
							  {"key":"1", "value":"change theme one"},
							  {"key":"two", "value":"change theme two"},
							  {"key":"2", "value":"change theme two"},
							  {"key":"three", "value":"change theme three"},
							  {"key":"3", "value":"change theme three"},
							  {"key":"four", "value":"change theme four"},
							  {"key":"4", "value":"change theme four"},
							  {"key":"commit", "value":"commit the changes"},];
    this.speechRecognizer.onResult()
      .subscribe((data: SpeechNotification) => {
		var message = data.content.trim().toLowerCase();
        if (data.info === 'final_transcript' && message.length > 0) {
			for(var i=0; i<cmdDecoder.length; i++){
				if(message.includes(cmdDecoder[i].key)){
					message = cmdDecoder[i].value;
				}
			}
          this.finalTranscript = `${this.finalTranscript}\n${message}`;
          this.actionContext.processMessage(message, this.currentLanguage);
          this.detectChanges();
		  this.actionContext.runAction(message, this.currentLanguage);
		  console.log("cmd:::", message);
		  cmd = {"cmd":message};
		  this.cmdExecutorService.appendCmd(cmd).subscribe((res) => {
			  console.log("res::",res);
		  });
        }
      });

    this.speechRecognizer.onError()
      .subscribe(data => {
        switch (data.error) {
          case SpeechError.BLOCKED:
          case SpeechError.NOT_ALLOWED:
            this.notification = `Cannot run the demo.
            Your browser is not authorized to access your microphone. Verify that your browser has access to your microphone and try again.
            `;
            break;
          case SpeechError.NO_SPEECH:
            this.notification = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.NO_MICROPHONE:
            this.notification = `Microphone is not available. Plese verify the connection of your microphone and try again.`;
            break;
          default:
            this.notification = null;
            break;
        }
        this.recognizing = false;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.changeDetector.detectChanges();
  }

  createApplication(){
	var cmd = {"cmd":"create"};
	this.cmdExecutorService.appendCmd(cmd).subscribe((res) => {
		console.log("res::",res);
	});
  }
}
