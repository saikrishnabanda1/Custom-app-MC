import {
  useMcQuery,
  useMcMutation,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import {
  createSyncChannels,
  createSyncTypes,
} from '@commercetools/sync-actions';
import {
  createGraphQlUpdateActions,
  extractErrorFromGraphQlResponse,
  convertToActionData,
} from '../../helpers';
import UpdateCustomFieldMutation from './update-custom-field.ctp.graphql';
import FetchCustomFieldDetailQuery from './fetch-custom-field-detail.ctp.graphql';
import FetchCustomFieldQuery from '../use-channels-connector/fetch-custom-field.ctp.graphql';
import FetchChannelsQuery from './fetch-channels.ctp.graphql';
import FetchChannelDetailsQuery from './fetch-channel-details.ctp.graphql';
import UpdateChannelDetailsMutation from './update-channel-details.ctp.graphql';
import AddCustomFieldMutation from '../use-channels-connector/create-custom-field.ctp.graphql';
import AddCustomType from './create-custom-type.ctp.graphql';
import RemoveFieldDefinition from './remove-field-definition.ctp.graphql';
import DeleteCustomType from './delete-custom-type.ctp.graphql'
import AddCustomFieldForType from './add-field-definition-type.ctp.graphql'
import UpdateFieldDefinitionLabel from './update-field-definition-label.ctp.graphql'
import UpdateCustomTypeKey from './update-custom-type-key.ctp.graphql'

const syncStores = createSyncChannels();

export const useCustomFields = ({ page, perPage, tableSorting }, type) => {
  const { data, error, loading } = useMcQuery(FetchCustomFieldQuery, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
      type,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  var filteredData = data?.typeDefinitions.results.filter((e) =>
    e.resourceTypeIds.includes(type)
  );

  return {
    CustomFieldsData: filteredData,
    error,
    loading,
  };
};

export const useCreateCustomType = () => {
  const [addingCustomFields, { loading }] = useMcMutation(AddCustomType);

  const execute = async ({
    key,
    name,
    description,
    resourceType,
    fieldDefinitions,
  }) => {
    try {
      return await addingCustomFields({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          key: key,
          name: name,
          description: description,
          resourceType: resourceType,
          fieldDefinitions: fieldDefinitions,
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};

export const removeFieldDefinition = () => {
  const [removeCustomFieldDefinition, { loading }] = useMcMutation(
    RemoveFieldDefinition
  );

  const execute = async ({ typeId, version, actions }) => {
    try {
      return await removeCustomFieldDefinition({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          typeId: typeId,
          version: version,
          actions: actions,
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};

export const updateFieldDefinitionLabel = () => {
  const [fieldDefinitionLabelChange, { loading }] = useMcMutation(
    UpdateFieldDefinitionLabel
  );

  const execute = async ({ typeId, version, actions }) => {
    try {
      return await fieldDefinitionLabelChange({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          typeId: typeId,
          version: version,
          actions: actions,
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};

export const deleteCustomTypeById = () => {
  const [deleteCustomTypeById, { loading }] = useMcMutation(
    DeleteCustomType
  );

  const execute = async ({ typeId, version }) => {
    try {
      return await deleteCustomTypeById({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          typeId: typeId,
          version: version,
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};

export const addfieldDefinitionByType = () => {
  const [addFieldDefinitionForType, { loading }] = useMcMutation(
    AddCustomFieldForType
  );

  const execute = async ({ typeId, version,actions }) => {
    try {
      return await addFieldDefinitionForType({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          typeId: typeId,
          version: version,
          actions:actions
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};

export const useCustomFieldUpdater = () => {
  const [updateCustomFields, { loading }] = useMcMutation(
    UpdateCustomFieldMutation
  );

  const syncTypes = createSyncTypes();
  const execute = async ({
    typeId,
    version,
    originalDraft,
    nextDraft,
    description,
  }) => {
    const actions = syncTypes.buildActions(nextDraft, originalDraft);

    for (var i = 0; i < actions.length; i++) {
      if (actions[i].action == 'setDescription') {
        actions[i].description = description;
      }
    }
    try {
      return await updateCustomFields({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          typeId: typeId,
          version: version,
          actions: createGraphQlUpdateActions(actions),
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};

export const updateCustomTypeKey = () => {
  const [customTypeKeyChange, { loading }] = useMcMutation(
    UpdateCustomTypeKey
  );

  const execute = async ({ typeId, version, actions }) => {
    try {
      return await customTypeKeyChange({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          typeId: typeId,
          version: version,
          actions: actions,
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};

export const addCustomField = (allData) => {
  const [addCustomFields, { loading }] = useMcMutation(AddCustomFieldMutation);
  const execute = async ({ data }) => {
    try {
      return await addCustomFields({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          key: data.key,
          name: data.name,
          description: data.description,
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };
  return {
    loading,
    execute,
  };
};

export const useChannelsFetcher = ({ page, perPage, tableSorting }) => {
  const { data, error, loading } = useMcQuery(FetchChannelsQuery, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    channelsPaginatedResult: data?.channels,
    error,
    loading,
  };
};

export const useChannelDetailsFetcher = (channelId) => {
  const { data, error, loading } = useMcQuery(FetchChannelDetailsQuery, {
    variables: {
      channelId,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    channel: data?.channel,
    error,
    loading,
  };
};

export const useChannelDetailsUpdater = () => {
  const [updateChannelDetails, { loading }] = useMcMutation(
    UpdateChannelDetailsMutation
  );

  const execute = async ({ originalDraft, nextDraft }) => {
    const actions = syncStores.buildActions(
      nextDraft,
      convertToActionData(originalDraft)
    );
    try {
      return await updateChannelDetails({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          channelId: originalDraft.id,
          version: originalDraft.version,
          actions: createGraphQlUpdateActions(actions),
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};

export const getCustomField = (id) => {
  const { data, error, loading } = useMcQuery(FetchCustomFieldDetailQuery, {
    variables: {
      id,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    customFieldDetails: data?.typeDefinition,
    error,
    loading,
  };
};
