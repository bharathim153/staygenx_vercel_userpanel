'use client';

import {
  Briefcase,
  Clock,
  Globe,
  PawPrint,
  Lightbulb,
  Music,
  Heart,
  School,
  Baby,
  Pencil,
  Camera,
  BookOpen,
  MessageCircle,
} from 'lucide-react';
import UserProfile from '../userProfile';
import Button from '@/shadcn/ui/Button';
import { useDialogStore } from '@/lib/store/dialog-store';
import { useRef } from 'react';
import { getCookie } from '@/utils/helper';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { ProfileInfoApi } from '@/services/user';
import { useProfileStore, UserProfileType } from '../ui/homepage/store/user';
import ThreeDotLoader from '../threedotLoader';

const EditProfile = ({
  responsive = 'flex-col md:flex-row',
}: {
  responsive?: string;
}) => {
  const { profileData, setProfileData } = useProfileStore();
  const userId = getCookie('appUserId');
  const { trigger, isPending } = useCustomMutation(ProfileInfoApi, {
    onSuccessCallback: data => {
      if (data) {
        setProfileData(data?.data as unknown as UserProfileType);
      }
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileimage', file);
    trigger({
      userId,
      body: formData,
    });
  };
  const profilePrompts = [
    {
      name: 'work',
      label: 'My work',
      icon: <Briefcase size={20} />,
      title: 'What do you do for work?',
      desc: 'Tell us what your profession is. If you don’t have a traditional job, tell us your life’s calling. Example: Nurse, parent to four kids, or retired surfer. Where is this shown?',
    },
    {
      name: 'spendTooMuchTimeOn',
      label: 'I spend too much time',
      icon: <Clock size={20} />,
      title: 'What do you spend too much time doing?',
      desc: 'Share an activity or hobby you spend lots of free time on. Example: Watching cat videos or playing chess.',
    },
    {
      name: 'birthDecade',
      label: 'Decade I was born',
      icon: <Baby size={20} />,
      title: 'Decade you were born',
      desc: 'Don’t worry, other people won’t be able to see your exact birthday.',
      type: 'alphanumeric',
    },
    {
      name: 'funFact',
      label: 'My fun fact',
      icon: <Lightbulb size={20} />,
      title: 'What’s a fun fact about you?',
      desc: 'Share something unique or unexpected about you. Example: I was in a music video or I’m a juggler.',
    },
    {
      name: 'mostUselessSkill',
      label: 'My most useless skill',
      icon: <Pencil size={20} />,
      title: 'What’s your most useless skill?',
      desc: 'Share a surprising but pointless talent you have. Example: Shuffling cards with one hand.',
    },
    {
      name: 'visitedPlaces',
      label: 'Where I’ve always wanted to go',
      icon: <Globe size={20} />,
      title: 'Where have you always wanted to travel?',
      desc: 'Share any pets you have and their names. Example: My calico cat Whiskers or my speedy tortoise Leonardo.',
    },
    {
      name: 'pets',
      label: 'Pets',
      icon: <PawPrint size={20} />,
      title: 'Do you have any pets in your life?',
      desc: 'Share about your furry, scaly, or feathered friends. Example: I have a dog named Max or I’m a cat person.',
    },
    {
      name: 'school',
      label: 'Where I went to school',
      icon: <School size={20} />,
      title: 'Where did you go to school?',
      desc: 'Whether it’s home school, secondary school or trade school, name the school that made you who you are.',
    },
    {
      name: 'favouriteSongInSchool',
      label: 'My favourite song in secondary school',
      icon: <Music size={20} />,
      title: 'What was your favourite song in secondary school?',
      desc: 'However embarrassing, share the tune you listened to on repeat as a teenager.',
    },
    {
      name: 'obsessedWith',
      label: "I'm obsessed with",
      icon: <Heart size={20} />,
      title: 'What are you obsessed with?',
      desc: 'Share whatever you can’t get enough of – in a good way. Example: Baking rosemary focaccia.',
    },
    {
      name: 'biographyTitle',
      icon: <BookOpen size={18} />,
      label: 'My biography title would be',
      title: 'What would your biography title be?',
      desc: 'If someone wrote a book about your life, what would they call it? Example: Born to Roam or Chronicles of a Dog Mum.',
    },
    {
      name: 'placeLive',
      icon: <Globe size={18} />,
      label: 'Where I live',
      title: 'Where do you currently live?',
      desc: 'Share your current city or region.',
    },
    {
      name: 'languages',
      icon: <MessageCircle size={18} />,
      label: 'Languages I speak',
      title: 'What languages do you speak?',
      desc: 'List the languages you can communicate in, even if it’s just a few words.',
    },
  ];

  const handleAddintro = () => {
    openDialog('editprofilemodal', {
      item: {
        name: 'intro',
        title: 'Write something fun and punchy.',
      },
    });
  };

  const { openDialog } = useDialogStore();
  return (
    <>
      <div
        className={`max-w-5xl mx-auto gap-10 p-6  pb-24 flex ${responsive} justify-between`}
      >
        <div className=" top-0 flex flex-col md:flex-row md:items-start gap-10 mb-10">
          {/* Profile Circle */}
          <div className="relative self-center md:self-start">
            {isPending ? (
              <div className="flex items-center justify-center w-[200px] h-[200px] rounded-full bg-gray-200 ">
                <ThreeDotLoader />
              </div>
            ) : (
              <UserProfile className="w-[200px] h-[200px] text-[32px]" />
            )}

            <Button
              variant="gray"
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-md px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-medium"
              onClick={handleButtonClick}
            >
              <Camera size={14} />
              Add
            </Button>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold">My profile</h2>
            <p className="text-gray-600 text-sm mt-2 max-w-lg">
              Hosts and guests can see your profile and it may appear across
              Staygenx to help us build trust in our community.{' '}
              <span className="underline cursor-pointer">Learn more</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 ">
            {profilePrompts.map(item => (
              <div
                onClick={() => openDialog('editprofilemodal', { item })}
                key={item.label}
                className="flex items-center justify-between border-b p-5  cursor-pointer hover:bg-gray-200 hover:rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {profileData?.userinfo?.[item?.name] ? (
                    <span>
                      {item.label}: {profileData.userinfo[item.name]}
                    </span>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">About me</h2>
            <div className="border border-black border-dashed rounded-xl p-6 text-gray-600 space-y-2">
              <p>Write something fun and punchy.</p>
              {profileData?.userinfo && profileData?.userinfo?.aboutMe ? (
                <p>{profileData?.userinfo?.aboutMe ?? ''}</p>
              ) : (
                <Button
                  onClick={handleAddintro}
                  className="underline font-medium text-black hover:opacity-80"
                >
                  Add intro
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div className=" fixed bottom-0 right-0 px-[60px] flex justify-end bg-white py-5 w-full">
        <Button className="bg-black text-white px-6 py-2 rounded-lg font-medium">
          Done
        </Button>
      </div> */}
    </>
  );
};

export default EditProfile;
