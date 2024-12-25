import {
  MdOutlinePerson2,
  MdOutlineArrowDropDown,
  MdOutlineMenu as MenuIcon,
  MdOutlineClose as CloseIcon,
} from "react-icons/md";
import Image from "next/image";

interface HeaderProps {
  isNavOpen: boolean;
  toggleNav: () => void;
}

export default function Header({ isNavOpen, toggleNav }: HeaderProps) {
  return (
    <div className="p-[15px] lg:px-[25px] flex gap-[15px] lg:gap-[25px] items-center text-[#2E3830] bg-white fixed w-full h-[60px] shadow-lg ">
      <button onClick={toggleNav} className="text-[#2E3830] focus:outline-none">
        {isNavOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      <div className="flex items-center justify-between w-full">
        <div className="flex gap-3">
          <div className="hidden md:block">
            <Image
              src="/dfc-logo.jpg"
              width={30}
              height={30}
              alt="An img of the school logo"
              className=""
            />
          </div>
          <p className="hidden md:block md:text-[15px] font-medium">
            DIVINE FULFILMENT COLLEGE, OTA
          </p>
        </div>

        <div>
          <p className="text-[10px] md:text-[12px] font-medium">Active Term</p>
          <p className="text-[8px] md:text-[10px]">2024 / 2025 | 1ST TERM</p>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center">
            <MdOutlinePerson2 size={30} />
            <MdOutlineArrowDropDown size={15} />
          </div>
          <div>
            <p className="text-[10px] md:text-[12px] font-medium">OLAOLUWA</p>
            <p className="text-[8px] md:text-[10px]">STUDENT | SS3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
