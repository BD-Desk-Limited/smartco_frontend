export const setupStepConfigs = {
    'branch-set-up': {
      title: 'Create Your First Branch',
      description: 'Set up your main business location to start managing operations',
      icon: '🏢',
      color: 'blue',
      actionUrl: '/pages/account/admin/branch-management/create-branch',
      allowedPages: [
        "/pages/account/admin/branch-management/create-branch",
        "/pages/account/admin/branch-management/create-branch/bulk",
        "/pages/account/admin/branch-management/create-branch/bulk/review-upload",
        "/pages/account/admin/branch-management"
      ],
      benefits: [
        'Organize business operations by location',
        'Track inventory and sales by branch',
        'Assign staff to specific branches'
      ]
    },

    'material-set-up': {
      title: 'Add Materials',
      description: 'Define materials used in your product manufacturing',
      icon: '🔧',
      color: 'purple',
      actionUrl: '/pages/account/admin/manage-materials/create-material',
      allowedPages: [
        '/pages/account/admin/manage-materials/create-material',
        '/pages/account/admin/manage-materials',
        '/pages/account/admin/manage-materials/view-materials',
        '/pages/account/admin/manage-materials/bulk-material-upload',
        '/pages/account/admin/manage-materials/bulk-upload-review'
        
      ],
      benefits: [
        'Track raw material inventory',
        'Calculate production costs accurately',
        'Plan material procurement'
      ]
    },

    'user-set-up': {
      title: 'Add Team Members',
      description: 'Invite team members and assign roles (Optional)',
      icon: '👥',
      color: 'orange',
      actionUrl: '/pages/account/admin/users-management/create-user',
      allowedPages: [
        '/pages/account/admin/users-management',
        '/pages/account/admin/users-management/create-user',
        '/pages/account/admin/users-management/create-bulk-user',
        '/pages/account/admin/users-management/bulk-upload-review'
      ],
      benefits: [
        'Collaborate with your team',
        'Control access with role-based permissions',
        'Track user activities and performance'
      ]
    },

    /*
    'taxband-set-up': {
      title: 'Configure Tax Bands',
      description: 'Set up tax rates that will be applied to your products',
      icon: '📊',
      color: 'green',
      actionUrl: '/pages/account/admin/tax-management/create-taxBand',
      allowedPages: [
        '/pages/account/admin/tax-management/create-taxBand',
      ],
      benefits: [
        'Automatically calculate taxes on sales',
        'Comply with local tax regulations',
        'Generate accurate tax reports',
      ]
    },
    */
  };