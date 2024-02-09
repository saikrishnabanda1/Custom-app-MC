import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import TextField from '@commercetools-uikit/text-field';
import Spacings from '@commercetools-uikit/spacings';
import validate from './validate';
import messages from './messages';
import DataTable from '@commercetools-uikit/data-table';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import FieldDefinitionsForm from './field-definitions-form';
import { useCallback, useState } from 'react';
import { useCreateCustomType } from '../../hooks/use-channels-connector';
import {
  useShowApiErrorNotification,
  useShowNotification,
} from '@commercetools-frontend/actions-global';
import { CustomCss } from '../customField/style';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { transformErrors } from '../custom-field/transform-errors';
import { useHistory, useRouteMatch } from 'react-router';

const custColumns = [
  { key: 'name', label: 'Name' },
  { key: 'label', label: 'Label' },
  { key: 'type', label: 'Type' },
  { key: 'inputHint', label: 'Input Hint' },
];

const CustomFieldDetailsForm = (props) => {
  const intl = useIntl();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const [formModalState, setFormModalState] = useState(false);
  const [listOfFieldDefinitions, setListOfFieldDefinitions] = useState({});
  const addCustomType = useCreateCustomType();
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));
  const showNotification = useShowNotification();
  const showApiErrorNotification = useShowApiErrorNotification();
  const match = useRouteMatch();
  let history = useHistory();

  const [fieldDefinitionsData, setFieldDefinitionsData] = useState([]);

  const handleSubmit = useCallback(
    async (formikValues, formikHelpers) => {
      const data = fieldDefinitionsData?.map((item) => {
        return {
          name: item?.name,
          label: {
            locale: dataLocale,
            value: item?.label,
          },
          type: {
            [item?.type]: {
              dummy: item?.type,
            },
          },
          required: false,
          inputHint: item?.inputHint,
        };
      });

      var enName,
        deName,
        enDesc,
        deDesc = '';
      if (addCustomType.descriptionAllLocales != null) {
        for (var i = 0; i < addCustomType.descriptionAllLocales.length; i++) {
          if (addCustomType.descriptionAllLocales[i].locale === 'en') {
            enDesc = addCustomType.descriptionAllLocales[i].value;
          }
          if (addCustomType.descriptionAllLocales[i].locale === 'de') {
            deDesc = addCustomType.descriptionAllLocales[i].value;
          }
        }
      }
      addCustomType?.fieldDefinitions == data;

      try {
        await addCustomType.execute({
          key: formikValues?.key,
          name: {
            locale: dataLocale,
            value: formikValues?.name,
          },
          description: {
            locale: dataLocale,
            value: formikValues?.description,
          },
          resourceType: ['custom-line-item'],
          fieldDefinitions: data,
        });

        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: 'Custom type added',
        });

        setTimeout(() => {
          history.replace(
            `${match.url.split('/', 3).join('/')}/customFeature`,
            {
              shallow: true,
            }
          );
        }, 3000);
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
      addCustomType,
      dataLocale,
      intl,
      projectLanguages,
      showApiErrorNotification,
      showNotification,
    ]
  );

  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit: handleSubmit,
    validate,
    handleSubmit: ()=> {
      alert(45)
    },
    enableReinitialize: true,
  });

  const onCloseModal = () => {
    setFormModalState(!formModalState);
  };

  const formElements = (
    <form>
      <Spacings.Stack scale="xl">
        <TextField
          name="key"
          title={messages.customTypeKey.defaultMessage}
          value={formik.values.key}
          errors={formik.errors.key}
          touched={formik.touched.key}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isReadOnly={props.isReadOnly}
          renderError={(errorKey) => {
            if (errorKey === 'duplicate') {
              return intl.formatMessage(messages.duplicateKey);
            }
            return null;
          }}
          isRequired
          horizontalConstraint={8}
        />
        
        <TextField
          name="name"
          title={messages.customFieldNameLabel.defaultMessage}
          value={formik.values.name}
          errors={formik.errors.name}
          touched={formik.touched.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isReadOnly={props.isReadOnly}
          renderError={(errorKey) => {
            if (errorKey === 'duplicate') {
              return intl.formatMessage(messages.duplicateKey);
            }
            return null;
          }}
          isRequired
          horizontalConstraint={8}
        />
        <TextField
          name="description"
          title={messages.customTypeDescription.defaultMessage}
          value={formik.values.description}
          errors={formik.errors.description}
          touched={formik.touched.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isReadOnly={props.isReadOnly}
          renderError={(errorKey) => {
            if (errorKey === 'duplicate') {
              return intl.formatMessage(messages.duplicateKey);
            }
            return null;
          }}
          isRequired
          horizontalConstraint={8}
        />

        {formModalState ? (
          <FieldDefinitionsForm
            formModalState={formModalState}
            onCloseModal={onCloseModal}
            listOfFieldDefinitions={listOfFieldDefinitions}
            setListOfFieldDefinitions={setListOfFieldDefinitions}
            fieldDefinitionsData={fieldDefinitionsData}
            setFieldDefinitionsData={setFieldDefinitionsData}
          />
        ) : null}

        <CustomCss>
          <Text.Headline
            as="h2"
            intlMessage={messages.listOfFieldDefinitions}
          />
          <PrimaryButton
            label="Add a Field Definition"
            onClick={() => setFormModalState(!formModalState)}
          />
        </CustomCss>

        {!formModalState && fieldDefinitionsData?.length ? (
          <div>
            <DataTable
              isCondensed
              columns={custColumns}
              rows={fieldDefinitionsData}
              itemRenderer={(item, column) => item[column.key]}
              maxHeight={600}
              sortedBy={tableSorting.value.key}
              sortDirection={tableSorting.value.order}
              onSortChange={tableSorting.onChange}
            />
          </div>
        ) : (
          'No data added'
        )}
      </Spacings.Stack>
    </form>
  );

  return props.children({
    formElements,
    values: formik.values,
    isDirty: formik.dirty,
    isSubmitting: formik.isSubmitting,
    submitForm: formik.handleSubmit,
    handleReset: formik.handleReset,
  });
};

CustomFieldDetailsForm.displayName = 'CustomFieldDetailsForm';
CustomFieldDetailsForm.propTypes = {
  initialValues: PropTypes.shape({
    // id: PropTypes.string,
    key: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    errors: PropTypes.object,
    // version: PropTypes.number,
    fieldDefinitions: PropTypes.arrayOf(Object),
  }),
  isReadOnly: PropTypes.bool,
  dataLocale: PropTypes.string,
};

export default CustomFieldDetailsForm;
