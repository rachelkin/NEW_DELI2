import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AddUser from '../AddUser/AddUser';
import './LoginPage.scss';

interface LoginPageProps {}

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('כתובת מייל לא תקינה')
    .required('שדה חובה'),
  password: Yup.string()
    .min(6, 'סיסמה חייבת להכיל לפחות 6 תווים')
    .required('שדה חובה')
});

const LoginPage: FC<LoginPageProps> = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string>('');
  const [showRegister, setShowRegister] = useState<boolean>(false);

const handleSubmit = async (values: LoginFormValues) => {
  try {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    const foundUser = users.find(
      (user: any) =>
        user.email.toLowerCase() === values.email.toLowerCase() &&
        user.password === values.password
    );

    if (!foundUser) {
      setLoginError('משתמש לא קיים, עליך להירשם למערכת');
      return;
    }

    if (values.email.toLowerCase() === 'rachel67960@gmail.com' && values.password === '123456') {
      navigate('/admin');
    } else {
      localStorage.setItem('currentUser', JSON.stringify({
        userId: foundUser.id,
        userName: foundUser.fullName,
        userEmail: foundUser.email
      }));
      navigate('/home');
    }

  } catch (error) {
    console.error(error);
    setLoginError(' בעיה בטעינת משתמשים, המתן...');
  }
};

  if (showRegister) {
    return <AddUser onBackToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="login-page">
      <div className="login-background"></div>
      
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <img 
              src="https://newdeli.com/wp-content/uploads/2024/11/NewDeli_Rebrand_030625_00001-1024x576.jpg" 
              alt="New Deli Logo" 
              className="logo-image"
            />
            <h1>NEW DELI</h1>
            <p>מסעדה בשרית כשרה</p>
          </div>
        </div>

        <div className="login-form-container">
          <h2>כניסה למערכת</h2>
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="login-form">
                <div className="form-group">
                  <label htmlFor="email">כתובת מייל</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="הכנס כתובת מייל"
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">סיסמה</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="הכנס סיסמה"
                  />
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>

                {loginError && (
                  <div className="login-error">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="login-button"
                >
                  {isSubmitting ? 'מתחבר...' : 'כניסה'}
                </button>
                
                <div className="register-link">
                  <p>אין לך חשבון? <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>הירשם כאן</a></p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
