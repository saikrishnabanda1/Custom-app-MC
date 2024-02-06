import PropTypes from 'prop-types';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { useCreateCustomType } from '../../hooks/use-channels-connector';
import CustomFieldFormForTypes from './custom-field-form';
import { PERMISSIONS } from '../../constants';
import { docToFormValuesForCreateType } from './conversions';
import PrimaryButton from '@commercetools-uikit/primary-button';

const FormComponent = () => {
  const addCustomType = useCreateCustomType();
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));

  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });

  return (
    <CustomFieldFormForTypes
      initialValues={docToFormValuesForCreateType(
        addCustomType,
        projectLanguages
      )}
      isReadOnly={!canManage}
      dataLocale={dataLocale}
    >
      {(formProps) => {
        return (
          <div>
            {formProps.formElements}
            
            <br />

            <PrimaryButton
              type="submit"
              label="Submit"
              onClick={formProps.submitForm}
            />
          </div>
        );
      }}
    </CustomFieldFormForTypes>
  );
};

FormComponent.displayName = 'FormComponent';
FormComponent.propTypes = {
  onClose: PropTypes.func,
};

export default FormComponent;
