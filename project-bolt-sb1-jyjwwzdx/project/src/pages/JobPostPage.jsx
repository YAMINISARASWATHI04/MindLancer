import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const jobPostSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  budget: Yup.number().positive('Must be positive').required('Required'),
});

function JobPostPage() {
  return (
    <div className="job-post-page">
      <h1>Post a New Job</h1>
      <Formik
        initialValues={{ title: '', description: '', budget: '' }}
        validationSchema={jobPostSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label>Job Title</label>
              <Field type="text" name="title" />
              <ErrorMessage name="title" component="div" />
            </div>

            <div className="form-group">
              <label>Description</label>
              <Field as="textarea" name="description" />
              <ErrorMessage name="description" component="div" />
            </div>

            <div className="form-group">
              <label>Budget ($)</label>
              <Field type="number" name="budget" />
              <ErrorMessage name="budget" component="div" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Post Job
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default JobPostPage;
