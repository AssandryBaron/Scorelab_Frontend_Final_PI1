import React from 'react';
import AuthLayout from '../components/templates/AuthLayout/AuthLayout';
import RegisterForm from '../components/organisms/RegisterForm/RegisterForm';

/**
 * Page: RegisterPage
 * Solo ensambla el template con el organismo correspondiente.
 */
const RegisterPage = () => (
  <AuthLayout subtitle="Crea tu cuenta y empieza a competir">
    <RegisterForm />
  </AuthLayout>
);

export default RegisterPage;
