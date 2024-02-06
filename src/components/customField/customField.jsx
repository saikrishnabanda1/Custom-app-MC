import React from 'react'
import Spacings from '@commercetools-uikit/spacings';
import PropTypes from 'prop-types';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import {  PlusThinIcon } from '@commercetools-uikit/icons';
import { CustomCss } from './style';
import { useHistory, useRouteMatch} from "react-router-dom";

const CustomFieldB = () => {
    let history = useHistory();
    const match = useRouteMatch();
    // let navigate = useNavigate();
    return (
        <Spacings.Stack scale="xl">
            <CustomCss>
                <Text.Headline as="h2" intlMessage={messages.title} />
                <SecondaryButton iconLeft={<PlusThinIcon />} size='small' label="Add a feature" onClick={() => history.replace(`${match.url.split('/',3).join('/')}/customFieldForm`, { shallow: true })} />
            </CustomCss>
        </Spacings.Stack>
    )
}

export default CustomFieldB;