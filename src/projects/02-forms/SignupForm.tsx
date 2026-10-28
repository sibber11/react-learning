import { useState } from 'react'

// YOUR TURN. Implement the TODOs: validate, handleBlur, handleSubmit, showError.
// handleChange and the JSX are done for you. Read handleChange first.
//
// Vue:   v-model="form.email" + a watch() that fills an errors object
// React: value + onChange per input, and errors DERIVED from values on every render.
//
// Rules for yourself:
//   1. `errors` is computed in render by calling validate(values). No useState for errors,
//      no useEffect to "run validation when values change". Derived state is free and
//      can never be out of sync.
//   2. Never mutate state objects. Build new ones: { ...prev, [name]: value }.
//   3. The submit button stays ENABLED. Disabled-until-valid hides why the form won't submit.
//      Instead, submitting an invalid form reveals every error and does not submit.
//
// Rules for validation (error messages are up to you):
//   - email:    must look like an email (contains @ and a dot after it is enough)
//   - password: at least 8 characters and at least one digit
//   - confirm:  must equal password
//   - agree:    must be checked
//
// Done when:
//   - An error for a field appears only after that field was blurred OR a submit was attempted.
//   - Typing in `password` while `confirm` is already filled updates confirm's error at once
//     (this should come for free from derived errors; if it doesn't, something is wrong).
//   - Valid submit: shows "Welcome, <email>" (see `submitted` below) and clears the form.
//   - Invalid submit: shows all errors, shows no welcome message.

type Values = {
  email: string
  password: string
  confirm: string
  agree: boolean
}

type Errors = Partial<Record<keyof Values, string>>

const initialValues: Values = { email: '', password: '', confirm: '', agree: false }

const emailRegex = /^\S+@\S+\.\S+$/

// Pure function: values in, errors out. Empty object means valid.
// Keep it outside the component. It needs no state and is trivial to unit test later.
function validate(values: Values): Errors {
  const hasEmailError = !values.email.match(emailRegex)
  const hasDigit = !!values.password.match(/\d+/)
  
  const hasChar = !!values.password.match(/[A-Za-z]+/)
  
  const minEight = values.password.length < 8;
  const isSame = values.password === values.confirm

  let passError = '';

  if (minEight) {
    passError = 'min 8 chars'
  } else if (!hasDigit){
    passError = 'at least one number is required'
  } else if ( !hasChar) {
    passError = 'alleast one char is required'
  }
  let errorObject: Errors = {};

  if (hasEmailError) {
    errorObject.email = 'wrong email'
  }
  if (passError) {
    errorObject.password = passError
  }
  if (!values.agree) {
    errorObject.agree = 'please agree to terms'
  }
  if (!isSame){
    errorObject.confirm = 'must match'
  }
  return errorObject
}

export function SignupForm() {
  const [values, setValues] = useState<Values>(initialValues)
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [submitted, setSubmitted] = useState<string | null>(null)
  // Hint: "a submit was attempted" needs to be remembered somewhere. Your design:
  // one more useState, or mark every field as touched on submit. Pick one and be ready to say why.
  // no more useState touched is enough, the fewer the state the fewer the hassle
  const errors = validate(values) // derived on every render

  // One handler for every input, keyed by the input's `name` attribute.
  // Checkbox carries its value in `checked`, the others in `value`.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = e.target
    setValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const {name} = e.target
    setTouched((prev => ({...prev, [name]: true})))
  }

  const hasError = Object.entries(errors).filter((v)=> v[1] !== '').map(v=>v[0])
  
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(null);
    if (hasError.length > 0) {
      setTouched({
        email: true,
        password: true,
        confirm: true,
        agree: true
      })
      return
    }
    setSubmitted(values.email);
    setValues(initialValues)
    setTouched({})
  }

  function showError(field: keyof Values): string | undefined {
    if (touched[field]) {
      return errors[field];
    }
    return undefined
  }

  return (
    <section>
      <h2>Sign up</h2>

      {/* noValidate turns off the browser's own popups so your errors are the ones you see */}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
          {showError('email') && <p role="alert">{showError('email')}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {showError('password') && <p role="alert">{showError('password')}</p>}
        </div>

        <div>
          <label htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            value={values.confirm}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {showError('confirm') && <p role="alert">{showError('confirm')}</p>}
        </div>

        <div>
          <label>
            <input name="agree" type="checkbox" checked={values.agree} onChange={handleChange} onBlur={handleBlur} /> I
            agree to the terms
          </label>
          {showError('agree') && <p role="alert">{showError('agree')}</p>}
        </div>

        <button type="submit">Create account</button>
      </form>

      {submitted && <p>Welcome, {submitted}</p>}

    </section>
  )
}
