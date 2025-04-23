import { JSX } from "react";

type BoxProps = {
  children: React.ReactNode;
  className?: string;
  background?: string;
  handleClick?: () => void;
  style?: object;
  tag?: string;
  disabled?: boolean;
};

export const Box = (props: BoxProps) => {
  const {
    className,
    background,
    handleClick,
    style,
    tag,
    disabled: isDisabled,
  } = props;

  const TagName = (tag || "div") as keyof JSX.IntrinsicElements;

  return (
    <TagName
      {...props}
      className={className}
      style={{
        ...style,
        backgroundImage: !!background ? `url(${background})` : "",
      }}
      onClick={handleClick}
      disabled={!!isDisabled}
    />
  );
};
