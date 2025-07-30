interface OnboardingTextProps {
  text: string;
}

function OnboardingText({ text }: OnboardingTextProps) {
  return (
    <p className="mb-6 px-6 text-center text-[1.6rem] font-medium text-black">
      {text}
    </p>
  );
}

export default OnboardingText;
