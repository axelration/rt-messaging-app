/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { useState } from "react";
import { usei18n } from "@/hooks/language";
import { apiFetch } from "@/lib/api";
import { GlobalAlert } from "@/components/alert";
import { cn } from "@/lib/utils"
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
import { isEmailValid } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassPage() {
  const { t } = usei18n();
  if (!t) return null; // Handle case where translations are not loaded yet

  const [email, setEmail] = useState('');
  const [invalidForm, setInvalidForm] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const triggerAlert = useAlertStore((state) => state.setAlert);

  async function handleSubmit() {
    if (!isEmailValid(email)) {
      setInvalidForm(true);
      return;
    } else { setInvalidForm(false); }
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }).then((res) => {
        setAlertDialog(true);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.login_error;
      triggerAlert(t.error, errorMessage, 'destructive');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && isEmailValid(email)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    // Fullscreen centered container with light/dark background
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-300 dark:bg-gray-900">
      {/* Login form container with white/dark background, padding, rounded corners, and shadow */}
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>

            <CardHeader>
              <CardTitle>{t.forgot_password_title}</CardTitle>
              <CardDescription>
                {t.forgot_password_subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <form> */}
              <FieldGroup>
                <Field className={cn(invalidForm ? 'data-[invalid=true]:border-destructive' : '')}>
                  <FieldLabel htmlFor="email">{t.email}</FieldLabel>
                  <Input
                    className={cn(invalidForm ? 'data-[invalid=true]:border-destructive' : '')}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    onKeyDown={handleKeyDown}
                  />
                </Field>
                <FieldDescription className={cn(invalidForm ? 'text-destructive' : 'text-muted-foreground')}>
                  {invalidForm ? t.invalid_email : ''}
                </FieldDescription>
                <Field>
                  <Button onClick={() => handleSubmit()}>{t.forgot_password_button}</Button>
                </Field>
                {/* Back button to login page */}
                <Button variant="link" className="dark:text-blue-400 text-gray-600 hover:text-primary" onClick={() => (window.location.href = '/login')}>
                  <ArrowLeft className="h-4 w-4" /> {t.back_to_login}
                </Button>
              </FieldGroup>
              {/* </form> */}
            </CardContent>
          </Card>
        </div>
        {/* Success alert dialog */}
        <AlertDialog open={alertDialog} onOpenChange={setAlertDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.forgot_password_success}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.forgot_password_instructions} <br /><br /> Note: This is a development-only endpoint, so no email will actually be sent.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => (window.location.href = '/login')}>
                {t.ok}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <GlobalAlert />
      </div>
    </div>
  );
}