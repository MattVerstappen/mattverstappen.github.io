(function(){
    function getEl(id){ return document.getElementById(id); }

    function friendlyAuthError(code) {
        switch (code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password': return 'Invalid email or password. Please try again.';
            case 'auth/invalid-email':  return 'Please enter a valid email address.';
            case 'auth/user-disabled':  return 'This account has been disabled. Please contact support.';
            case 'auth/too-many-requests': return 'Too many failed attempts. Please wait and try again.';
            default: return 'Login failed. Please check your credentials and try again.';
        }
    }

    function renderByAuth() {
        const authed = localStorage.getItem('sms-admin-auth') === 'true';
        const email  = localStorage.getItem('sms-admin-email');

        const loginCard = getEl('login-form');
        const authedCard = getEl('logged-in-state');
        const editor = getEl('admin-content-editor');

        if (!loginCard || !authedCard || !editor) return;

        if (authed && email) {
            loginCard.style.display = 'none';
            authedCard.style.display = 'block';
            editor.style.display = 'block';
        } else {
            loginCard.style.display = 'block';
            authedCard.style.display = 'none';
            editor.style.display = 'none';
        }
    }

    function initAuthUI() {
        const form = getEl('loginForm');
        const errorBox = getEl('login-error');
        const errorMsg = getEl('error-message');
        const btn = getEl('signin-btn');
        const signOutBtn = getEl('sign-out-btn');

        if (!form || !btn || !signOutBtn) return;

        // Initial render
        renderByAuth();

        // React to storage changes from cms.js onAuthStateChanged
        window.addEventListener('storage', (e) => {
            if (e.key === 'sms-admin-auth' || e.key === 'sms-admin-email') {
                renderByAuth();
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!window.cms?.signIn) return;

            const email = /** @type {HTMLInputElement} */(getEl('email')).value.trim();
            const password = /** @type {HTMLInputElement} */(getEl('password')).value;

            const original = btn.textContent;
            btn.textContent = 'Signing in…';
            btn.disabled = true;
            if (errorBox) errorBox.style.display = 'none';

            try {
                await window.cms.signIn(email, password);
                // cms.js onAuthStateChanged will update localStorage; storage listener will re-render
            } catch (err) {
                console.error('Login error:', err);
                if (errorMsg && errorBox) {
                    errorMsg.textContent = friendlyAuthError(err?.code);
                    errorBox.style.display = 'block';
                }
                btn.textContent = original;
                btn.disabled = false;
            }
        });

        signOutBtn.addEventListener('click', async () => {
            try { await window.cms?.signOut?.(); }
            catch (e) { console.error('Sign out error:', e); }
            finally { renderByAuth(); }
        });
    }

    // Wait until includes load (cms is initialized after includes in your setup)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthUI);
    } else {
        initAuthUI();
    }
})()