import { Injectable } from '@angular/core';

import { JhiEventManager } from 'ng-jhipster';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider,
    private eventManager: JhiEventManager
  ) {}

  login(credentials, callback?) {
    const cb = callback || function() {};

    return new Promise((resolve, reject) => {
      this.authServerProvider.login(credentials).subscribe(
        data => {
          this.accountService.identity(true).then(account => {
            resolve(data);
          });
          return cb();
        },
        err => {
          this.logout();
          reject(err);
          return cb(err);
        }
      );
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  logoutDirectly() {
    this.accountService.authenticate(null);
  }

  logout() {
    if (this.accountService.isAuthenticated()) {
      this.authServerProvider.logout().subscribe(() => this.accountService.authenticate(null));
    } else {
      this.accountService.authenticate(null);
    }
    this.eventManager.broadcast({
      name: 'deauthenticationSuccess',
      content: 'Sending Deauthentication Success'
    });
  }
}
