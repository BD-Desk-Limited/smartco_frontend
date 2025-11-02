export const sampleData = {
  name: ['Main Branch', 'Downtown Store', 'Airport Branch', 'Mall Outlet'],
  branchId: ['BR001', 'MAIN-01', 'APT-001', 'MALL-02'],
  email: ['mainbranch@company.com', 'downtown@company.com', 'airport@company.com'],
  phoneNumber: ['+234 123 456 7890', '(234) 123-456-7890', '234-123-456-7890'],
  band: ['Premium', 'Standard', 'Basic', 'Enterprise'],
  taxBand: ['Band A', 'Band B', 'Band C', 'Special'],
  taxRate: ['7.5', '5.0', '10.0'],
  address: [
    '123 Business District, Lagos',
    'Plot 45, Victoria Island, Lagos',
    '7th Floor, Shopping Mall, Abuja'
  ],
  openingHour: ['09:00 AM', '08:30 AM', '07:00 AM'],
  closingHour: ['05:00 PM', '09:00 PM', '10:00 PM']
};

export const branchUploadInstructions = [
  {
    field: 'Branch Name',
    required: true,
    format: 'Text',
    examples: ['Main Branch', 'Downtown Store'],
    rules: [
      'Required field',
      'Must contain only letters, numbers, spaces and basic punctuation',
      'Cannot be empty or contain only spaces'
    ]
  },
  {
    field: 'Branch ID',
    required: true,
    format: 'Text',
    examples: ['BR001', 'MAIN-01'],
    rules: [
      'Required field',
      'Must be unique for each branch',
      'Can contain letters, numbers, and hyphens',
      'Cannot be empty or contain only spaces'
    ]
  },
  {
    field: 'Email',
    required: true,
    format: 'Email',
    examples: ['branch1@company.com', 'downtown@business.com'],
    rules: [
      'Required field',
      'Must be a valid email address',
      'Must contain @ symbol and valid domain'
    ]
  },
  {
    field: 'Phone Number',
    required: true,
    format: 'Text',
    examples: ['+1234567890', '(123) 456-7890'],
    rules: [
      'Required field',
      'Must be a valid phone number',
      'Can include country code, spaces, and basic punctuation'
    ]
  },
  {
    field: 'Band',
    required: true,
    format: 'Text',
    examples: ['Premium', 'Standard', 'Basic'],
    rules: [
      'Required field',
      'Must contain only letters, numbers, and basic punctuation',
      'Cannot be empty or contain only spaces'
    ]
  },
  {
    field: 'Tax Band',
    required: true,
    format: 'Text',
    examples: ['A', 'B', 'C'],
    rules: [
      'Required field',
      'Must contain only letters, numbers, and basic punctuation',
      'Cannot be empty or contain only spaces'
    ]
  },
  {
    field: 'Tax Rate',
    required: true,
    format: 'Number',
    examples: ['10', '15.5'],
    rules: [
      'Required field',
      'Must be a valid percentage number',
      'Can include decimal points'
    ]
  },
  {
    field: 'Address',
    required: true,
    format: 'Text',
    examples: ['123 Business Street, City, State 12345'],
    rules: [
      'Required field',
      'Must contain only letters, numbers, spaces and basic punctuation',
      'Cannot be empty or contain only spaces'
    ]
  },
  {
    field: 'Opening Hour',
    required: false,
    format: 'Time (12-hour)',
    examples: ['09:00 AM', '09:00AM'],
    rules: [
      'Optional field',
      'Must be in HH:MM AM/PM format',
      'Hours must be between 01-12',
      'Minutes must be between 00-59',
      'Must include AM or PM (can be with or without space)',
      'Leading zeros required for single-digit hours (e.g., 09:00 AM not 9:00 AM)'
    ]
  },
  {
    field: 'Closing Hour',
    required: false,
    format: 'Time (12-hour)',
    examples: ['05:00 PM', '05:00PM'],
    rules: [
      'Optional field',
      'Must be in HH:MM AM/PM format',
      'Hours must be between 01-12',
      'Minutes must be between 00-59',
      'Must include AM or PM (can be with or without space)',
      'Leading zeros required for single-digit hours (e.g., 05:00 PM not 5:00 PM)'
    ]
  }
];

export const generalInstructions = [
  'All required fields must be filled',
  'Time format must strictly follow HH:MM AM/PM pattern (e.g., 09:00 AM or 09:00AM)',
  'Leading zeros are required for hours in time fields (use 09:00 AM, not 9:00 AM)',
  'Each branch must have a unique Branch ID',
  'Email addresses must be valid and unique for each branch',
  'Phone numbers should include country code or area code where applicable',
  'Excel file should not include any formulas - all cells should contain plain text',
  'Remove any extra spaces at the beginning or end of text fields'
];

export const excelTips = [
  'To ensure correct time format in Excel:',
  '1. Format the time columns as "Text" before entering data',
  '2. Enter times exactly as shown in examples (09:00 AM)',
  '3. Don\'t let Excel auto-format the time cells',
  '4. If copying from another source, use "Paste Values" to avoid format issues'
];

export const commonErrors = [
  {
    error: 'Wrong time format',
    description: 'Times must be in 12-hour format with leading zeros and proper AM/PM',
    examples: {
      incorrect: [
        '9:00 AM (missing leading zero)',
        '9:00 (missing AM/PM)',
        '13:00 (24-hour format not allowed)',
        '9AM (missing minutes)',
        '9:00 am (AM must be uppercase)',
        '09:00:00 AM (no seconds allowed)',
        '09:60 AM (invalid minutes)',
        '13:00 PM (hour must be 1-12)'
      ],
      correct: [
        '09:00 AM (standard morning time)',
        '09:00AM (no space variation)',
        '11:30 PM (late night time)',
        '01:00 PM (afternoon with leading zero)',
        '12:00 PM (noon)',
        '12:00 AM (midnight)'
      ]
    }
  },
  {
    error: 'Invalid email format',
    description: 'Email must be a valid business email with proper domain',
    examples: {
      incorrect: [
        'branch.com (missing @ symbol)',
        '@company.com (missing username)',
        'branch@.com (missing domain)',
        'branch@com (missing domain dot)',
        'branch@company. (incomplete domain)',
        'branch space@company.com (no spaces allowed)',
        'branch..name@company.com (double dots not allowed)'
      ],
      correct: [
        'branch@company.com (standard format)',
        'branch.name@business.com (with dot in username)',
        'branch-name@company.co.uk (with hyphen and extended domain)',
        'branch_name@company.com (with underscore)',
        'branch123@company.com (with numbers)'
      ]
    }
  },
  {
    error: 'Invalid phone number',
    description: 'Phone numbers must include country code and proper formatting',
    examples: {
      incorrect: [
        '123 (too short)',
        'phone (no letters allowed)',
        '+++123 (invalid symbols)',
        '234 (missing country code)',
        '+234123 (too short)',
        '+234abcd (no letters)',
        '234 /// 1234 (invalid separators)'
      ],
      correct: [
        '+234 123 456 7890 (with spaces)',
        '(234) 123-456-7890 (with parentheses)',
        '234-123-456-7890 (with hyphens)',
        '+2341234567890 (without separators)'
      ]
    }
  },
  {
    error: 'Invalid branch ID',
    description: 'Branch IDs must be unique and follow the proper format',
    examples: {
      incorrect: [
        'BR 001 (no spaces allowed)',
        'br001 (must include uppercase)',
        '001 (missing branch identifier)',
        'BRANCH001 (too long)',
        'BR_001 (no special characters except hyphen)',
        'BR001! (no special characters)'
      ],
      correct: [
        'BR001 (standard format)',
        'MAIN-01 (with hyphen)',
        'APT-001 (location prefix)',
        'HQ-001 (headquarters format)'
      ]
    }
  },
  {
    error: 'Invalid tax rate',
    description: 'Tax rates must be valid percentage numbers',
    examples: {
      incorrect: [
        '-5 (no negative values)',
        '5% (no % symbol needed)',
        '7.5.5 (multiple decimals)',
        '100+ (no special characters)',
        'five (no text allowed)'
      ],
      correct: [
        '7.5 (standard VAT rate)',
        '5.0 (with decimal)',
        '10.0 (higher rate)',
        '0.0 (zero rate)'
      ]
    }
  }
];

export const uploadSteps = [
  'Download the template Excel file',
  'Fill in all required fields following the format guidelines',
  'Save the file (ensure it remains in .xlsx format)',
  'Upload the file using the upload button',
  'Review any errors in the validation screen',
  'Fix any reported errors and re-upload if necessary',
  'Confirm and submit when all validations pass'
];