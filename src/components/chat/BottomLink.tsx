interface BottomLinkProps {
  text: string;
  onClick?: () => void;
}

function BottomLink({ text, onClick }: BottomLinkProps) {
  return (
    <button
      type="button"
      className="text-sm text-gray-400 text-center mt-10 underline cursor-pointer bg-transparent border-none"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default BottomLink;
