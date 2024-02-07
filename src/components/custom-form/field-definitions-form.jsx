import { useFormik } from 'formik';
import TextField from '@commercetools-uikit/text-field';
import TextInput from '@commercetools-uikit/text-input';
import {
  FormModalPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import messages from './messages';
import { useIntl } from 'react-intl';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useState } from 'react';
import PropTypes from 'prop-types';
import validate from './validate-field-definitions';
import Spacings from '@commercetools-uikit/spacings';

const FieldDefinitionsForm = ({
  formModalState,
  onCloseModal,
  listOfFieldDefinitions,
  setListOfFieldDefinitions,
  fieldDefinitionsData,
  setFieldDefinitionsData,
}) => {

  const onSaveFieldDefinitions = async (formikValues) => {
    fieldDefinitionsData.push(formikValues);
    setFieldDefinitionsData(fieldDefinitionsData);
    onCloseModal();
  };

  const formik = useFormik({
    initialValues: {},
    errors: {},
    validate,
    onSubmit: onSaveFieldDefinitions,
    enableReinitialize: true,
  });

  const handleChange = (e) => {
    setListOfFieldDefinitions({
      ...listOfFieldDefinitions,
      [e.target.name]: e.target.value,
    });
  };

  const getTextField = (customName, type, values, errors, touched) => {
    return (
      <TextField
        name={type}
        title={customName}
        value={values}
        errors={errors}
        touched={touched}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isReadOnly={false}
        renderError={(errorKey) => {
          if (errorKey === 'duplicate') {
            return intl.formatMessage(messages.duplicateKey);
          }
          return null;
        }}
        isRequired
        horizontalConstraint={8}
      />
    );
  };

  const getAllFields = () => {
    return (
      <Spacings.Stack scale="xl">
        {getTextField(
          messages.fieldDefinitionName.defaultMessage,
          'name',
          formik.values.name,
          formik.errors.name,
          formik.touched.name
        )}

        {getTextField(
          messages.fieldDefinitionLabel.defaultMessage,
          'label',
          formik.values.label,
          formik.errors.label,
          formik.touched.label
        )}

        {getTextField(
          messages.fieldDefinitionType.defaultMessage,
          'type',
          formik.values.type,
          formik.errors.type,
          formik.touched.type
        )}
        {getTextField(
          messages.fieldDefinitionInputHint.defaultMessage,
          'inputHint',
          formik.values.inputHint,
          formik.errors.inputHint,
          formik.touched.inputHint
        )}
      </Spacings.Stack>
    );
  };



  return (
    <FormModalPage
      title="Add your custom Field Definitions"
      isOpen={formModalState}
      onClose={onCloseModal}
      labelPrimaryButton={'Save'}
      onSecondaryButtonClick={() => setListOfFieldDefinitions({})}
      onPrimaryButtonClick={formik.handleSubmit}
    >
      {getAllFields()}
    </FormModalPage>
  );
};

FieldDefinitionsForm.displayName = 'FieldDefinitionsForm';

FieldDefinitionsForm.propTypes = {
  onClose: PropTypes.func,
};

export default FieldDefinitionsForm;
