import { IndiParagraph } from '@/components/text';
import { Pencil, Pin, Trash2 } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { IndiButton } from '../buttons/base';
import { Divider } from '../divider';
import { IndiDropdown } from '../dropdowns/dropdown';
import { IndiLabelInput } from '../inputs';
import { IndiAvatarIcon } from '../miscellaneous/avatarIcon';
import { IndiModal } from '../modal';
import { IndiXStack, IndiYStack } from '../views';

export const JobNote = () => {
  const [isOpenDropdownMenu, setIsOpenDropdownMenu] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <IndiXStack py="$4" gap="$4" bbw={1} bc="$border">
      <IndiAvatarIcon text="SA" />
      <IndiYStack gap="$2" flex={1}>
        <IndiParagraph fontWeight="bold">
          Sally Anderson
          <IndiParagraph color="$textPlaceholder" ml="$2">
            12/12/23, 12:30pm
          </IndiParagraph>
        </IndiParagraph>
        <IndiParagraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor
          sit amet lacus accumsan et viverra justo commodo.
        </IndiParagraph>
      </IndiYStack>

      <IndiDropdown
        open={isOpenDropdownMenu}
        onOpenChange={setIsOpenDropdownMenu}
        data={[
          {
            text: 'Pin note',
            icon: Pin,
            onPress: () => {},
            type: 'ghost',
            color: 'secondary',
            visible: true,
          },
          {
            text: 'Edit note',
            icon: Pencil,
            onPress: () => setIsOpenModal(true),
            type: 'ghost',
            color: 'secondary',
            visible: true,
          },
          {
            text: 'Delete note',
            icon: Trash2,
            onPress: () => {},
            type: 'ghost',
            color: 'red',
            visible: true,
          },
        ]}
      />
      <IndiModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        title="Edit note"
        confirmButtonText="Save"
        tertiaryButton={
          <IndiButton type="link" color="red" size="md" onPress={() => {}} text={'Delete note'} icon={Trash2} />
        }>
        <IndiYStack gap="$8">
          <IndiLabelInput
            area
            inputProps={{
              placeholder: 'Edit note',
            }}
            id={'edit_note'}
            label={'Note'}
          />
          <Divider />
        </IndiYStack>
      </IndiModal>
    </IndiXStack>
  );
};
