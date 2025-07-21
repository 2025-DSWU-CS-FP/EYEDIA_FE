interface OnboardingTextProps {
  text: string;
}

function OnboardingText({ text }: OnboardingTextProps) {
  return (
    <p className="text-center text-white text-lg font-medium mb-6 px-6">
      {text}
    </p>
  );
}

export default OnboardingText;
