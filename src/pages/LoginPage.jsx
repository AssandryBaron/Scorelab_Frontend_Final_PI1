import React from 'react';
import AuthLayout from '../components/templates/AuthLayout/AuthLayout';
import LoginForm from '../components/organisms/LoginForm/LoginForm';

/**
 * Page: LoginPage
 * Solo ensambla el template con el organismo correspondiente.
 */
const LoginPage = () => (
  <AuthLayout subtitle="Inicia sesión para continuar">
    <LoginForm />
  </AuthLayout>
);

export default LoginPage;
