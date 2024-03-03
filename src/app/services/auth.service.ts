import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Observable, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  login(user: User): Observable<Boolean> {
    return this.httpClient.get<User[]>(`${this.API_URL}/users?email=${user.email}`).pipe(
      map(exist => {
        if (exist.length === 1) {
          const userExisted = exist[0];
          return userExisted.password === user.password
        }
        return false;
      })
    );
  }

  register(user: User): Observable<Boolean> {
    return this.httpClient.get<User[]>(`${this.API_URL}/users?email=${user.email}`).pipe(
      switchMap(exist => {
        if (exist.length > 0) {
          return of(false);
        }
        else {
          return this.httpClient.post<boolean>(`${this.API_URL}/users`, user);
        }
      })
    );
  }
}
