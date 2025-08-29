interface BottomLinkProps {
  text: string;
  onClick?: () => void;
}

function BottomLink({ text, onClick }: BottomLinkProps) {
  return (
    <button
      type="button"
      className="absolute bottom-[15vh] z-10 cursor-pointer border-none bg-transparent text-center text-gray-70 underline bt3"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default BottomLink;
