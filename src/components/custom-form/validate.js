import TextInput from '@commercetools-uikit/text-input';
import omitEmpty from 'omit-empty-es';

const validate = (formikValues) => {
  console.log('sefesfsrs',formikValues)
  const errors = {
    key: {},
    name: {},
    description: {},
  };

  if (TextInput.isEmpty(formikValues.key)) {
    errors.key.missing = true;
  }
  if (TextInput.isEmpty(formikValues.name)) {
    errors.name.missing = true;
  }
  if (TextInput.isEmpty(formikValues.description)) {
    errors.description.missing = true;
  }
  return omitEmpty(errors);
};

export default validate;
