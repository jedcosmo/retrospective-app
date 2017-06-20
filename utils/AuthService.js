export default class AuthService {  
    constructor (callback) {    
        // Configure Auth0 but check first if the Auth0Lock is already defined
        if (typeof Auth0Lock != 'undefined') { 
          console.log('no error');
          this.lock = new Auth0Lock(this.authCredentials().clientId, this.authCredentials().domain, { 
            redirect: true, 
            allowSignUp: true,
            scope: 'update:users update:users_app_metadata'
          });
          // Add callback for lock `authenticated` event    
          this.lock.on('authenticated', this._doAuthentication.bind(this, callback));    
          // binds login functions to keep this context    
          this.login = this.login.bind(this);
        } else {
          return this.authError().error;
        }
    } 

    authCredentials () {
      return {
          clientId: '0X3eg2jHjykwI8Tu49p7c3UGGk6EnSEP',
          domain: 'jifarillas.auth0.com'
      };
    }

    authAPI () {
      return {
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqSTNNRGxHTWtaQ05qTkVNa0pGUlVNMlJVSXpRa1F3TUVKR01rTkNOVVEyTVRORU1qRkNRdyJ9.eyJpc3MiOiJodHRwczovL2ppZmFyaWxsYXMuYXV0aDAuY29tLyIsInN1YiI6ImdsUFowMm9OdmVZSUN4VkVLSWJBcDBuNXMzMGFSZ3l5QGNsaWVudHMiLCJhdWQiOiJodHRwczovL2ppZmFyaWxsYXMuYXV0aDAuY29tL2FwaS92Mi8iLCJleHAiOjE0OTA4NzM4MTUsImlhdCI6MTQ5MDc4NzQxNSwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMifQ.VeRYQse1edtea0bG7dnljO_zdrpJWGqppKl6fYTFtIAq5_BI8EkoGQ0xCslEliBwMU1uYExewkc81vyNobr3xRGk04QQCZrwYOsngpXY58br6VHg11RL_hff-WiEeCZ-JXGh_bELJgD0xQJtMXl6zWSyhRglXqWDr7zU73jxYjRmdzNJ0YCJZ5hChTJU8sSDVapOn3F6NksBgCQc-41jbvuxgjA_FdWRqdyj7h0h68iREXo19F3Fh0Tdy9_YBaf5Gl5SpA6H_UfHJIXbYlxRe1F868xqWdchxE7RBlDOIK36Nx0KEz6ICO-SjvaRvqH1kHKMapcPCcUP_w-Y7LaTuQ'
      }
    }

    authError () {
        return {
            error: 1
        };
    } 

    _doAuthentication (callback, authResult) {    
        this.setToken(authResult.accessToken);
        location.reload(true);  
    } 

    login () {    
        // Call the show method to display the widget.    
        this.lock.show();  
    } 

    loggedIn () {    
        // Checks if there is a saved token and it's still valid    
        return !!this.getToken();  
    }

    setToken (idToken) {    
        // Saves user token to localStorage    
            localStorage.setItem('id_token', idToken);  
    }

    getToken () {    
        // Retrieves the user token from localStorage    
            return localStorage.getItem('id_token');  
    }

    logout () {    
        // Clear user token and profile data from localStorage    
            localStorage.removeItem('id_token');  
    }
}