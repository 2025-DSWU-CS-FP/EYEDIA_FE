interface BottomLinkProps {
  text: string;
  onClick?: () => void;
}

function BottomLink({ text, onClick }: BottomLinkProps) {
  return (
    <button
      type="button"
      className="z-10 text-bt3 absolute bottom-[15vh] text-gray-70 text-center underline cursor-pointer bg-transparent border-none"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default BottomLink;
