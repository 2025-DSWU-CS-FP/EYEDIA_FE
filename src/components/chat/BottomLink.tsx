interface BottomLinkProps {
  text: string;
  onClick?: () => void;
}

function BottomLink({ text, onClick }: BottomLinkProps) {
  return (
    <button
      type="button"
      className="absolute bottom-[15vh] z-10 cursor-pointer border-none bg-transparent text-center text-bt3 text-gray-70 underline"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default BottomLink;
