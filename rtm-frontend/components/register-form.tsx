'use client';
import { useState } from "react";
import { usei18n } from "@/hooks/language";
import { apiFetch } from "@/lib/api";
import { cn, isEmailValid } from "@/lib/utils"
import { z } from "zod";
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
import { ArrowLeft, Check, CheckCircle, Eye, EyeClosed, XCircle } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [alertDialog, setAlertDialog] = useState(false);
  const [invalidFormEmail, setInvalidFormEmail] = useState(false);
  const [invalidFormUsername, setInvalidFormUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const triggerAlert = useAlertStore((state) => state.setAlert);

  // Password validation checklist values
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);
  const [passwordLowercaseValid, setPasswordLowercaseValid] = useState(false);
  const [passwordUppercaseValid, setPasswordUppercaseValid] = useState(false);
  const [passwordNumberValid, setPasswordNumberValid] = useState(false);
  const [passwordSpecialCharValid, setPasswordSpecialCharValid] = useState(false);

  // Language module
  const { t } = usei18n();
  if (!t) return null; // Handle case where translations are not loaded yet

  // Password validation watcher - checks password validity on every change and updates checklist values
  function passwordChecker(password: string) {
    const lengthValid = password.length >= 6;
    const lowercaseValid = /[a-z]/.test(password);
    const uppercaseValid = /[A-Z]/.test(password);
    const numberValid = /[0-9]/.test(password);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    setPasswordLengthValid(lengthValid);
    setPasswordLowercaseValid(lowercaseValid);
    setPasswordUppercaseValid(uppercaseValid);
    setPasswordNumberValid(numberValid);
    setPasswordSpecialCharValid(specialCharValid);
  }

  async function handleRegister() {
    setLoading(true);
    // Form validation
    const emailInvalid = !isEmailValid(email);
    const passwordInvalid = !passwordLengthValid || !passwordLowercaseValid || !passwordUppercaseValid || !passwordNumberValid || !passwordSpecialCharValid;
    const usernameInvalid = username.length < 3;
    setInvalidFormEmail(emailInvalid);
    setInvalidFormUsername(usernameInvalid);

    if (emailInvalid || passwordInvalid || usernameInvalid) {
      setLoading(false);
      return
    }

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, username }),
      }).then((res) => {
        setLoading(false);
        if (!res) {
          return triggerAlert(t.error, t.something_went_wrong, 'default');
        }
        return setAlertDialog(true);
      })
    } catch (err: unknown) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage !== '' || errorMessage !== undefined) {
        triggerAlert(t.error, errorMessage, 'default');
      } else {
        triggerAlert(t.error, t.register_error, 'default');
      }
    }
  }

  // Enter key submits the form
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRegister();
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t.register_title}</CardTitle>
          <CardDescription>
            {t.register_subtitle}
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
              {/* Error message for invalid email */}
              {invalidFormEmail ? (
                <FieldDescription className="text-destructive">
                  {t.invalid_email}
                </FieldDescription>
              ) : null}
            </Field>
            <Field>
              <FieldLabel htmlFor="username">{t.username}</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder={t.register_placeholder_username}
                onChange={(e) => setUsername(e.target.value)}
                required
                onKeyDown={handleKeyDown}
              />
              {invalidFormUsername ? (
                <FieldDescription className="text-destructive">
                  {t.invalid_username}
                </FieldDescription>
              ) : null}
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">{t.password}</FieldLabel>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.register_placeholder_password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    passwordChecker(e.target.value);
                  }}
                  required
                  onKeyDown={handleKeyDown}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="link"
                  className="absolute right-2 top-1/2 -translate-y-1/2 dark:text-blue-400 text-gray-600 hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </Button>
              </div>
              {/* Password strength checklist */}
              <ul className="list-none">
                <li className={`${passwordLengthValid ? "text-primary dark:text-gray-400" : "text-destructive"} transition-colors duration-400 ease-in-out flex items-center gap-2`}>
                  {passwordLengthValid ? <CheckCircle /> : <XCircle />} {t.password_requirement_length}
                </li>
                <li className={`${passwordLowercaseValid ? "text-primary dark:text-gray-400" : "text-destructive"} transition-colors duration-400 ease-in-out flex items-center gap-2`}>
                  {passwordLowercaseValid ? <CheckCircle /> : <XCircle />} {t.password_requirement_lowercase}
                </li>
                <li className={`${passwordUppercaseValid ? "text-primary dark:text-gray-400" : "text-destructive"} transition-colors duration-400 ease-in-out flex items-center gap-2`}>
                  {passwordUppercaseValid ? <CheckCircle /> : <XCircle />} {t.password_requirement_uppercase}
                </li>
                <li className={`${passwordNumberValid ? "text-primary dark:text-gray-400" : "text-destructive"} transition-colors duration-400 ease-in-out flex items-center gap-2`}>
                  {passwordNumberValid ? <CheckCircle /> : <XCircle />} {t.password_requirement_number}
                </li>
                <li className={`${passwordSpecialCharValid ? "text-primary dark:text-gray-400" : "text-destructive"} transition-colors duration-400 ease-in-out flex items-center gap-2`}>
                  {passwordSpecialCharValid ? <CheckCircle /> : <XCircle />} {t.password_requirement_special}
                </li>
              </ul>
            </Field>
            <Field>
              <Button onClick={() => handleRegister()} disabled={loading}>
                {loading ? <Spinner /> : null}
                {t.register_button}
              </Button>
            </Field>
            {/* Back button to login page */}
            <Button variant="link" className="dark:text-blue-400 text-gray-600 hover:text-primary" onClick={() => (window.location.href = '/login')}>
              <ArrowLeft className="h-4 w-4" /> {t.back_to_login}
            </Button>
          </FieldGroup>
          {/* </form> */}
        </CardContent>
      </Card>
      {/* Success alert dialog */}
      <AlertDialog open={alertDialog} onOpenChange={setAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.success}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.register_success}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => (window.location.href = '/login')}>
              {t.ok}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
