"use client";

import { JSX } from "react";
import { useTheme } from "@/providers/Provider";

type BoxProps = {
  children: React.ReactNode;
  className?: string;
  background?: string;
  handleClick?: () => void;
  style?: object;
  tag?: string;
  disabled?: boolean;
  themeBackground?: string;
  themeColor?: string;
  sx?: object;
};

export const Box = (props: BoxProps) => {
  const { getColor } = useTheme();

  const {
    className,
    background,
    handleClick,
    style,
    tag,
    disabled: isDisabled,
    themeBackground,
    themeColor,
    ...restProps
  } = props;

  const TagName = (tag || "div") as keyof JSX.IntrinsicElements;

  return (
    <TagName
      {...restProps}
      className={className}
      style={{
        ...style,
        backgroundImage: !!background ? `url(${background})` : "",
        backgroundColor: themeBackground
          ? getColor(themeBackground)
          : undefined,
        color: themeColor ? getColor(themeColor) : undefined,
      }}
      onClick={handleClick}
      disabled={!!isDisabled}
    />
  );
};
