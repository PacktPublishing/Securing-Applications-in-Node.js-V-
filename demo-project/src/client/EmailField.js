import React from 'react';
import {Field} from 'react-final-form';
import isValidEmail from 'sane-email-validation';

function validateEmail(value) {
  if (!value) {
    return 'Please enter your email';
  }
  if (!isValidEmail(value)) {
    return 'Please enter a valid email';
  }
}
export default function EmailField() {
  return (
    <Field name="username" validate={validateEmail}>
      {({input, meta}) => (
        <label style={{display: 'flex', alignItems: 'center'}}>
          <div style={{marginRight: '1em', width: '5em'}}>Email</div>
          <input
            style={{flexGrow: 1, marginRight: '1em'}}
            {...input}
            type="email"
            placeholder="name@example.com"
          />
          {meta.error &&
            meta.touched && <div style={{color: 'red'}}>{meta.error}</div>}
        </label>
      )}
    </Field>
  );
}
