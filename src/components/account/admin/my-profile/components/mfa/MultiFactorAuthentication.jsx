import React, { useCallback, useEffect, useState } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import Spinner from '@/components/account/Spinner';
import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import {
  getMfaSettingsService,
  removeSecurityQuestionsService,
  saveSecurityQuestionsService,
  updateMfaSettingsService,
} from '@/services/mfaServices';
import MfaToggle from './MfaToggle';
import MfaMethodOptions from './MfaMethodOptions';
import SecurityQuestionsForm from './SecurityQuestionsForm';
import PasswordConfirmModal from './PasswordConfirmModal';

// Copy for each action that needs the password before it runs.
const CONFIRMATIONS = {
  disable: {
    title: 'Turn off multifactor authentication',
    message:
      'Without MFA, anyone who learns your password can sign in to your account. Are you sure you want to turn it off?',
    confirmText: 'Turn off MFA',
    danger: true,
  },
  saveQuestions: {
    title: 'Save security questions',
    message: 'Your new questions will replace any you set up before.',
    confirmText: 'Save questions',
  },
  removeQuestions: {
    title: 'Remove security questions',
    message:
      'You will no longer be able to verify with a security question. If it is your preferred method, email will be used instead.',
    confirmText: 'Remove',
    danger: true,
  },
};

const MultiFactorAuthentication = () => {
  const [settings, setSettings] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingQuestions, setEditingQuestions] = useState(false);
  const [pending, setPending] = useState(null);
  const [modalError, setModalError] = useState(null);

  const load = useCallback(async () => {
    setLoadError(null);
    const response = await getMfaSettingsService();
    if (response.error) setLoadError(response.error);
    else setSettings(response.data.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const applyResult = (response, successMessage) => {
    if (response.error) {
      setError(response.error);
      return false;
    }
    setSettings(response.data.data);
    setNotice(successMessage);
    return true;
  };

  const runUpdate = async (body, successMessage) => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      applyResult(await updateMfaSettingsService(body), successMessage);
    } finally {
      setSaving(false);
    }
  };

  const openConfirm = (action) => {
    setModalError(null);
    setPending(action);
  };

  // Turning on is immediate; turning off needs confirmation + password.
  const handleToggle = (next) => {
    setError(null);
    setNotice(null);
    if (next) runUpdate({ enabled: true }, 'Multifactor authentication is on.');
    else openConfirm({ type: 'disable' });
  };

  // Runs the pending action once the user has typed their password.
  const handleConfirm = async (password) => {
    setSaving(true);
    setModalError(null);
    try {
      let response;
      let successMessage;
      if (pending.type === 'disable') {
        response = await updateMfaSettingsService({ enabled: false, password });
        successMessage = 'Multifactor authentication is off.';
      } else if (pending.type === 'saveQuestions') {
        response = await saveSecurityQuestionsService(
          pending.questions,
          password
        );
        successMessage = 'Security questions saved.';
      } else {
        response = await removeSecurityQuestionsService(password);
        successMessage = 'Security questions removed.';
      }

      if (response.error) {
        setModalError(response.error); // keep the modal open, e.g. wrong password
        return;
      }
      setSettings(response.data.data);
      setNotice(successMessage);
      setEditingQuestions(false);
      setPending(null);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return loadError ? (
      <div className="flex flex-col items-center gap-3 py-10">
        <ErrorInterface error={loadError} />
        <Button onClick={load} text="Try again" buttonStyle="px-5" />
      </div>
    ) : (
      <Spinner />
    );
  }

  const questionCount = settings.securityQuestions.length;
  const confirmation = pending && CONFIRMATIONS[pending.type];

  return (
    <div className="flex flex-col gap-6 text-text-gray w-full">
      {/* Master switch */}
      <section className="flex flex-row items-start justify-between gap-4 border-b border-gray-border pb-5 sticky top-[-5] bg-text-white">
        <div className="flex flex-row gap-3">
          <FaShieldAlt
            className={`text-2xl mt-1 ${settings.enabled ? 'text-brand-green' : 'text-text-gray'}`}
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text-black">
              Multifactor authentication
            </h2>
            <p className="text-sm">
              {settings.enabled
                ? 'On — after your password, you confirm it is you with a second step.'
                : 'Off — you sign in with your password only.'}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-2 text-sm font-semibold">
          {settings.enabled ? 'On' : 'Off'}
          <MfaToggle
            checked={settings.enabled}
            disabled={saving}
            onChange={handleToggle}
            label="Multifactor authentication"
          />
        </span>
      </section>

      {/* Preferred method */}
      <section
        className={`flex flex-col gap-3 ${settings.enabled ? '' : 'opacity-60'}`}
      >
        <div>
          <h3 className="text-base font-semibold text-text-black">
            Preferred verification method
          </h3>
          <p className="text-xs">
            Used first when you sign in. You can always switch to another
            available method on the sign-in screen, and email is always
            available as a backup.
          </p>
        </div>
        <MfaMethodOptions
          settings={settings}
          disabled={!settings.enabled || saving}
          onSelect={(method) =>
            runUpdate({ preferredMethod: method }, 'Preferred method updated.')
          }
        />
      </section>

      {/* Security questions */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-base font-semibold text-text-black">
              Security questions
            </h3>
            <p className="text-xs">
              {questionCount
                ? `${questionCount} questions set up.`
                : 'Not set up. Add questions to use them as a verification method.'}
            </p>
          </div>
          {!editingQuestions && (
            <div className="flex flex-row gap-3">
              <Button
                onClick={() => setEditingQuestions(true)}
                text={questionCount ? 'Change questions' : 'Set up questions'}
                buttonStyle="px-4"
              />
              {questionCount > 0 && (
                <Button
                  onClick={() => openConfirm({ type: 'removeQuestions' })}
                  text="Remove"
                  buttonStyle="bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 px-4"
                />
              )}
            </div>
          )}
        </div>

        {editingQuestions ? (
          <SecurityQuestionsForm
            loading={saving}
            onCancel={() => setEditingQuestions(false)}
            onSubmit={(questions) =>
              openConfirm({ type: 'saveQuestions', questions })
            }
          />
        ) : (
          questionCount > 0 && (
            <ul className="flex flex-col gap-1 text-sm list-disc pl-5">
              {settings.securityQuestions.map((q) => (
                <li key={q._id}>{q.question}</li>
              ))}
            </ul>
          )
        )}
      </section>

      {error && <ErrorInterface error={error} />}
      {notice && <p className="text-sm text-success">{notice}</p>}

      {confirmation && (
        <PasswordConfirmModal
          {...confirmation}
          loading={saving}
          error={modalError}
          onConfirm={handleConfirm}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  );
};

export default MultiFactorAuthentication;
