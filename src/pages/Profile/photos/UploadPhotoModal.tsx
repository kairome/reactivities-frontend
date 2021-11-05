import React, { useCallback, useRef, useState } from 'react';
import Modal from 'ui/Modal/Modal';
import { useDropzone } from 'react-dropzone';

import s from './Photos.css';
import Cropper from 'react-cropper';
import Button from 'ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useMutation } from 'react-query';
import { uploadProfilePhoto } from 'api/user';
import { useAlert } from 'recoil/alertState';
import handleApiErrors from 'api/handleApiErrors';
import handleApiSuccess from 'api/handleApiSuccess';
import { fetchCurrentUser } from 'api/account';
import useQueryUpdate from 'api/useQueryUpdate';
import useModal from 'hooks/useModal';

const modalKey = 'uploadProfilePhoto';


const UploadPhotoModal: React.FC = () => {
  const [currentPhoto, setCurrentPhoto] = useState<File | null>(null);
  const updateUserData = useQueryUpdate();
  const { spawnAlert } = useAlert();
  const { closeModal } = useModal(modalKey);

  const onDrop = useCallback(acceptedFiles => {
    setCurrentPhoto(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const uploadMutation = useMutation(uploadProfilePhoto.name, uploadProfilePhoto.request, {
    onSuccess: (data) => {
      updateUserData(fetchCurrentUser.name, data);
      handleApiSuccess('Profile photo uploaded!', spawnAlert);
      setCurrentPhoto(null);
      setCroppedCanvas(null);
      closeModal();
    },
    onError: (err: any) => {
      handleApiErrors(err.Message, 'Failed to upload profile photo', spawnAlert);
    },
  });

  const cropperRef = useRef<HTMLImageElement | null>(null);
  const [croppedCanvas, setCroppedCanvas] = useState<any>(null);

  const handleCrop = () => {
    if (cropperRef.current) {
      const imageElement: any = cropperRef.current;
      const cropper = imageElement?.cropper;
      setCroppedCanvas(cropper.getCroppedCanvas());
    }
  };

  const handleSubmit = () => {
    if (!croppedCanvas || !currentPhoto) {
      return;
    }

    croppedCanvas.toBlob((blob: Blob) => {
      const formData = new FormData();
      formData.append('file', blob, currentPhoto.name);
      uploadMutation.mutate(formData);
    });
  };

  const renderContent = () => {
    if (!currentPhoto) {
      const dropzoneClasses = classNames(s.dropZone, {
        [s.dropZoneActive]: isDragActive,
      });
      return (
        <div {...getRootProps()} className={dropzoneClasses}>
          <input {...getInputProps()} />
          <div className={s.dropZoneText}>
            <FontAwesomeIcon icon={faCloudUploadAlt} />
            <div>Drag and drop or click to select a file</div>
          </div>
        </div>
      );
    }

    if (croppedCanvas !== null) {
      return (
        <div>
          <img src={croppedCanvas.toDataURL()} />
          <div className={s.uploadBtns}>
            <Button
              theme="primary"
              text="Set as profile picture"
              className={s.uploadBtn}
              onClick={handleSubmit}
              isLoading={uploadMutation.isLoading}
            />
            <Button
              theme="danger"
              text="Cancel"
              onClick={() => setCroppedCanvas(null)}
              disabled={uploadMutation.isLoading}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={s.uploadedPhotoContainer}>
        <div className={s.originalContainer}>
          <div className={s.uploadSectionTitle}>Original</div>
          <Cropper
            src={URL.createObjectURL(currentPhoto)}
            initialAspectRatio={16 / 9}
            minCropBoxHeight={200}
            minCropBoxWidth={200}
            ref={cropperRef}
            preview={`.${s.cropPreview}`}
            className={s.uploadedPhoto}
          />
          <div className={s.uploadBtns}>
            <Button
              theme="action"
              text="Crop"
              className={s.uploadBtn}
              onClick={handleCrop}
            />
            <Button
              theme="danger"
              text="Clear"
              onClick={() => setCurrentPhoto(null)}
            />
          </div>
        </div>
        <div className={s.previewContainer}>
          <div className={s.uploadSectionTitle}>Preview</div>
          <div className={s.cropPreview} />
        </div>
      </div>
    );
  };

  return (
    <Modal modalKey={modalKey} title="Upload new profile photo">
      {renderContent()}
    </Modal>
  );
};

export default UploadPhotoModal;
