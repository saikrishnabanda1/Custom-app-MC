import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
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
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import { BinLinearIcon, EditIcon } from '@commercetools-uikit/icons';
import {
  getCustomField,
  removeFieldDefinition,
} from '../../hooks/use-channels-connector';
import { useParams } from 'react-router';

const custColumns = [
  { key: 'name', label: 'Name' },
  { key: 'labelAllLocales', label: 'Label' },
  { key: 'type', label: 'Type' },
  { key: 'inputHint', label: 'Input Hint' },
  { key: 'required', label: 'Required' },
  { key: 'delete', label: 'Delete' },
];

const CustomFieldDetailsForm = (props) => {
  const intl = useIntl();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project.languages,
  }));
  const params = useParams();
  const removeAttribute = removeFieldDefinition(params.id);

  const deleteAttribute = async (versionId, fieldName) => {
    alert('Are you sure you want to delete this attribute');
    await removeAttribute.execute({
      typeId: params.id,
      version: versionId,
      actions: [
        {
          removeFieldDefinition: {
            fieldName: fieldName,
          },
        },
      ],
    });
  };

  const onClickEditIcon = (label, name) => {
    props.setFieldDefinitionsValues(
      props?.initialValues?.fieldDefinition.filter((item) => item.name === name)
    );
    props.setLabelStateValue(label);
    props.setEditLabelState(true);
    props.setFormModalStateLabel(!props.formModalStateLabel);
  };

  const itemRenderer = (
    item,
    column,
    dataLocale,
    projectLanguages,
    versionId
  ) => {
    switch (column.key) {
      case 'labelAllLocales':
        var name = '';
        if (item[column.key] != null) {
          for (var i = 0; i < item[column.key].length; i++) {
            if (dataLocale.includes(item[column.key][i].locale))
              name = item[column.key][i].value;
          }
        }
        return (
          <>
            {name}
            &nbsp;
            <EditIcon
              onClick={() => onClickEditIcon(name, item?.name)}
              size="medium"
            />
          </>
        );
      case 'required':
        var isRequired;
        if (item[column.key]) {
          isRequired = (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              fill="#00b39e"
              class="css-1gzzfc8"
            >
              <path d="m10.74 13.62-1.957-1.957a.826.826 0 0 0-.608-.248c-.24 0-.45.09-.63.27a.853.853 0 0 0-.247.63c0 .255.082.465.247.63l2.565 2.565a.853.853 0 0 0 .63.248.853.853 0 0 0 .63-.248l5.107-5.107a.826.826 0 0 0 .248-.608c0-.24-.09-.45-.27-.63a.853.853 0 0 0-.63-.247.853.853 0 0 0-.63.247L10.74 13.62ZM12 21a8.759 8.759 0 0 1-3.51-.71 9.082 9.082 0 0 1-2.857-1.922 9.082 9.082 0 0 1-1.924-2.858A8.759 8.759 0 0 1 3 12c0-1.245.236-2.415.71-3.51a9.082 9.082 0 0 1 1.923-2.857A9.095 9.095 0 0 1 8.49 3.708 8.769 8.769 0 0 1 12 3c1.245 0 2.415.236 3.51.708a9.095 9.095 0 0 1 2.857 1.925 9.082 9.082 0 0 1 1.924 2.857A8.759 8.759 0 0 1 21 12a8.759 8.759 0 0 1-.71 3.51 9.082 9.082 0 0 1-1.922 2.857 9.082 9.082 0 0 1-2.858 1.924A8.759 8.759 0 0 1 12 21Z"></path>
            </svg>
          );
        } else {
          isRequired = (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              fill="grey"
              class="css-hvjmlt"
            >
              <path d="M8.4 12.9h7.223a.833.833 0 0 0 .63-.26.89.89 0 0 0 .247-.64.872.872 0 0 0-.26-.642.87.87 0 0 0-.64-.258H8.377a.835.835 0 0 0-.63.258A.893.893 0 0 0 7.5 12a.87.87 0 0 0 .258.64c.173.174.387.26.642.26ZM12 21a8.759 8.759 0 0 1-3.51-.71 9.082 9.082 0 0 1-2.857-1.922 9.082 9.082 0 0 1-1.924-2.858A8.759 8.759 0 0 1 3 12c0-1.245.236-2.415.71-3.51a9.082 9.082 0 0 1 1.923-2.857A9.095 9.095 0 0 1 8.49 3.708 8.769 8.769 0 0 1 12 3c1.245 0 2.415.236 3.51.708a9.095 9.095 0 0 1 2.857 1.925 9.082 9.082 0 0 1 1.924 2.857A8.759 8.759 0 0 1 21 12a8.759 8.759 0 0 1-.71 3.51 9.082 9.082 0 0 1-1.922 2.857 9.082 9.082 0 0 1-2.858 1.924A8.759 8.759 0 0 1 12 21Z"></path>
            </svg>
          );
        }
        return isRequired;
      case 'delete':
        return (
          <BinLinearIcon
            onClick={() => deleteAttribute(versionId, item.name)}
            size="medium"
          />
        );
      case 'type':
        return item[column.key]?.name;
      default:
        return item[column.key];
    }
  };

  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit: props.onSubmit,
    validate,
    enableReinitialize: true,
  });

  const formElements = (
    <Spacings.Stack scale="l">
      <CollapsiblePanel header="General Information">
        <TextField
          name="key"
          title={messages.customFieldKeyLabel.defaultMessage}
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
          horizontalConstraint={13}
        />
        <TextField
          name="name"
          title={messages.customFieldNameLabel.defaultMessage}
          value={
            formik.values.name['de-DE']
              ? formik.values.name['de-DE']
              : formik.values.name['en-US']
          }
          errors={formik.errors.name}
          touched={Boolean(formik.touched.name)}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          selectedLanguage={props.dataLocale}
          isReadOnly={props.isReadOnly}
          horizontalConstraint={13}
        />

        <TextField
          name="description"
          title={messages.customFieldDescription.defaultMessage}
          value={
            formik.values.description['de-DE']
              ? formik.values.description['de-DE']
              : formik.values.description['en-US']
          }
          errors={formik.errors.description}
          touched={Boolean(formik.touched.description)}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          selectedLanguage={props.dataLocale}
          isReadOnly={props.isReadOnly}
          horizontalConstraint={13}
        />
      </CollapsiblePanel>
      <Spacings.Stack scale="xl">
        <Text.Headline as="h2">{messages.attr.defaultMessage}</Text.Headline>

        <DataTable
          isCondensed
          columns={custColumns}
          rows={props.initialValues.fieldDefinition}
          itemRenderer={(item, column) =>
            itemRenderer(
              item,
              column,
              dataLocale,
              projectLanguages,
              formik.values.versionId
            )
          }
          maxHeight={600}
          sortedBy={tableSorting.value.key}
          sortDirection={tableSorting.value.order}
          onSortChange={tableSorting.onChange}
        />
      </Spacings.Stack>
    </Spacings.Stack>
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
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    key: PropTypes.string,
    name: PropTypes.string,
    version: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
  isReadOnly: PropTypes.bool.isRequired,
  dataLocale: PropTypes.string.isRequired,
};

export default CustomFieldDetailsForm;
