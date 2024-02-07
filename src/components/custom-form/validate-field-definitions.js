import TextInput from '@commercetools-uikit/text-input';
import omitEmpty from 'omit-empty-es';

const validate = (formikValues) => {
  const errors = {
    name: {},
    label: {},
    type: {},
    inputHint: {},
  };

  if (TextInput.isEmpty(formikValues.name)) {
    errors.name.missing = true;
  }
  if (TextInput.isEmpty(formikValues.label)) {
    errors.label.missing = true;
  }
  if (TextInput.isEmpty(formikValues.type)) {
    errors.type.missing = true;
  }
  if (TextInput.isEmpty(formikValues.inputHint)) {
    errors.inputHint.missing = true;
  }
  return omitEmpty(errors);
};

export default validate;
