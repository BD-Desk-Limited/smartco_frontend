// Keeps the pending MFA challenge between the login / sign-up page and the verify page.
// sessionStorage: cleared when the tab closes; the challenge itself expires server-side.
const KEY = 'mfa-challenge';
const LEGACY_KEYS = ['userId', 'email', 'trustedDevice', 'verification-purpose'];

export const saveMfaChallenge = (data, purpose) => {
  try {
    LEGACY_KEYS.forEach((key) => sessionStorage.removeItem(key));
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        challengeId: data?.challengeId,
        method: data?.method,
        methods: data?.methods || ['email'],
        destination: data?.destination || null,
        question: data?.question || null,
        codeExpiresAt: data?.codeExpiresAt || null,
        purpose,
      })
    );
  } catch (error) {
    console.error('Could not store MFA challenge:', error);
  }
};

export const loadMfaChallenge = () => {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    return value?.challengeId ? value : null;
  } catch {
    return null;
  }
};

export const clearMfaChallenge = () => {
  try {
    sessionStorage.removeItem(KEY);
    LEGACY_KEYS.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    // ignore
  }
};
