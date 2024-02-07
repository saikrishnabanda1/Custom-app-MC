import PropTypes from 'prop-types';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import Spacings from '@commercetools-uikit/spacings';
import {
  deleteCustomTypeById,
  useCustomFields,
} from '../../hooks/use-channels-connector';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import DataTable from '@commercetools-uikit/data-table';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Moment from 'moment';
import {
  Link as RouterLink,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { lazy } from 'react';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { PlusThinIcon } from '@commercetools-uikit/icons';
import { CustomCss } from './style';
import FormComponent from '../custom-form/custom-form';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import { useEffect, useState } from 'react';

const CustomField = lazy(() => import('../custom-field'));

const customColumns = [
  { key: 'key', label: 'Field Id' },
  { key: 'nameAllLocales', label: 'Names' },
  { key: 'descriptionAllLocales', label: 'Description' },
  { key: 'createdAt', label: 'Creation Date' },
  { key: 'lastModifiedAt', label: 'Last Modified Date' },
  { key: 'delete', label: 'Delete' },
];

const CustomFeature = (props) => {
  const { page, perPage } = usePaginationState();
  const match = useRouteMatch();
  const { push } = useHistory();
  let history = useHistory();

  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const [dataDeletedStatus, setDataDeletedStatus] = useState({});

  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project.languages,
  }));
  const { CustomFieldsData, error, loading } = useCustomFields(
    { page, perPage, tableSorting },
    'custom-line-item'
  );

  useEffect(() => {
    if (Object.keys(dataDeletedStatus)?.length) {
      window.location.reload();
    }
  }, [dataDeletedStatus]);

  const deleteCustomType = deleteCustomTypeById();

  const deleteAttribute = async (versionId, typeId) => {
    alert('Are you sure you want to delete this type');
    const response = await deleteCustomType.execute({
      typeId: typeId,
      version: versionId,
    });
    setDataDeletedStatus(response?.data?.deleteTypeDefinition);
  };

  const itemRenderer = (item, column, dataLocale, projectLanguages) => {
    switch (column.key) {
      case 'nameAllLocales':
        var name = '';
        if (item[column.key] != null) {
          for (var i = 0; i < item[column.key].length; i++) {
            if (dataLocale.includes(item[column.key][i].locale))
              name = item[column.key][i].value;
          }
        }
        return name;
      case 'descriptionAllLocales':
        var name = 'NA';
        if (item[column.key] != null) {
          for (var i = 0; i < item[column.key].length; i++) {
            if (dataLocale.includes(item[column.key][i].locale))
              name = item[column.key][i].value;
          }
        }
        return name;
      case 'createdAt':
        var fetchDate = Moment(item[column.key]).format(
          'MMM, DD YYYY, hh:mm A'
        );
        return fetchDate;
      case 'lastModifiedAt':
        var fetchDate = Moment(item[column.key]).format(
          'MMM, DD YYYY, hh:mm A'
        );
        return fetchDate;
      case 'delete':
        return (
          <BinLinearIcon
            onClick={() => deleteAttribute(item.version, item.id)}
            size="medium"
          />
        );
      default:
        return item[column.key];
    }
  };

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  return (
    <Spacings.Stack scale="xl">
      <CustomCss>
        <Text.Headline as="h2">List of Custom Types</Text.Headline>
        <SecondaryButton
          iconLeft={<PlusThinIcon />}
          size="big"
          label="Add a Custom type"
          onClick={() =>
            history.replace(
              `${match.url.split('/', 3).join('/')}/custom-form`,
              { shallow: true }
            )
          }
        />
        <Switch>
          <SuspendedRoute path={`${match.path}/custom-form`}>
            <FormComponent onClose={() => push(`${match.url}`)} />
          </SuspendedRoute>
        </Switch>
      </CustomCss>

      {CustomFieldsData ? (
        <Spacings.Stack scale="l">
          <DataTable
            isCondensed
            columns={customColumns}
            rows={CustomFieldsData}
            itemRenderer={(item, column) =>
              itemRenderer(item, column, dataLocale, projectLanguages)
            }
            maxHeight={600}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
            onRowClick={(row, rowIndex, columnKey) => {
              if (columnKey !== 'delete') {
                push(`${match.url}/${row.id}`);
              }
            }}
          />
          <Switch>
            <SuspendedRoute path={`${match.path}/:id`}>
              <CustomField onClose={() => push(`${match.url}`)} />
            </SuspendedRoute>
          </Switch>
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};
CustomFeature.displayName = 'CustomFeature';

export default CustomFeature;
