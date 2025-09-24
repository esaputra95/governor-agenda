import type { FC, ReactNode } from "react";
import { cn } from "../../../utils/cn";

const HeaderModal: FC<{ children: ReactNode; className?: string }> = (
  props
) => {
  const { children, className } = props;
  return (
    <div className="w-full px-4 py-4 rounded-t-lg bg-blue-50">
      <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>
    </div>
  );
};

export default HeaderModal;
