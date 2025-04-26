import { Button, Form } from "antd";
import Link from "next/link";
import styled from "styled-components";

export const StyledSign = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const StyledSignContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const StyledSignBtn = styled(Button)`
  border-radius: 6px;
  width: 10rem;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  line-height: 1;
`;

export const StyledSignBtnFull = styled(Button)`
  border-radius: 6px;
  width: 100%;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  line-height: 1;
`;

export const StyledSignForm = styled(Form)`
  flex: 1;
  display: flex;
  flex-direction: column;

  & .form-field {
    margin-bottom: 20px;
  }

  & .form-btn-field {
    position: relative;
    margin-bottom: 16px;
  }

  & .form-field-action {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    margin-top: auto;

    & span {
      margin-right: 8px;
      display: inline-block;

      [dir="rtl"] & {
        margin-right: 0;
        margin-left: 8px;
      }
    }
  }
`;

export const StyledRememberMe = styled.div`
  position: relative;

  & label {
    margin-bottom: 10px;
  }
`;

export const StyledSignLink = styled.span`
  color: #1890ff;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 16px;
  text-align: right;
  display: block;

  [dir="rtl"] & {
    text-align: left;
  }
`;

export const StyledSignTextGrey = styled.span`
  color: rgba(0, 0, 0, 0.45);
`;

export const StyledSignLinkTag = styled(Link)`
  text-decoration: none;
  color: #1890ff;
`;

export const StyledSignFooter = styled.div`
  background-color: #f5f5f5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  margin: 12px -24px -24px;

  @media screen and (min-width: 576px) {
    padding-left: 20px;
    padding-right: 20px;
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: -20px;
  }

  @media screen and (min-width: 992px) {
    padding-left: 40px;
    padding-right: 40px;
    margin-left: -40px;
    margin-right: -40px;
    margin-bottom: -40px;
  }

  & .signup-btn {
    text-transform: capitalize;
  }
`;

export const StyledSignedText = styled.span`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-right: 10px;

  [dir="rtl"] & {
    margin-right: 0;
    margin-left: 10px;
  }

  @media screen and (min-width: 768px) {
    margin-right: 16px;

    [dir="rtl"] & {
      margin-right: 0;
      margin-left: 16px;
    }
  }
`;

export const StyledSignSocialLink = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledSignIconBtn = styled(Button)`
  color: rgba(0, 0, 0, 0.65);
  padding: 6px 4px 4px;
  border: 0 none;
  box-shadow: none;
  background-color: transparent;
  width: 26px;
  min-width: 26px;
  height: 26px;

  @media screen and (min-width: 768px) {
    width: 36px;
    min-width: 36px;
    height: 36px;
    padding: 8px 6px 6px;
  }

  &:hover,
  &:focus {
    color: #1890ff;
    background-color: transparent;
  }

  & .anticon {
    font-size: 14px;

    @media screen and (min-width: 768px) {
      font-size: 16px;
    }

    & svg {
      display: block;
    }
  }

  &.ant-btn-icon-only > * {
    font-size: 14px;

    @media screen and (min-width: 768px) {
      font-size: 16px;
    }
  }
`;

export const SignInButton = styled(Button)`
  border-radius: 6px;
  width: 10rem;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 1;
`;
