import Button from '@/shadcn/ui/Button';
import React from 'react';

interface StepNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  isNextDisabled?: boolean;
  isBackHidden?: boolean;
  currentStep?: number;
  totalSteps?: number;
  nextButtonClassName?: string;
  loading?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  onBack,
  onNext,
  backLabel = 'Back',
  nextLabel = 'Next',
  isNextDisabled = false,
  isBackHidden = false,
  currentStep = 0,
  loading = false,
}) => {
  return (
    <div className="w-full flex flex-col  bg-white fixed left-0 bottom-0 z-50">
      <div
        className="flex justify-between items-center py-4 px-10"
        style={{ flex: 1 }}
      >
        <div>
          {!isBackHidden && (
            <Button
              onClick={onBack}
              className="text-black underline text-lg font-medium hover:text-gray-700"
            >
              {backLabel}
            </Button>
          )}
        </div>
        <div>
          <Button
            loading={loading}
            variant={currentStep === 0 ? 'pink' : 'black'}
            onClick={onNext}
            disabled={isNextDisabled}
            className={`px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition`}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
