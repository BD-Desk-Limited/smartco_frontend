import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { FaCamera, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '@/contexts/authContext';
import {
  deleteProfilePictureService,
  updateMyProfileService,
  updateProfilePictureService,
} from '@/services/usersServices';
import {
  verifyEmail,
  verifyInputText,
  verifyPhoneNumber,
} from '@/utilities/verifyInput';
import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import WarningModal from '@/components/account/WarningModal';
import SuccessModal from '@/components/account/SuccessModal';

const EDITABLE_FIELDS = ['fullName', 'email', 'phoneNumber'];

const toFormState = (user) => ({
  fullName: user?.fullName || '',
  email: user?.email || '',
  phoneNumber: user?.phoneNumber || '',
  profilePictureUrl: user?.profilePictureUrl || '',
  imageFile: null,
});

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
};

const getErrorMessage = (error, fallback) =>
  typeof error === 'string' ? error : error?.message || fallback;

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-text-gray">{label}</span>
    <span className="text-sm text-text-black font-semibold break-words">
      {value || '—'}
    </span>
  </div>
);

const FormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
}) => (
  <label htmlFor={id} className="text-sm font-semibold text-text-gray">
    {label}
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(id, e.target.value)}
      className="mt-1 border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue"
    />
  </label>
);

const PersonalInformation = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => toFormState(user));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
    useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Keep the form in sync if the user object is (re)hydrated while not editing.
  useEffect(() => {
    if (!isEditing) setForm(toFormState(user));
  }, [user, isEditing]);

  // Only the detail fields that actually differ from the saved user.
  const changedDetails = useMemo(() => {
    const changes = {};
    EDITABLE_FIELDS.forEach((field) => {
      const value = (form[field] || '').trim();
      if (value !== (user?.[field] || '')) changes[field] = value;
    });
    return changes;
  }, [form, user]);

  const hasChanges =
    Boolean(form.imageFile) || Object.keys(changedDetails).length > 0;

  // `user.branch` / `user.team` are raw ids (the sales point relies on that);
  // /auth/me sends the names separately as branchDetails / teamDetails.
  const branches = Array.isArray(user?.branchDetails) ? user.branchDetails : [];

  // Only admins can change their details; everyone else can only change their picture.
  const isAdmin = user?.role === 'admin';
  const pictureOnlyChange = !isAdmin && Boolean(form.imageFile);
  const showActions = isEditing || pictureOnlyChange;

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must not be more than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        profilePictureUrl: reader.result,
        imageFile: file,
      }));
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setForm(toFormState(user));
    setError(null);
    setIsEditing(false);
  };

  const validate = () => {
    const fullNameCheck = verifyInputText(form.fullName);
    if (!fullNameCheck.passed) {
      return `${fullNameCheck.message} Please enter a valid full name.`;
    }
    const emailCheck = verifyEmail(form.email.trim());
    if (!emailCheck.passed) return emailCheck.message;
    if (form.phoneNumber.trim()) {
      const phoneCheck = verifyPhoneNumber(form.phoneNumber.trim());
      if (!phoneCheck.passed) {
        return `${phoneCheck.message} Use the international format, e.g. +2348012345678.`;
      }
    }
    return null;
  };

  const handleOpenModal = () => {
    setError(null);
    if (!hasChanges) {
      setError('You have not made any changes to your details.');
      return;
    }
    const validationError = isAdmin ? validate() : null;
    if (validationError) {
      setError(validationError);
      return;
    }
    setOpenConfirmationModal(true);
  };

  const handleUpdate = async () => {
    // Details: PUT /users/me (admins only, changed fields only).
    // Picture: PUT /users/me/profile-picture (anyone).
    const detailsToSave = isAdmin ? changedDetails : {};
    const hasDetailChanges = Object.keys(detailsToSave).length > 0;

    setError(null);
    setLoading(true);
    try {
      if (hasDetailChanges) {
        const response = await updateMyProfileService(detailsToSave);
        if (response.error) {
          setError(
            getErrorMessage(response.error, 'Failed to update your details.')
          );
          return;
        }
        const saved = response.data?.data || {};
        setUser((prev) => ({
          ...prev,
          fullName: saved.fullName ?? prev?.fullName,
          email: saved.email ?? prev?.email,
          phoneNumber: saved.phoneNumber ?? prev?.phoneNumber,
        }));
      }

      if (form.imageFile) {
        const response = await updateProfilePictureService(form.imageFile);
        if (response.error) {
          const message = getErrorMessage(
            response.error,
            'Failed to update your profile picture.'
          );
          // Details may already be saved; say so rather than implying nothing changed.
          setError(
            hasDetailChanges
              ? `Your details were saved, but the picture was not: ${message}`
              : message
          );
          if (hasDetailChanges) setIsEditing(false);
          return;
        }
        const saved = response.data?.data || {};
        setUser((prev) => ({
          ...prev,
          profilePictureUrl: saved.profilePictureUrl || prev?.profilePictureUrl,
        }));
      }

      setIsEditing(false);
      setSuccessMessage(
        hasDetailChanges
          ? 'Your details were updated successfully!'
          : 'Your profile picture was updated successfully!'
      );
      setSuccess(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update your details. Please try again later.');
    } finally {
      setLoading(false);
      setOpenConfirmationModal(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await deleteProfilePictureService();

      if (response.error) {
        setError(
          getErrorMessage(
            response.error,
            'Failed to delete your profile picture.'
          )
        );
        return;
      }

      setUser((prev) => ({
        ...prev,
        profilePictureUrl: undefined,
      }));
      setForm((prev) => ({
        ...prev,
        profilePictureUrl: '',
        imageFile: null,
      }));
      setSuccessMessage('Your profile picture was deleted successfully!');
      setSuccess(true);
    } catch (err) {
      console.error('Error deleting profile picture:', err);
      setError(
        'Failed to delete your profile picture. Please try again later.'
      );
    } finally {
      setLoading(false);
      setOpenDeleteConfirmationModal(false);
    }
  };

  if (!user) {
    return (
      <div className="text-text-gray text-sm">
        Unable to load your profile information.
      </div>
    );
  }

  const avatarSrc =
    (showActions ? form.profilePictureUrl : user.profilePictureUrl) ||
    '/assets/anonymous.png';

  return (
    <div className="flex flex-col gap-6 text-text-gray w-full">
      {/* Profile summary */}
      <div className="flex flex-row items-center justify-between gap-4 flex-wrap border-b border-gray-border pb-5">
        <div className="flex flex-row items-center gap-4">
          <div className="relative">
            <Image
              src={avatarSrc}
              alt={user.fullName || 'profile picture'}
              width={96}
              height={96}
              style={{ width: 96, height: 96 }}
              className="rounded-full p-1 object-cover shadow-brand-green shadow-sm"
            />
            {(isEditing || !isAdmin) && (
              <label
                htmlFor="profilePicture"
                title="Change picture"
                className="absolute bottom-0 right-0 bg-brand-blue text-text-white p-2 rounded-full shadow-md cursor-pointer hover:scale-105 transition-transform"
              >
                <FaCamera className="text-xs" />
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            {!form.imageFile && user.profilePictureUrl && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setOpenDeleteConfirmationModal(true);
                }}
                title="Delete picture"
                aria-label="Delete profile picture"
                className="absolute top-0 right-0 bg-error text-text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform"
              >
                <FaTrash className="text-xs" />
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text-black">
              {user.fullName || '—'}
            </h2>
            <span className="text-sm">{user.email}</span>
            <span className="flex flex-row gap-2 items-center mt-1">
              {user.role && (
                <span
                  className={`px-2 py-1 text-xs text-white italic rounded-full ${
                    user.role === 'admin'
                      ? 'bg-error'
                      : user.role === 'manager'
                        ? 'bg-brand-blue'
                        : 'bg-brand-gray'
                  }`}
                >
                  {user.superAdmin ? 'super admin' : user.role}
                </span>
              )}
              {typeof user.is_active === 'boolean' && (
                <span className="px-2 text-xs rounded-full bg-gray-shadow5 text-text-black">
                  {user.is_active ? 'active' : 'inactive'}
                </span>
              )}
            </span>
          </div>
        </div>

        {isAdmin && !isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            text="Edit Profile"
            icon={FaEdit}
            buttonStyle="px-4"
          />
        )}
      </div>

      {/* Details */}
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOpenModal();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <FormField
            id="fullName"
            label="Full Name"
            value={form.fullName}
            onChange={handleFieldChange}
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleFieldChange}
          />
          <FormField
            id="phoneNumber"
            label="Phone Number"
            value={form.phoneNumber}
            placeholder="+2348012345678"
            onChange={handleFieldChange}
          />
          <div className="flex flex-col justify-end">
            <InfoRow label="Staff ID" value={user.staffId} />
          </div>
          <button type="submit" className="hidden" aria-hidden="true" />
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InfoRow label="Full Name" value={user.fullName} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Phone Number" value={user.phoneNumber} />
          <InfoRow label="Staff ID" value={user.staffId} />
          <InfoRow label="Team / Department" value={user.teamDetails?.name} />
          <InfoRow label="Member Since" value={formatDate(user.createdAt)} />
        </div>
      )}

      {/* Branches */}
      {branches.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-text-gray">Branches</span>
          <div className="flex flex-row flex-wrap gap-2">
            {branches.map((branch) => (
              <span
                key={branch._id}
                className="px-3 py-1 text-xs rounded-full bg-green-shadow8 text-text-white"
              >
                {branch.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {!isAdmin && (
        <p className="text-xs italic text-text-gray">
          To update your personal details, please contact your administrator.
          You can change your profile picture using the camera icon or delete it
          using the trash icon.
        </p>
      )}

      {error && <ErrorInterface error={error} />}

      {showActions && (
        <div className="flex flex-row justify-center items-center gap-6">
          <Button
            onClick={handleOpenModal}
            text="Save Changes"
            buttonStyle="px-5"
          />
          <Button
            onClick={handleCancel}
            text="Cancel"
            buttonStyle="bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 px-5"
          />
        </div>
      )}

      {openConfirmationModal && (
        <div className="inset-0 z-50 flex justify-center items-center fixed bg-black bg-opacity-80">
          <WarningModal
            title="Update Personal Information"
            message={
              isAdmin
                ? 'Are you sure you want to update your details?'
                : 'Are you sure you want to update your profile picture?'
            }
            onClose={() => setOpenConfirmationModal(false)}
            onClick={handleUpdate}
            button1Text="Yes, Update"
            button2Text="No, Cancel"
            button1Style="text-white hover:bg-blue-shadow5 rounded-md px-4 py-2"
            button2Style="bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 rounded-md px-4 py-2"
            loading={loading}
            loadingText="Updating..."
          />
        </div>
      )}

      {openDeleteConfirmationModal && (
        <div className="inset-0 z-50 flex justify-center items-center fixed bg-black bg-opacity-80">
          <WarningModal
            title="Delete Profile Picture"
            message="Are you sure you want to delete your profile picture?"
            onClose={() => setOpenDeleteConfirmationModal(false)}
            onClick={handleDeleteProfilePicture}
            button1Text="Yes, Delete"
            button2Text="No, Cancel"
            button1Style="bg-error text-white hover:bg-error-hover rounded-md px-4 py-2"
            button2Style="bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 rounded-md px-4 py-2"
            loading={loading}
            loadingText="Deleting..."
          />
        </div>
      )}

      {success && (
        <div className="inset-0 z-50 flex justify-center items-center fixed bg-black bg-opacity-80">
          <SuccessModal
            title="Success"
            message={successMessage}
            onClose={() => setSuccess(false)}
            buttonText="OK"
            buttonStyle="text-white bg-brand-blue hover:bg-blue-shadow5 rounded-md px-4 py-2"
          />
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;
