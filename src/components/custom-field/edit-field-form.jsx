import { useFormik } from 'formik';
import TextField from '@commercetools-uikit/text-field';
import { FormModalPage } from '@commercetools-frontend/application-components';
import messages from '../custom-form/messages';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import validate from '../custom-form/validate-field-definitions';
import Spacings from '@commercetools-uikit/spacings';
import { updateFieldDefinitionLabel } from '../../hooks/use-channels-connector/use-channels-connector';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const EditFieldForm = ({
  onCloseModal,
  formModalStateLabel,
  versionId,
  fieldDefinitionValues,
}) => {
  const params = useParams();
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project.languages,
  }));
  const fileDefinitionLabelUpdate = updateFieldDefinitionLabel();

  const onSaveFieldDefinitionLabel = async (formikValues) => {
    await fileDefinitionLabelUpdate.execute({
      typeId: params.id,
      version: versionId,
      actions: [
        {
          changeLabel: {
            fieldName: fieldDefinitionValues?.name,
            label: {
              locale: dataLocale,
              value: formikValues?.label,
            },
          },
        },
      ],
    });
    onCloseModal();
  };

  const formik = useFormik({
    initialValues: fieldDefinitionValues,
    errors: {},
    validate,
    onSubmit: onSaveFieldDefinitionLabel,
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

  const getAllFields = () => {
    return (
      <Spacings.Stack scale="xl">
        {getTextField(
          messages.fieldDefinitionLabel.defaultMessage,
          'label',
          formik?.values.label,
          formik.errors.label,
          formik.touched.label
        )}
      </Spacings.Stack>
    );
  };

  return (
    <FormModalPage
      title="Edit your field definition label"
      isOpen={formModalStateLabel}
      onClose={onCloseModal}
      labelPrimaryButton={'Save'}
      onPrimaryButtonClick={() => onSaveFieldDefinitionLabel(formik?.values)}
    >
      {getAllFields()}
    </FormModalPage>
  );
};

EditFieldForm.displayName = 'EditFieldForm';

EditFieldForm.propTypes = {
  onClose: PropTypes.func,
};

export default EditFieldForm;
