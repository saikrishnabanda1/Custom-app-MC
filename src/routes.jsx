import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import Channels from './components/channels';
import Welcome from './components/welcome';
import CustomField from './components/customField/customField';
import CustomFieldForm from './components/customFieldForm/CustomFieldForm';
import CustomFeature from './components/customFeature'
import CustomFieldComp from './components/custom-field';
import FormComponent from './components/custom-form';
const ApplicationRoutes = () => {
  const match = useRouteMatch();
  /**
   * When using routes, there is a good chance that you might want to
   * restrict the access to a certain route based on the user permissions.
   * You can evaluate user permissions using the `useIsAuthorized` hook.
   * For more information see https://docs.commercetools.com/custom-applications/development/permissions
   *
   * NOTE that by default the Custom Application implicitly checks for a "View" permission,
   * otherwise it won't render. Therefore, checking for "View" permissions here
   * is redundant and not strictly necessary.
   */

  return (
    <Spacings.Inset scale="l">
      <Switch>
        <Route path={`${match.path}/channels`}>
          <Channels linkToWelcome={match.url} />
        </Route>
        {/* <Route path={`${match.path}/customField`}>
          <CustomField />
        </Route> */}
        <Route path={`${match.path}/custom-form`}>
          <FormComponent />
        </Route>
        <Route path={`${match.path}/customFeature`}>
          <CustomFeature />
        </Route>
        {/* <Route path={`${match.path}/customFieldForm`}>
          <CustomFieldForm />
        </Route> */}
      </Switch>
    </Spacings.Inset>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
