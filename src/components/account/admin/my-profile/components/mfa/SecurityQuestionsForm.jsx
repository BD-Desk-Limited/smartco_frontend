import React, { useState } from 'react';
import Button from '@/components/account/common/Button';
import ErrorInterface from '@/components/account/common/errorInterface';

const SUGGESTED_QUESTIONS = [
  'What was the name of your first pet?',
  'In what city were you born?',
  'What is your mother’s maiden name?',
  'What was the name of your primary school?',
  'What was the make of your first car?',
  'What is the name of the street you grew up on?',
  'What was your childhood nickname?',
];
const CUSTOM = '__custom__';
const MIN_QUESTIONS = 2;
const MAX_QUESTIONS = 3;

const emptyRow = () => ({ choice: '', custom: '', answer: '' });
const questionOf = (row) =>
  row.choice === CUSTOM ? row.custom.trim() : row.choice;

// Collects 2-3 question/answer pairs. Password confirmation happens in the parent.
const SecurityQuestionsForm = ({ onSubmit, onCancel, loading }) => {
  const [rows, setRows] = useState(() =>
    Array.from({ length: MAX_QUESTIONS }, emptyRow)
  );
  const [error, setError] = useState(null);

  const updateRow = (index, patch) =>
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const filled = rows.filter((row) => questionOf(row) || row.answer.trim());
    if (filled.length < MIN_QUESTIONS) {
      return setError(`Please answer at least ${MIN_QUESTIONS} questions.`);
    }
    if (
      filled.some((row) => !questionOf(row) || row.answer.trim().length < 2)
    ) {
      return setError(
        'Each question needs an answer of at least 2 characters.'
      );
    }
    if (filled.some((row) => questionOf(row).length < 5)) {
      return setError('Custom questions must be at least 5 characters long.');
    }
    const questions = filled.map((row) => ({
      question: questionOf(row),
      answer: row.answer.trim(),
    }));
    const unique = new Set(questions.map((q) => q.question.toLowerCase()));
    if (unique.size !== questions.length) {
      return setError('Please choose a different question for each row.');
    }
    onSubmit(questions);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-xs text-text-gray">
        Choose {MIN_QUESTIONS}–{MAX_QUESTIONS} questions only you can answer.
        Answers are stored encrypted and are not case sensitive.
      </p>

      {rows.map((row, index) => {
        const takenByOthers = rows
          .filter((_, i) => i !== index)
          .map((r) => r.choice)
          .filter((c) => c && c !== CUSTOM);

        return (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b border-gray-border pb-3"
          >
            <label className="text-xs font-semibold text-text-gray flex flex-col gap-1">
              Question {index + 1}
              {index >= MIN_QUESTIONS && ' (optional)'}
              <select
                value={row.choice}
                onChange={(e) => updateRow(index, { choice: e.target.value })}
                className="border border-gray-border rounded-md p-2 text-sm text-text-black focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="">Select a question</option>
                {SUGGESTED_QUESTIONS.filter(
                  (q) => !takenByOthers.includes(q)
                ).map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
                <option value={CUSTOM}>Write my own question…</option>
              </select>
              {row.choice === CUSTOM && (
                <input
                  type="text"
                  maxLength={200}
                  value={row.custom}
                  placeholder="Type your question"
                  onChange={(e) => updateRow(index, { custom: e.target.value })}
                  className="border border-gray-border rounded-md p-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              )}
            </label>
            <label className="text-xs font-semibold text-text-gray flex flex-col gap-1">
              Answer
              <input
                type="text"
                autoComplete="off"
                maxLength={100}
                value={row.answer}
                onChange={(e) => updateRow(index, { answer: e.target.value })}
                className="border border-gray-border rounded-md p-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </label>
          </div>
        );
      })}

      {error && <ErrorInterface error={error} />}

      <div className="flex flex-row gap-4">
        <Button
          type="submit"
          text="Save questions"
          loading={loading}
          buttonStyle="px-5"
        />
        <Button
          onClick={onCancel}
          text="Cancel"
          buttonStyle="bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 px-5"
        />
      </div>
    </form>
  );
};

export default SecurityQuestionsForm;
