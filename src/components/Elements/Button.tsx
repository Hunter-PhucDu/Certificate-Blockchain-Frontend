import { FC, memo } from "react";

import { Button as AntdButton, ButtonProps as AntdButtonProps } from "antd";

type ButtonProps = AntdButtonProps & {
  outline?: boolean | string;
  to?: string | number;
};

export const Button: FC<ButtonProps> = memo(({ ...props }) => {
  return <AntdButton {...props} size={"large"} />;
});

Button.displayName = "Button";
