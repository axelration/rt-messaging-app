'use client';
import { useState } from "react";
import { usei18n } from "@/hooks/language";
import { apiFetch } from "@/lib/api";
import { setAuthState } from "@/store/auth.store";
import { connectSocket } from "@/lib/socket";
import { cn, isEmailValid } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAlertStore } from "@/store/alert.store";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidForm, setInvalidForm] = useState(false);
  const triggerAlert = useAlertStore((state) => state.setAlert);

  // Language module
  const { t } = usei18n();
  if (!t) return null; // Handle case where translations are not loaded yet

  async function handleLogin() {
    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        if (!res || res.message !== 'OK') {
          return triggerAlert(t.error, t.something_went_wrong, 'default');
        }
        setAuthState(res);

        // Store access token in cookie for Socket.IO authentication and route protection
        document.cookie = `accessToken=${res.accessToken}; path=/`;
        document.cookie = `refreshToken=${res.refreshToken}; path=/`;

        connectSocket(res.accessToken);
      })
      // .finally(() => window.location.href = '/chat');
    } catch (err) {
      console.log('error', err);
      triggerAlert(t.error, t.login_error, 'default');
    }
  }

  // Enter key submits the form
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && isEmailValid(email) && password.length > 0) {
      e.preventDefault();
      handleLogin();
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t.login_title}</CardTitle>
          <CardDescription>
            {t.login_subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <form> */}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">{t.email}</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                onKeyDown={handleKeyDown}
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">{t.password}</FieldLabel>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  {t.forgot_password}
                </a>
              </div>
              <Input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                onKeyDown={handleKeyDown}
              />
            </Field>
            <Field>
              <Button onClick={() => handleLogin()}>{t.login_button}</Button>
            </Field>
            <FieldDescription className="text-center">
              {t.login_no_account}{' '}
              <a href="/register" className="underline hover:text-primary">
                {t.sign_up}
              </a>
            </FieldDescription>
          </FieldGroup>
          {/* </form> */}
        </CardContent>
      </Card>
    </div>
  )
}
