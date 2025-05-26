import React, { ReactNode } from "react";
import { Col, Row, Typography } from "antd";
import styled from "@emotion/styled";
import { BlockOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

const LoginContainer = styled(Row)`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1f3f 0%, #152a4d 50%, #1e3871 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(
        circle at 15% 50%,
        rgba(25, 65, 135, 0.25) 0%,
        transparent 25%
      ),
      radial-gradient(
        circle at 85% 30%,
        rgba(30, 100, 200, 0.2) 0%,
        transparent 30%
      ),
      radial-gradient(
        circle at 50% 80%,
        rgba(40, 80, 160, 0.18) 0%,
        transparent 20%
      ),
      url("/images/blockchain-pattern.svg");
    background-size: cover;
    background-position: center;
    background-blend-mode: soft-light;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(to right, rgba(15, 40, 82, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(15, 40, 82, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 2;
  }

  .login-network {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    opacity: 0.3;
    pointer-events: none;
  }

  .network-node {
    position: absolute;
    width: 3px;
    height: 3px;
    background: rgba(150, 200, 255, 0.8);
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(150, 200, 255, 0.4);
  }

  .network-line {
    position: absolute;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(150, 200, 255, 0.4),
      transparent
    );
    transform-origin: left center;
    z-index: 1;
  }

  .login-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(114, 248, 255, 0.6);
    animation-name: floatParticle;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    pointer-events: none;

    &.particle-data {
      width: 2px;
      height: 2px;
      background: #72f8ff;
      box-shadow: 0 0 8px rgba(114, 248, 255, 0.8);

      &::before {
        content: "";
        position: absolute;
        width: 10px;
        height: 2px;
        background: linear-gradient(90deg, #72f8ff, transparent);
        left: -10px;
        top: 0;
      }
    }
  }

  @keyframes floatParticle {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 0.7;
    }
    100% {
      transform: translateY(-200px) translateX(300px);
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }

  .digital-rain {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    pointer-events: none;

    .rain-column {
      position: absolute;
      top: -10%;
      width: 1px;
      height: 10%;
      background: linear-gradient(
        to bottom,
        transparent,
        rgba(114, 248, 255, 0.3),
        transparent
      );
      animation: digitalRain linear infinite;
    }
  }

  @keyframes digitalRain {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(1000%);
    }
  }
`;

const LoginBrandCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 5;
  padding: 0 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BrandLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;

  .logo-icon {
    font-size: 48px;
    margin-right: 16px;
    color: white;
    animation: pulse 2s infinite ease-in-out;
  }

  .logo-text {
    color: white;
    font-size: 24px;
    font-weight: 700;
    text-shadow: 0 0 10px rgba(65, 132, 255, 0.5);
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.9;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const BrandTagline = styled(Paragraph)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  font-weight: 500;
  max-width: 400px;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  line-height: 1.6;
`;

const BlockchainIllustration = styled.div`
  position: relative;
  width: 460px;
  height: 400px;
  margin-top: 20px;
  perspective: 1000px;

  .blockchain-container {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: rotate3d 30s linear infinite;
  }

  .block {
    position: absolute;
    width: 90px;
    height: 130px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 0 20px rgba(0, 153, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 12px;
    transform-style: preserve-3d;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 30px rgba(0, 153, 255, 0.6);
      transform: translateZ(10px);
    }

    &.block-1 {
      top: 40px;
      left: 30px;
    }

    &.block-2 {
      top: 40px;
      left: 160px;
    }

    &.block-3 {
      top: 40px;
      left: 290px;
    }

    &.block-4 {
      top: 210px;
      left: 30px;
    }

    &.block-5 {
      top: 210px;
      left: 160px;
    }

    &.block-6 {
      top: 210px;
      left: 290px;
    }

    .block-header {
      width: 100%;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.9);
      background: rgba(0, 120, 255, 0.2);
      padding: 5px;
      border-radius: 4px;
      text-align: center;
    }

    .block-hash {
      width: 100%;
      font-size: 8px;
      font-family: monospace;
      color: #72f8ff;
      margin: 4px 0;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
    }

    .block-content {
      width: 100%;
      height: 40px;
      font-size: 7px;
      font-family: monospace;
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      padding: 3px;
      overflow: hidden;
    }

    .block-number {
      color: #72f8ff;
      font-weight: bold;
      font-size: 14px;
      margin-top: 5px;
    }

    .timestamp {
      font-size: 7px;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 4px;
    }
  }

  .connection {
    position: absolute;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.2),
      rgba(0, 200, 255, 0.6),
      rgba(255, 255, 255, 0.2)
    );
    z-index: 0;

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #72f8ff;
    }

    &::before {
      left: 0;
      top: -2px;
    }

    &::after {
      right: 0;
      top: -2px;
    }

    &.connection-h1 {
      width: 40px;
      top: 85px;
      left: 120px;
    }

    &.connection-h2 {
      width: 40px;
      top: 85px;
      left: 250px;
    }

    &.connection-v1 {
      width: 40px;
      top: 170px;
      left: 75px;
      transform: rotate(90deg);
    }

    &.connection-v2 {
      width: 40px;
      top: 170px;
      left: 205px;
      transform: rotate(90deg);
    }

    &.connection-v3 {
      width: 40px;
      top: 170px;
      left: 335px;
      transform: rotate(90deg);
    }

    &.connection-h3 {
      width: 40px;
      top: 255px;
      left: 120px;
    }

    &.connection-h4 {
      width: 40px;
      top: 255px;
      left: 250px;
    }
  }

  .data-packet {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #72f8ff;
    box-shadow: 0 0 8px 2px rgba(114, 248, 255, 0.6);
    z-index: 5;

    &.packet-h1 {
      top: 85px;
      left: 120px;
      animation: movePacketH 3s linear infinite;
    }

    &.packet-h2 {
      top: 85px;
      left: 250px;
      animation: movePacketH 3s linear infinite;
      animation-delay: 1s;
    }

    &.packet-v1 {
      top: 130px;
      left: 75px;
      animation: movePacketV 3s linear infinite;
      animation-delay: 0.5s;
    }

    &.packet-v2 {
      top: 130px;
      left: 205px;
      animation: movePacketV 3s linear infinite;
      animation-delay: 1.5s;
    }

    &.packet-v3 {
      top: 130px;
      left: 335px;
      animation: movePacketV 3s linear infinite;
      animation-delay: 2s;
    }

    &.packet-h3 {
      top: 255px;
      left: 120px;
      animation: movePacketH 3s linear infinite;
      animation-delay: 2.5s;
    }

    &.packet-h4 {
      top: 255px;
      left: 250px;
      animation: movePacketH 3s linear infinite;
      animation-delay: 1.2s;
    }
  }

  .node {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 15px rgba(114, 248, 255, 0.4);
    z-index: 2;

    &.node-1 {
      top: 100px;
      left: 420px;
      animation: pulseNode 3s infinite 0s;
    }

    &.node-2 {
      top: 150px;
      left: 400px;
      animation: pulseNode 3s infinite 0.5s;
    }

    &.node-3 {
      top: 200px;
      left: 430px;
      animation: pulseNode 3s infinite 1s;
    }

    &.node-4 {
      top: 250px;
      left: 390px;
      animation: pulseNode 3s infinite 1.5s;
    }

    &.node-5 {
      top: 300px;
      left: 420px;
      animation: pulseNode 3s infinite 2s;
    }
  }

  .network-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    opacity: 0.2;

    .network-line {
      position: absolute;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(114, 248, 255, 0.8),
        transparent
      );
      transform-origin: center;

      &:nth-of-type(1) {
        top: 20%;
        left: 10%;
        width: 90%;
        transform: rotate(5deg);
      }

      &:nth-of-type(2) {
        top: 40%;
        left: -10%;
        width: 100%;
        transform: rotate(-8deg);
      }

      &:nth-of-type(3) {
        top: 60%;
        left: 5%;
        width: 95%;
        transform: rotate(3deg);
      }

      &:nth-of-type(4) {
        top: 80%;
        left: -5%;
        width: 110%;
        transform: rotate(-2deg);
      }
    }
  }

  @keyframes movePacketH {
    0% {
      transform: translateX(0);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(40px);
      opacity: 0;
    }
  }

  @keyframes movePacketV {
    0% {
      transform: translateY(0);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateY(40px);
      opacity: 0;
    }
  }

  @keyframes pulseNode {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.5);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
  }

  @keyframes rotate3d {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
`;

interface BlockchainBackgroundProps {
  children: ReactNode;
  tagline: string;
}

const BlockchainBackground: React.FC<BlockchainBackgroundProps> = ({
  children,
  tagline,
}) => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: `${Math.random() * 20 + 10}s`,
    delay: `${Math.random() * 5}s`,
    isData: Math.random() > 0.7, // 30% chance to be a data particle
  }));

  const networkNodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 2,
    pulse: Math.random() > 0.5,
  }));

  const networkLines = Array.from({ length: 15 }, (_, i) => {
    const randomX = `${Math.random() * 100}%`;
    const randomY = `${Math.random() * 100}%`;
    return {
      id: i,
      x1: randomX,
      y1: randomY,
      length: Math.random() * 200 + 50,
      angle: Math.random() * 360,
      opacity: Math.random() * 0.3 + 0.1,
    };
  });

  const digitalRainColumns = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${Math.random() * 10 + 5}s`,
    delay: `${Math.random() * 10}s`,
  }));

  return (
    <LoginContainer justify="center" align="middle">
      {/* Network nodes background */}
      <div className="login-network">
        {networkNodes.map((node) => (
          <div
            key={node.id}
            className="network-node"
            style={{
              top: node.top,
              left: node.left,
              width: `${node.size}px`,
              height: `${node.size}px`,
              animation: node.pulse
                ? `pulse 3s infinite ease-in-out ${Math.random() * 2}s`
                : "none",
            }}
          />
        ))}
        {networkLines.map((line) => (
          <div
            key={line.id}
            className="network-line"
            style={{
              top: line.y1,
              left: line.x1,
              width: `${line.length}px`,
              opacity: line.opacity,
              transform: `rotate(${line.angle}deg)`,
            }}
          />
        ))}
      </div>

      {/* Digital rain effect */}
      <div className="digital-rain">
        {digitalRainColumns.map((column) => (
          <div
            key={column.id}
            className="rain-column"
            style={{
              left: column.left,
              animationDuration: column.duration,
              animationDelay: column.delay,
            }}
          />
        ))}
      </div>

      <div className="login-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`particle ${particle.isData ? "particle-data" : ""}`}
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.isData ? "2px" : `${particle.size}px`,
              height: particle.isData ? "2px" : `${particle.size}px`,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      <LoginBrandCol xs={0} md={12}>
        <BrandLogoWrapper>
          <BlockOutlined className="logo-icon" />
          <span className="logo-text">Authenticate.io.vn</span>
        </BrandLogoWrapper>

        <BrandTagline>{tagline}</BrandTagline>

        <BlockchainIllustration>
          <div className="blockchain-container">
            <div className="block block-1">
              <div className="block-header">BLOCK #01</div>
              <div className="block-hash">
                0xf731aB2b6d5E968857e621342d20F5Ae972511
              </div>
              <div className="block-content">
                {`{
  "timestamp": "2025-05-20T10:22:18Z",
  "prevHash": "0x0000...",
  "txRoot": "0x8a7d...",
  "nonce": 42834
}`}
              </div>
              <div className="timestamp">20.05.2025 10:22:18</div>
            </div>
            <div className="block block-2">
              <div className="block-header">BLOCK #02</div>
              <div className="block-hash">
                0x9d78B3c4e59A76346d8F9C50E1528fcB2c62A
              </div>
              <div className="block-content">
                {`{
  "timestamp": "2025-05-20T10:25:43Z",
  "prevHash": "0xf731a...",
  "txRoot": "0x7b32...",
  "nonce": 53172
}`}
              </div>
              <div className="timestamp">20.05.2025 10:25:43</div>
            </div>
            <div className="block block-3">
              <div className="block-header">BLOCK #03</div>
              <div className="block-hash">
                0x3c4a62E8f7D95B2c9b8e0F1A2B3C4D5E6F7G8H
              </div>
              <div className="block-content">
                {`{
  "timestamp": "2025-05-20T10:28:54Z",
  "prevHash": "0x9d78b...",
  "txRoot": "0x5c41...",
  "nonce": 27639
}`}
              </div>
              <div className="timestamp">20.05.2025 10:28:54</div>
            </div>
            <div className="block block-4">
              <div className="block-header">BLOCK #04</div>
              <div className="block-hash">
                0x2b8F1a73E9c5d4B6A8C7D9E0F1a2b3c4d5e6f7
              </div>
              <div className="block-content">
                {`{
  "timestamp": "2025-05-20T10:32:19Z",
  "prevHash": "0x3c4a6...",
  "txRoot": "0x1f58...",
  "nonce": 18945
}`}
              </div>
              <div className="timestamp">20.05.2025 10:32:19</div>
            </div>
            <div className="block block-5">
              <div className="block-header">BLOCK #05</div>
              <div className="block-hash">
                0x5E7F8a9B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5
              </div>
              <div className="block-content">
                {`{
  "timestamp": "2025-05-20T10:35:47Z",
  "prevHash": "0x2b8f1...",
  "txRoot": "0x9d32...",
  "nonce": 62438
}`}
              </div>
              <div className="timestamp">20.05.2025 10:35:47</div>
            </div>
            <div className="block block-6">
              <div className="block-header">BLOCK #06</div>
              <div className="block-hash">
                0x7A8b9C0d1E2f3G4h5I6j7K8l9M0n1O2p3Q4r
              </div>
              <div className="block-content">
                {`{
  "timestamp": "2025-05-20T10:39:22Z",
  "prevHash": "0x5e7f8...",
  "txRoot": "0x3a71...",
  "nonce": 38729
}`}
              </div>
              <div className="timestamp">20.05.2025 10:39:22</div>
            </div>

            <div className="connection connection-h1"></div>
            <div className="connection connection-h2"></div>
            <div className="connection connection-v1"></div>
            <div className="connection connection-v2"></div>
            <div className="connection connection-v3"></div>
            <div className="connection connection-h3"></div>
            <div className="connection connection-h4"></div>

            <div className="data-packet packet-h1"></div>
            <div className="data-packet packet-h2"></div>
            <div className="data-packet packet-v1"></div>
            <div className="data-packet packet-v2"></div>
            <div className="data-packet packet-v3"></div>
            <div className="data-packet packet-h3"></div>
            <div className="data-packet packet-h4"></div>

            <div className="node node-1"></div>
            <div className="node node-2"></div>
            <div className="node node-3"></div>
            <div className="node node-4"></div>
            <div className="node node-5"></div>

            <div className="network-lines">
              <div className="network-line"></div>
              <div className="network-line"></div>
              <div className="network-line"></div>
              <div className="network-line"></div>
            </div>
          </div>
        </BlockchainIllustration>
      </LoginBrandCol>

      {/* Login form column with higher z-index */}
      <Col xs={24} md={12} style={{ position: "relative", zIndex: 10 }}>
        {children}
      </Col>
    </LoginContainer>
  );
};

export default BlockchainBackground;
