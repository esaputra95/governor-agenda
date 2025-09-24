"use client";
import { useCurrentPath } from "@/hooks/usePath";
import { titleData } from "@/utils/title";
import React, { FC, ReactNode } from "react";
import Button from "../ui/buttons/Button";

type Props = {
  onClickButton?: () => void;
  titleButton?: string;
  title?: ReactNode;
  subTitle?: string;
  isLoading?: boolean;
};
const TitleContent: FC<Props> = ({
  onClickButton,
  titleButton,
  title,
  subTitle,
  isLoading,
}) => {
  const currentPath = useCurrentPath();
  return (
    <div className="py-2 flex w-full justify-between border-b border-slate-100 items-end">
      <div className="py-2">
        <h1 className="text-lg font-semibold">
          {title
            ? title
            : titleData[currentPath as keyof typeof titleData] || "Dashboard"}
        </h1>
        <p className="text-sm text-slate-500">
          {subTitle ?? "Ringkasan Informasi"}
        </p>
      </div>
      {titleButton && (
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          onClick={onClickButton}
          size="medium"
        >
          {titleButton ??
            (titleData[currentPath as keyof typeof titleData] || "Dashboard")}
        </Button>
      )}
    </div>
  );
};

export default TitleContent;
