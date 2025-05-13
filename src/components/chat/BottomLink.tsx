interface BottomLinkProps {
  text: string;
  onClick?: () => void;
}

function BottomLink({ text, onClick }: BottomLinkProps) {
  return (
    <button
      type="button"
      className="text-sm absolute bottom-[15vh] text-gray-400 text-center underline cursor-pointer bg-transparent border-none"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default BottomLink;
