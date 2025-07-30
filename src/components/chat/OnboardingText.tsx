interface OnboardingTextProps {
  text: string;
}

function OnboardingText({ text }: OnboardingTextProps) {
  return (
    <p className="text-center text-black text-[1.6rem] font-medium mb-6 px-6">
      {text}
    </p>
  );
}

export default OnboardingText;
