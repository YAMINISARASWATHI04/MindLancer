import { Field, Form, Formik } from 'formik';
import { Briefcase, Lock, Mail, Shield, User } from 'lucide-react';
import React from 'react';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../utils/validators';

const ROLE_OPTIONS = [
  {
    value: 'freelancer',
    title: 'Freelancer',
    icon: <User className="h-5 w-5" />,
  },
  {
    value: 'business',
    title: 'Hire Freelancer',
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    value: 'admin',
    title: 'Admin',
    icon: <Shield className="h-5 w-5" />,
  }
];

function LoginPage() {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{ email: '', password: '', role: 'freelancer' }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting }) => {
              login(values.email, values.password, values.role);
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting, ...formik }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Login As
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      as="select"
                      name="role"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.title}
                        </option>
                      ))}
                    </Field>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {ROLE_OPTIONS.find(r => r.value === formik.values?.role)?.icon}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${formik.values?.role === 'admin' ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      placeholder="you@example.com"
                      disabled={formik.values?.role === 'admin'}
                    />
                  </div>
                  {formik.values?.role === 'admin' && (
                    <p className="mt-1 text-sm text-gray-500">
                      Admin accounts are pre-configured. Contact system administrators for access.
                    </p>
                  )}
                  {errors.email && touched.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="password"
                      name="password"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {errors.password && touched.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>

                  <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => window.location.href = '/auth/google'}
                    >
                      <FaGoogle className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => window.location.href = '/auth/github'}
                    >
                      <FaGithub className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => window.location.href = '/auth/linkedin'}
                    >
                      <FaLinkedin className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;