import React, { useCallback, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { useHistory, useLocation } from 'react-router';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { ProfileIcon } from 'src/assets/images/sidebar/ProfileIcon';
import { ChevronIcon } from 'src/assets/images/ChevronIcon';
import { useSelector } from 'react-redux';
import { selectOrganizationAbilities, selectUserInfo, selectUserProfile } from 'src/modules';
import { isUsernameEnabled } from 'src/api';

const HeaderProfileComponent: React.FC = () => {
    const [profileOpen, setProfileOpen] = React.useState<boolean>(false);
    
    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const user = useSelector(selectUserInfo);
    const userProfile = useSelector(selectUserProfile);
    const orgAbilities = useSelector(selectOrganizationAbilities);
    const location = useLocation();
    const history = useHistory();

    const switchSessionsAbilities = ['AdminSwitchSession', 'SwitchSession'];

    useEffect(() => {
        if (profileOpen) {
            document.addEventListener('click', closeProfileMenu);
        } else {
            document.removeEventListener('click', closeProfileMenu);
        }
    }, [profileOpen]); 

    const toggleProfileMenu = useCallback(() => {
        setProfileOpen(!profileOpen);
    }, [profileOpen]);

    const closeProfileMenu = useCallback(() => {
        setProfileOpen(false);
    }, []);

    const switchAbility = useCallback(() => {
        const abilities = orgAbilities?.manage || []
        return abilities.some(ability => switchSessionsAbilities.includes(ability))
    }, [orgAbilities, switchSessionsAbilities])

    const accountSwitch = useMemo(() => {
        if (location.pathname.includes('/trading') || !window.env?.organization_enabled || !switchAbility()) {
            return null;
        }
        const displayName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : (isUsernameEnabled() ? user.username : user.email)

        return (
            <div className="account-switch">
                <div className="account-switch__icon">
                    <ProfileIcon />
                </div>
                <div className="account-switch__user">
                    <div className="account-switch__user__name">{displayName}</div>
                    <div className="account-switch__user__uid">{user.oid || user.uid}</div>
                </div>
                <div className="account-switch__button" onClick={() => history.push('/accounts/switch')}>
                    <div className="account-switch__button__icon"><ChevronIcon /></div>
                </div>
            </div>
        );
    }, [user, location, switchAbility]);

    return (
        <div className="cr-header-profile">
            {accountSwitch}
        </div>
    );
};

export const HeaderProfile = React.memo(HeaderProfileComponent);
