import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { transformLocalizedFieldToLocalizedString } from '@commercetools-frontend/l10n';

export const docToFormValues = (customFieldDetails, languages) => ({
  key: customFieldDetails?.key ?? '',
  name: LocalizedTextInput.createLocalizedString(
    languages,
    transformLocalizedFieldToLocalizedString(
      customFieldDetails?.nameAllLocales ?? []
    )
  ),
  description: LocalizedTextInput.createLocalizedString(
    languages,
    transformLocalizedFieldToLocalizedString(
      customFieldDetails?.descriptionAllLocales ?? []
    )
  ),
  fieldDefinition: customFieldDetails?.fieldDefinitions,
});

export const docToFormValuesForCreateType = (addCustomType, languages) => ({
  key: addCustomType?.key ?? '',
  name: '',
  description: '',
  errors:{
    
  },
  // description: LocalizedTextInput.createLocalizedString(
  //   languages,
  //   transformLocalizedFieldToLocalizedString(
  //     addCustomType?.descriptionAllLocales ?? []
  //   )
  // ),
  fieldDefinitions: addCustomType.fieldDefinitions
});

export const formValuesToDoc = (formValues) => ({
  key: formValues.key,
  name: LocalizedTextInput.omitEmptyTranslations(formValues.name),
  description: LocalizedTextInput.omitEmptyTranslations(formValues.description),
});
