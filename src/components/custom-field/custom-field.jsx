import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import {
  useShowNotification,
  useShowApiErrorNotification,
} from '@commercetools-frontend/actions-global';
import {
  useCustomFieldUpdater,
  getCustomField,
} from '../../hooks/use-channels-connector';
import Text from '@commercetools-uikit/text';
import {
  DOMAINS,
  NO_VALUE_FALLBACK,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import {
  PageNotFound,
  FormModalPage,
} from '@commercetools-frontend/application-components';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import { ContentNotification } from '@commercetools-uikit/notifications';
import CustomFieldForm from './custom-field-form';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import { PERMISSIONS } from '../../constants';
import { docToFormValues, formValuesToDoc } from './conversions';
import { ApplicationPageTitle } from '@commercetools-frontend/application-shell';
import { transformErrors } from './transform-errors';
import messages from './messages';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useCallback, useState } from 'react';
import FieldDefinitionsForm from './field-definitions-form';
import EditFieldForm from './edit-field-form';
import { updateCustomTypeKey } from '../../hooks/use-channels-connector/use-channels-connector';

const CustomFieldComp = (props) => {
  const intl = useIntl();
  const params = useParams();
  const [formModalState, setFormModalState] = useState(false);
  const [formModalStateLabel, setFormModalStateLabel] = useState(false);
  const [editLabelState, setEditLabelState] = useState(false);
  const [labelStateValue, setLabelStateValue] = useState();
  const [fieldDefinitionValues, setFieldDefinitionsValues] = useState();

  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));

  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });
  const showNotification = useShowNotification();
  const showApiErrorNotification = useShowApiErrorNotification();

  const { customFieldDetails, error, loading } = getCustomField(params.id);
  const customFieldUpdater = useCustomFieldUpdater();
  const customTypeKeyUpdater = updateCustomTypeKey();

  const handleSubmit = useCallback(
    async (formikValues, formikHelpers) => {
      console.log('formikValues', formikValues);

      const data = formValuesToDoc(formikValues);
      var enName,
        deName,
        enDesc,
        deDesc = '';
      if (customFieldDetails.nameAllLocales != null) {
        for (var i = 0; i < customFieldDetails.nameAllLocales.length; i++) {
          if (customFieldDetails.nameAllLocales[i].locale == 'en') {
            enName = customFieldDetails.nameAllLocales[i].value;
          }
          if (customFieldDetails.nameAllLocales[i].locale == 'de') {
            deName = customFieldDetails.nameAllLocales[i].value;
          }
        }
      }
      if (customFieldDetails.descriptionAllLocales != null) {
        for (
          var i = 0;
          i < customFieldDetails.descriptionAllLocales.length;
          i++
        ) {
          if (customFieldDetails.descriptionAllLocales[i].locale == 'en') {
            enDesc = customFieldDetails.descriptionAllLocales[i].value;
          }
          if (customFieldDetails.descriptionAllLocales[i].locale == 'de') {
            deDesc = customFieldDetails.descriptionAllLocales[i].value;
          }
        }
      }

      let description = [{ locale: 'en', value: data.description.en }];
      let oldData = {
        description: { en: enDesc },
        key: customFieldDetails.key,
        name: { en: enName },
      };

      try {
        await customTypeKeyUpdater.execute({
          typeId: params.id,
          version: customFieldDetails?.version,
          actions: [
            {
              changeKey: {
                key: formikValues?.key,
              },
            },
          ],
        });
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: 'Custom type key updated',
        });
      } catch (graphQLErrors) {
        const transformedErrors = transformErrors(graphQLErrors);
        if (transformedErrors.unmappedErrors.length > 0) {
          showApiErrorNotification({
            errors: transformedErrors.unmappedErrors,
          });
        }

        formikHelpers.setErrors(transformedErrors.formErrors);
      }
    },
    [
      customFieldDetails,
      customFieldUpdater,
      dataLocale,
      intl,
      projectLanguages,
      showApiErrorNotification,
      showNotification,
    ]
  );

  const onCloseModal = () => {
    setFormModalState(!formModalState);
  };

  const onCloseEditModal = () => {
    setFormModalStateLabel(!formModalStateLabel);
  };

  return (
    <CustomFieldForm
      initialValues={docToFormValues(customFieldDetails, projectLanguages)}
      onSubmit={handleSubmit}
      isReadOnly={!canManage}
      dataLocale={dataLocale}
      editLabelState={editLabelState}
      labelState={labelStateValue}
      fieldDefinitionValues={fieldDefinitionValues}
      setEditLabelState={setEditLabelState}
      setLabelStateValue={setLabelStateValue}
      setFieldDefinitionsValues={setFieldDefinitionsValues}
      onCloseModal={onCloseEditModal}
      setFormModalStateLabel={setFormModalStateLabel}
      formModalStateLabel={formModalStateLabel}
      versionId={customFieldDetails?.version}
    >
      {(formProps) => {
        const customFieldName = formatLocalizedString(
          {
            name: formProps.values?.name,
          },
          {
            key: 'name',
            locale: dataLocale,
            fallbackOrder: projectLanguages,
            fallback: NO_VALUE_FALLBACK,
          }
        );
        return (
          <FormModalPage
            title={customFieldName}
            subtitle="Mandatory fields are marked with an asterisk (*)."
            isOpen
            onClose={props.onClose}
            isPrimaryButtonDisabled={
              formProps.isSubmitting || !formProps.isDirty || !canManage
            }
            isSecondaryButtonDisabled={!formProps.isDirty}
            onSecondaryButtonClick={formProps.handleReset}
            onPrimaryButtonClick={formProps.submitForm}
            labelPrimaryButton={FormModalPage.Intl.save}
            labelSecondaryButton={FormModalPage.Intl.revert}
          >
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <PrimaryButton
                label="Add a Field Definition"
                onClick={() => setFormModalState(!formModalState)}
              />
            </div>
            {loading && (
              <Spacings.Stack alignItems="center">
                <LoadingSpinner />
              </Spacings.Stack>
            )}
            {error && (
              <ContentNotification type="error">
                <Text.Body>
                  {intl.formatMessage(messages.customFieldErrorMessage)}
                </Text.Body>
              </ContentNotification>
            )}
            {customFieldDetails && formProps.formElements}
            {customFieldDetails && (
              <ApplicationPageTitle additionalParts={[customFieldName]} />
            )}
            {customFieldDetails === null && <PageNotFound />}

            {formModalState ? (
              <FieldDefinitionsForm
                formModalState={formModalState}
                onCloseModal={onCloseModal}
                versionId={customFieldDetails?.version}
              />
            ) : null}

            {formModalStateLabel ? (
              <EditFieldForm
                onCloseModal={onCloseEditModal}
                formModalStateLabel={formModalStateLabel}
                versionId={customFieldDetails?.version}
                fieldDefinitionValues={{
                  label: fieldDefinitionValues[0]?.labelAllLocales[0]?.value,
                  name: fieldDefinitionValues[0]?.name,
                }}
              />
            ) : null}
          </FormModalPage>
        );
      }}
    </CustomFieldForm>
  );
};

CustomFieldComp.displayName = 'CustomFieldComp';
CustomFieldComp.propTypes = {
  onClose: PropTypes.func,
};

export default CustomFieldComp;
