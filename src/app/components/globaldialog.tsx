'use client';

import { useDialogStore } from '@/lib/store/dialog-store';
import ReusableDialog from '@/shadcn/ui/modal';
import LoginForm from './dialogs/auth/login';
import ReservationSummary from './ui/message/resevationSummary';
import { useMessageStore } from './ui/message/store';
import { SignUpFormInputs } from './dialogs/verification';
import Verification from './dialogs/verification';
import PhotoUpload from './dialogs/createlisting/upload-photos';
import EditListing from './dialogs/createlisting/editlisting';
import Space from './dialogs/createlisting/space';
import DeletePhoto from './dialogs/createlisting/deletephoto';
import EditProfileModal from './dialogs/editprofile-modal';
import RoomPhotoUpload from './dialogs/createlisting/roomImage-upload';
import { useGlobalStore } from '@/lib/store/global-store';

export default function GlobalDialogs() {
  const {
    name,
    nameNested,
    props,
    propsNested,
    closeDialog,
    openDialog,
    closeDialogNested,
  } = useDialogStore();
  const { setReserveSection } = useMessageStore();
  const { title } = useGlobalStore();
  return (
    <>
      <ReusableDialog
        open={name === 'Login'}
        onOpenChange={closeDialog}
        title={title}
      >
        <LoginForm />
      </ReusableDialog>

      <ReusableDialog
        open={name === 'details'}
        onOpenChange={() => {
          openDialog('');
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('details');
            window.history.replaceState({}, '', url.toString());
            setReserveSection(false);
          }
        }}
        title="Reservation"
      >
        <ReservationSummary />
      </ReusableDialog>

      <ReusableDialog
        open={nameNested === 'EmailVerify'}
        onOpenChange={closeDialogNested}
        title="Confirm account"
      >
        {propsNested && (
          <Verification
            props={
              propsNested as {
                values: SignUpFormInputs;
                isEmail: boolean;
                isSignup: boolean;
              }
            }
          />
        )}
      </ReusableDialog>

      <ReusableDialog
        open={name === 'Uploadphotos'}
        onOpenChange={closeDialog}
        title="Upload Photos"
      >
        <PhotoUpload />
      </ReusableDialog>

      <ReusableDialog
        open={name === 'RoomUploadphotos'}
        onOpenChange={closeDialog}
        title="Upload Photos"
      >
        <RoomPhotoUpload data={props} />
      </ReusableDialog>

      <ReusableDialog
        open={name === 'editlisting'}
        onOpenChange={closeDialog}
        title="Edit listing"
      >
        <EditListing index={(props as { index: number }).index} />
      </ReusableDialog>

      <ReusableDialog
        open={name === 'space'}
        onOpenChange={closeDialog}
        title="Choose a room or space"
        footer={true}
      >
        <Space />
      </ReusableDialog>

      <ReusableDialog
        open={name === 'DeletePhoto'}
        onOpenChange={closeDialog}
        title=""
        footer={true}
      >
        <DeletePhoto index={(props as { index: number[] }).index} />
      </ReusableDialog>

      <ReusableDialog
        open={name === 'editprofilemodal'}
        onOpenChange={closeDialog}
        title=""
        footer={true}
      >
        <EditProfileModal data={props} />
      </ReusableDialog>
    </>
  );
}
