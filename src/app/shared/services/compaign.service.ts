import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaignService {

  constructor(private http: HttpClient) { }

  createСampaign(body) {
    const httpHeadersWithCT = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'campaign', body, { headers: httpHeadersWithCT });
  }

  updateСampaign(id, body) {
    const httpHeadersWithCT = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.put(SERVER_API_URL + 'campaign/' + id, body, { headers: httpHeadersWithCT });
  }

  deleteСampaign(body) {
    const deleteOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
        'x-auth-user': localStorage.getItem('userID')
      }),
      body: body
    };
    return this.http.delete(SERVER_API_URL + 'campaign', deleteOptions);
  }

  getСampaignById(id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'campaign/' + id, { headers: httpHeaders });
  }

  getСampaignsBrands(id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'campaign/all/' + id, { headers: httpHeaders });
  }
}
