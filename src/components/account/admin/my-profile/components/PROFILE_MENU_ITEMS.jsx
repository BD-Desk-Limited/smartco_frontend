import DeviceAuthorizations from './devices/DeviceAuthorizations';
import MultiFactorAuthentication from './mfa/MultiFactorAuthentication';
import MySessions from './sessions/MySessions';
import NotificationsSetting from './NotificationsSetting';
import PersonalInformation from './PersonalInformation';
import ResetPassword from './password/ResetPassword';

export const PROFILE_MENU_ITEMS = [
  {
    name: 'personal-information',
    label: 'Personal Information',
    keywords: ['name', 'email', 'phone', 'profile picture', 'photo', 'avatar'],
    content: <PersonalInformation />,
  },
  {
    name: 'security',
    label: 'Security',
    subMenus: [
      {
        name: 'authentication',
        label: 'Multifactor Authentication',
        keywords: [
          'mfa',
          '2fa',
          'two factor',
          'otp',
          'verification code',
          'security questions',
        ],
        content: <MultiFactorAuthentication />,
      },
      {
        name: 'reset-password',
        label: 'Reset Password',
        keywords: ['change password', 'new password'],
        content: <ResetPassword />,
      },

      {
        name: 'device-authorizations',
        label: 'Device Authorization',
        keywords: ['trusted devices', 'authorized devices', 'revoke device'],
        content: <DeviceAuthorizations />,
      },

      {
        name: 'sessions',
        label: 'My sessions',
        keywords: [
          'logged in devices',
          'sign out',
          'log out',
          'active sessions',
        ],
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
