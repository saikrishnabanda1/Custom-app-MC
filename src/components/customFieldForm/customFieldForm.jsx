import { useFormik } from 'formik';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import TextField from '@commercetools-uikit/text-field';
import Spacings from '@commercetools-uikit/spacings';
import validate from './validate';
import PropTypes from 'prop-types';

const CustomFieldForm = (props) => {
  const onSubmitForm = () => {};
  const dataLocale = useApplicationContext((context) => context.dataLocale);
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: onSubmitForm,
    validate,
    enableReinitialize: true,
  });

  const formElements = (
    <Spacings.Stack scale="l">
      <LocalizedTextField
        name="name"
        title="Name"
        isRequired
        selectedLanguage={dataLocale}
        value={formik?.values?.name}
        errors={LocalizedTextField.toFieldErrors(formik?.errors).name}
        touched={formik?.touched?.name}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
      />
      <TextField
        name="key"
        title="Key"
        isRequired
        value={formik?.values.key}
        errors={TextField.toFieldErrors(formik?.errors).key}
        touched={formik?.touched.key}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
      />
    </Spacings.Stack>
  );

  return props.children({
    formElements,
    isDirty: formik?.dirty,
    isSubmitting: formik?.isSubmitting,
    submitForm: formik?.handleSubmit,
    handleCancel: formik?.handleReset,
  });
};

CustomFieldForm.displayName = 'CustomFieldForm';
CustomFieldForm.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    key: PropTypes.string,
    name: PropTypes.object,
    version: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
  isReadOnly: PropTypes.bool,
  dataLocale: PropTypes.string,
};

export default CustomFieldForm;
