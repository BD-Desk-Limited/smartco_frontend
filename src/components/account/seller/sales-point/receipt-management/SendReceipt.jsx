import React, { useState } from 'react';
import { FaEnvelope, FaTimes, FaWhatsapp } from 'react-icons/fa';
import {
  verifyEmail,
  normalizePhoneForWhatsapp,
} from '@/utilities/verifyInput';

const SendReceipt = ({
  linkedCustomer,
  receiptText,
  isScheduled,
  onClose,
  onSendEmail,
  onSendWhatsapp,
  isSendingEmail,
}) => {
  const [email, setEmail] = useState(linkedCustomer?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(linkedCustomer?.phone || '');
  const [message, setMessage] = useState(receiptText || '');

  const RECEIPT_SEND_METHODS = [
    {
      id: 'email',
      label: 'Send via Email',
      onClickLabel: 'Sending',
      icon: <FaEnvelope className="mr-2 inline-block" />,
      onClick: () => handleEmailSend(),
      disabled: null,
      style: { backgroundColor: '#007BFF' },
      status: 'active',
    },
    {
      id: 'whatsapp',
      label: 'Send via WhatsApp',
      onClickLabel: 'Sending',
      icon: <FaWhatsapp className="mr-2 inline-block text-white" />,
      onClick: () => handleWhatsappSend(),
      disabled: null,
      style: {
        backgroundColor: '#25D366',
      },
      status: 'inactive',
    },
  ];

  const handleEmailSend = () => {
    onSendEmail({ email, message: message.trim() });
  };

  const handleWhatsappSend = () => {
    onSendWhatsapp({ phoneNumber, message: message.trim() });
  };

  return (
    <div className="w-96 min-h-[50vh] rounded-lg bg-white p-5 shadow-lg relative">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-md font-semibold">
          Send {isScheduled ? 'Order Notice' : 'Receipt'}
        </h3>
        <button
          className="absolute top-0 right-0 rounded-full bg-gray-shadow8 p-2 text-gray-500 transition-colors hover:bg-gray-shadow4 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>

      {/* buttons for sending receipt methods */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2">
        {RECEIPT_SEND_METHODS.map((method) => (
          <button
            key={method.id}
            className={`flex flex-col flex-wrap h-52 w-32 items-center rounded p-2 text-white transition-colors text-sm hover:bg-opacity-50 ${method.status !== 'active' ? 'cursor-not-allowed opacity-50' : ''}`}
            style={method.style}
            onClick={method.onClick}
            disabled={method.status !== 'active'}
          >
            {method.icon}
            {method.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SendReceipt;
