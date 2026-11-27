import {
  FaCashRegister,
  FaCreditCard,
  FaMobile,
  FaMoneyBillAlt,
} from 'react-icons/fa';

/*
  The one list of payment methods for the whole app: the till (sellers) and the manager and admin
  screens (reports, refunds). To add, rename or stop taking a method, change it here.

  The server keeps the same list in utilities/paymentMethods.js and rejects a method
  it does not know, so change both.

  Each method:
    value       what is saved on payments and refunds. Never change it once used.
    label       what people see.
    offered     false = no longer taken at the till or for refunds. Keep the method in the list so
                payments already made with it still show its name.
    tillScreen  the till screen that takes the payment:
                  'cash'        enter the amount received, shows the change
                  'terminal'    take the money on another device (POS terminal...), then confirm
                  'unavailable' listed, but cannot be used yet
    icon, image the till's method button.
    style       Tailwind classes for the till's payment screen.
*/
export const METHODS = [
  {
    value: 'cash',
    label: 'Cash',
    offered: true,
    tillScreen: 'cash',
    icon: FaMoneyBillAlt,
    image: '/assets/cash_payment.svg',
    style: {
      overlay: 'border-2 border-brand-green',
      button: 'bg-brand-green text-white',
      spinnerColor: 'brand-green',
    },
  },
  {
    value: 'pos',
    label: 'P.O.S',
    offered: true,
    tillScreen: 'terminal',
    icon: FaCashRegister,
    image:
      'https://www.golomtbank.com/wp-content/uploads/2020/06/V240M-1-1.png',
    style: {
      overlay: 'border-2 border-red-500',
      button: 'bg-red-500 text-white',
      spinnerColor: 'red-500',
    },
  },
  {
    value: 'card',
    label: 'Card',
    offered: true,
    tillScreen: 'unavailable',
    icon: FaCreditCard,
    image: '/assets/card_payment_method.png',
    style: {
      overlay: 'border-2 border-blue-500',
      button: 'bg-blue-500 text-white',
      spinnerColor: 'blue-500',
    },
  },
  {
    value: 'bank_transfer',
    label: 'Bank Transfer',
    offered: true,
    tillScreen: 'unavailable',
    icon: FaMobile,
    image: '/assets/bank_payment_method.png',
    style: {
      overlay: 'border-2 border-yellow-500',
      button: 'bg-yellow-500 text-white',
      spinnerColor: 'yellow-500',
    },
  },
];

// the methods that can be used now (the till's buttons, the refund form)
export const OFFERED_METHODS = METHODS.filter((m) => m.offered);

// the name to show for a saved method value
export const methodLabel = (value) =>
  METHODS.find((m) => m.value === value)?.label || value;
