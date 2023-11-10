import decode  from 'jwt-decode';

class AuthService{
    getProfile(){
        return decode(this.getToken());
    }

    loggedIn(){
        // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token) {
        try {
          const decoded = decode(token);
          if (decoded.exp < Date.now() / 1000) {
            return true;
          } else return false;
        } catch (err) {
          return false;
        }
    }

    get    
}