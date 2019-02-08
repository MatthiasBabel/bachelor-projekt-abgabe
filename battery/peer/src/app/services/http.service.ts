import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';



const httpOptions = {
  //evtl noch Access Control hinzufuegen
  headers: new HttpHeaders({
  'Content-Type':'application/x-www-form-urlenceded',
}),
};
@Injectable()
export class HttpService {
  url: string = 'http://127.0.0.1:8081';
  constructor( private http: HttpClient) { }

  sendData(data: any)
  {
    return this.http.post(this.url, data, httpOptions)
    .pipe(
      catchError(val => of('I caught: ' + val))
    );
  }
}
