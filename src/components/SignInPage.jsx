import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/dist/StyledFirebaseAuth';

export default function SignInPage() {

  const configObj = {
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      {
        provider: EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true
      }
    ],
    signInFlow: 'popup',
    credentialHelper: 'none',
    callbacks: {
      signInSuccessWithAuthResult: () => {
        return false;
      }
    }
  };

  return (
    <main className="form-main">
      <section className="card">
        <h1>Sign In</h1>

        <StyledFirebaseAuth.default
          firebaseAuth={getAuth()}
          uiConfig={configObj}
        />
      </section>
    </main>
  );
}