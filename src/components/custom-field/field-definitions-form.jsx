import { useFormik } from 'formik';
import TextField from '@commercetools-uikit/text-field';
import { FormModalPage } from '@commercetools-frontend/application-components';
import messages from '../custom-form/messages';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import validate from '../custom-form/validate-field-definitions';
import Spacings from '@commercetools-uikit/spacings';
import { addfieldDefinitionByType } from '../../hooks/use-channels-connector/use-channels-connector';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import SelectField from '@commercetools-uikit/select-field';

const typeOptions = [
  { value: 'String', label: 'String' },
  { value: 'LocalizedString', label: 'LocalizedString' },
  { value: 'Number', label: 'Number' },
  { value: 'Money', label: 'Money' },
  { value: 'Date', label: 'Date' },
  { value: 'Time', label: 'Time' },
  { value: 'DateTime', label: 'DateTime' },
  { value: 'Boolean', label: 'Boolean' },
];

const inputHintOptions = [
  { value: 'SingleLine', label: 'SingleLine' },
  { value: 'MultiLine', label: 'MultiLine' },
];


const FieldDefinitionsForm = ({ formModalState, onCloseModal, versionId }) => {
  const params = useParams();
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project.languages,
  }));

  const addFieldDefinitionForType = addfieldDefinitionByType();

  const onSaveFieldDefinitions = async (formikValues) => {
    await addFieldDefinitionForType.execute({
      typeId: params.id,
      version: versionId,
      actions: [
        {
          addFieldDefinition: {
            fieldDefinition: {
              name: formikValues?.name,
              label: {
                locale: 'en',
                value: formikValues?.label,
              },
              type: {
                [formikValues?.type]: {
                  dummy: formikValues?.type,
                },
              },
              required: false,
              inputHint: formikValues?.inputHint,
            },
          },
        },
      ],
    });
    onCloseModal();
  };

  const formik = useFormik({
    initialValues: {},
    errors: {},
    validate,
    onSubmit: onSaveFieldDefinitions,
    enableReinitialize: true,
  });

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

  const getTypeOptions = (customName, type, values, errors, touched) => {
    return (
      <SelectField
        name={type}
        title={customName}
        value={values}
        errors={errors}
        touched={touched}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        options={type === 'inputHint' ? inputHintOptions : typeOptions}
        isReadOnly={false}
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

        {getTypeOptions(
          messages.fieldDefinitionType.defaultMessage,
          'type',
          formik.values.type,
          formik.errors.type,
          formik.touched.type
        )}
        {getTypeOptions(
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
