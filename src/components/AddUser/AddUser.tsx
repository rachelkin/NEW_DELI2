import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './AddUser.scss';

interface AddUserProps {
  onBackToLogin?: () => void;
}

interface RegisterFormValues {
  fullName: string;
  idNumber: string;
  email: string;
  address?: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .required('שדה חובה'),
  idNumber: Yup.string()
    .matches(/^\d{9}$/, 'תעודת זהות חייבת להכיל 9 ספרות')
    .required('שדה חובה'),
  email: Yup.string()
    .email('כתובת מייל לא תקינה')
    .required('שדה חובה'),
  address: Yup.string(),
  password: Yup.string()
    .min(6, 'סיסמה חייבת להכיל לפחות 6 תווים')
    .required('שדה חובה'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'הסיסמאות לא תואמות')
    .required('שדה חובה')
});

const AddUser: FC<AddUserProps> = ({ onBackToLogin }) => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string>('');
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      console.log('Register attempt:', values);
      
      const userData = {
        fullName: values.fullName,
        idNumber: values.idNumber,
        email: values.email,
        address: values.address || '',
        password: values.password,
      };
      
      const response = await axios.post('/users', userData);
      
      if (response.status === 201) {
        console.log('רישום הושלם בהצלחה:', response.data);
        setNewUserName(values.fullName);
        setRegisterSuccess(true);
        setRegisterError('');
      }
      
    } catch (error: any) {
      console.error('שגיאה ברישום:', error);
      if (error.response?.status === 400) {
        setRegisterError('משתמש עם מייל זה כבר קיים');
      } else {
        setRegisterError('שגיאה ברישום, נסה שוב');
      }
    }
  };

  const handleGoToProducts = () => {
    if (window.location.pathname.includes('/admin/')) {
      navigate('/admin'); 
    } else {
      navigate('/home'); 
    }
  };

  if (registerSuccess) {
    const isAdminPage = window.location.pathname.includes('/admin/');
    
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="success-message">
            <div className="logo-success">
              <img 
                src="https://newdeli.com/wp-content/uploads/2024/11/NewDeli_Rebrand_030625_00001-1024x576.jpg" 
                alt="New Deli Logo" 
                className="success-logo-image"
              />
            </div>
            
            <div className="welcome-content">
              {isAdminPage ? (
                <>
                  <h2>נוסף בהצלחה!</h2>
                  <p>המשתמש {newUserName} נוסף בהצלחה למערכת</p>
                </>
              ) : (
                <>
                  <h2>ברוך הבא {newUserName}!</h2>
                  <p>הצטרפת בהצלחה למשפחת NEW DELI!</p>
                </>
              )}
              <div className="celebration-icons">
              </div>
            </div>
            
            <div className="success-actions">
              <button 
                className="enter-system-btn"
                onClick={handleGoToProducts}
              >
                <span className="btn-icon"></span>
                {isAdminPage ? 'חזרה לדף מנהל' : 'כניסה למערכת'}
                <span className="btn-arrow">←</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-background"></div>
      
      <div className="register-container">
        <div className="register-header">
          <div className="logo">
            <img 
              src="https://newdeli.com/wp-content/uploads/2024/11/NewDeli_Rebrand_030625_00001-1024x576.jpg" 
              alt="New Deli Logo" 
              className="logo-image"
            />
            <h1>NEW DELI</h1>
            <p>מסעדת בשרים כשרה</p>
          </div>
        </div>

        <div className="register-form-container">
          <h2>הרשמה למערכת</h2>
          
          <Formik
            initialValues={{ 
              fullName: '', 
              idNumber: '', 
              email: '', 
              address: '', 
              password: '', 
              confirmPassword: '' 
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="register-form">
                <div className="form-group">
                  <label htmlFor="fullName">שם מלא</label>
                  <Field
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-input"
                    placeholder="הכנס שם מלא"
                  />
                  <ErrorMessage name="fullName" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="idNumber">תעודת זהות</label>
                  <Field
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    className="form-input"
                    placeholder="הכנס תעודת זהות"
                  />
                  <ErrorMessage name="idNumber" component="div" className="error-message" />
                </div>

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
                  <label htmlFor="address">כתובת (לא חובה)</label>
                  <Field
                    type="text"
                    id="address"
                    name="address"
                    className="form-input"
                    placeholder="הכנס כתובת"
                  />
                  <ErrorMessage name="address" component="div" className="error-message" />
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

                <div className="form-group">
                  <label htmlFor="confirmPassword">אימות סיסמה</label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="הכנס סיסמה שוב"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                </div>

                {registerError && (
                  <div className="register-error">
                    {registerError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="register-button"
                >
                  {isSubmitting ? 'נרשם...' : 'להרשמה'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
