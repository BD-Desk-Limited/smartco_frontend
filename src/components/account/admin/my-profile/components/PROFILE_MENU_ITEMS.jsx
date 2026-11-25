import DeviceAuthorizations from './DeviceAuthorizations';
import MultiFactorAuthentication from './MultiFactorAuthentication';
import MySessions from './MySessions';
import NotificationsSetting from './NotificationsSetting';
import PersonalInformation from './PersonalInformation';
import ResetPassword from './ResetPassword';

export const PROFILE_MENU_ITEMS = [
  {
    name: 'personal-information',
    label: 'Personal Information',
    content: <PersonalInformation />,
  },
  {
    name: 'security',
    label: 'Security',
    subMenus: [
      {
        name: 'authentication',
        label: 'Multifactor Authentication',
        content: <MultiFactorAuthentication />,
      },
      {
        name: 'reset-password',
        label: 'Reset Password',
        content: <ResetPassword />,
      },

      {
        name: 'device-authorizations',
        label: 'Device Authorization',
        content: <DeviceAuthorizations />,
      },

      {
        name: 'sessions',
        label: 'My sessions',
        content: <MySessions />,
      },
    ],
  },

  /*{
    name: 'notifications',
    label: 'Notifications',
    content: <NotificationsSetting />,
   },*/
];
