import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../models/position.model';

@Injectable({ providedIn: 'root' })
export class PositionService {
  private baseUrl = 'https://localhost:5001/api/Positions';

  constructor(private http: HttpClient) {}

  getPositionFromId(id: number): Observable<Position> {
    return this.http.get<Position>(`${this.baseUrl}/${id}`);
  }

  getall():Observable<Position[]>{
      return this.http.get<Position[]>(`${this.baseUrl}`);
    }

}
