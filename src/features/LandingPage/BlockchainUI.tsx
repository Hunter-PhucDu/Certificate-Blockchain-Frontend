"use client";

import React from "react";
import { Input, Button, Layout, Typography, Card } from "antd";
import styled from "@emotion/styled";

const { Footer } = Layout;
const { Paragraph } = Typography;

export const HeroSection = styled.div`
  min-height: 65vh; /* Reduced from 75vh to 65vh */
  background: linear-gradient(135deg, #0a1f3f 0%, #152a4d 50%, #1e3871 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 30px 0; /* Reduced from 40px to 30px */

  @media (max-height: 700px) {
    min-height: 55vh; /* Added responsive height */
  }

  @media (max-height: 600px) {
    min-height: 50vh; /* Added responsive height */
  }

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
        rgba(25, 65, 135, 0.2) 0%,
        transparent 25%
      ),
      radial-gradient(
        circle at 85% 30%,
        rgba(30, 100, 200, 0.15) 0%,
        transparent 30%
      ),
      radial-gradient(
        circle at 50% 80%,
        rgba(40, 80, 160, 0.15) 0%,
        transparent 20%
      ),
      url("/images/blockchain-pattern.svg");
    background-size: cover;
    background-position: center;
    background-blend-mode: soft-light;
    z-index: 1;
    opacity: 0.9;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(to right, rgba(15, 40, 82, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(15, 40, 82, 0.04) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 2;
  }

  > * {
    position: relative;
    z-index: 5;
  }
`;

export const BlockchainAnimation = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
  overflow: hidden;
  pointer-events: none;

  // Network nodes and connections
  .network-node {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(150, 200, 255, 0.6);
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(150, 200, 255, 0.3);
  }

  .network-line {
    position: absolute;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(150, 200, 255, 0.3),
      transparent
    );
    transform-origin: left center;
    z-index: 1;
  }

  // Floating blocks
  .block {
    position: absolute;
    width: 35px; /* Reduced from 40px to 35px */
    height: 35px; /* Reduced from 40px to 35px */
    background: rgba(59, 130, 246, 0.08);
    border: 1px solid rgba(59, 130, 246, 0.25);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: monospace;
    color: rgba(255, 255, 255, 0.4);
    font-size: 6px; /* Reduced from 7px to 6px */
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.15);
    animation: floatBlock 15s infinite linear;
    opacity: 0.6;
    backdrop-filter: blur(2px);
  }

  // Particles
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

  // Digital rain effect
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
        rgba(114, 248, 255, 0.2),
        transparent
      );
      animation: digitalRain linear infinite;
    }
  }

  // Block positions
  .block:nth-of-type(1) {
    top: 20%; /* Changed from 15% to 20% */
    left: 10%;
    animation-delay: 0s;
  }

  .block:nth-of-type(2) {
    top: 35%;
    left: 20%;
    animation-delay: 2s;
  }

  .block:nth-of-type(3) {
    top: 60%; /* Changed from 65% to 60% */
    left: 15%;
    animation-delay: 4s;
  }

  .block:nth-of-type(4) {
    top: 30%; /* Changed from 25% to 30% */
    right: 15%;
    animation-delay: 1s;
  }

  .block:nth-of-type(5) {
    top: 50%;
    right: 10%;
    animation-delay: 3s;
  }

  .block:nth-of-type(6) {
    bottom: 25%; /* Changed from 20% to 25% (which actually makes it higher) */
    right: 20%;
    animation-delay: 5s;
  }

  // Chain connections
  .chain {
    position: absolute;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0.2),
      rgba(59, 130, 246, 0.5),
      rgba(59, 130, 246, 0.2)
    );
    animation: pulseChain 6s infinite;
    filter: blur(0.3px);
  }

  // Animations
  @keyframes floatBlock {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-8px) rotate(2deg); /* Reduced float height from -10px to -8px and rotation from 3deg to 2deg */
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }

  @keyframes pulseChain {
    0% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0.2;
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

  @keyframes digitalRain {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(1000%);
    }
  }

  @media (max-width: 768px) {
    .block {
      width: 28px; /* Reduced from 32px to 28px */
      height: 28px; /* Reduced from 32px to 28px */
      font-size: 5px; /* Reduced from 6px to 5px */
    }

    .network-node,
    .network-line {
      opacity: 0.15 !important;
    }

    .line {
      opacity: 0.2 !important;
    }

    .rain-column {
      opacity: 0.15 !important;
    }
  }

  @media (max-height: 700px) {
    .block {
      width: 25px; /* Reduced from 30px to 25px */
      height: 25px; /* Reduced from 30px to 25px */
      font-size: 5px;
      opacity: 0.5; /* Added reduced opacity */
    }

    .particle,
    .rain-column {
      display: none;
    }
  }

  @media (max-height: 600px) {
    .block {
      width: 22px; /* Added smaller size for very small screens */
      height: 22px;
      font-size: 4px;
      opacity: 0.4;
    }

    .network-node,
    .network-line {
      opacity: 0.1 !important;
    }
  }

  @media (max-height: 500px) {
    .block {
      transform: scale(0.8); /* Added scale transform for very small screens */
      opacity: 0.3;
    }

    .block:nth-of-type(odd) {
      display: none; /* Hide every other block on very small screens */
    }
  }
`;

export const NetworkNodes = () => {
  interface Node {
    id: number;
    top: string;
    left: string;
    size: number;
    opacity: number;
  }

  interface Line {
    id: number;
    start: number;
    end: number;
  }

  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [lines, setLines] = React.useState<Line[]>([]);

  React.useEffect(() => {
    const nodeCount = 10;
    const newNodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      newNodes.push({
        id: i,
        top: `${15 + Math.random() * 70}%`,
        left: `${15 + Math.random() * 70}%`,
        size: 1 + Math.random() * 1.5,
        opacity: 0.2 + Math.random() * 0.3,
      });
    }

    setNodes(newNodes);

    // Create connections between nodes
    const newLines: Line[] = [];
    const connectionCount = 12;

    for (let i = 0; i < connectionCount; i++) {
      const startNode = Math.floor(Math.random() * nodeCount);
      let endNode = Math.floor(Math.random() * nodeCount);

      // Make sure we don't connect a node to itself
      while (endNode === startNode) {
        endNode = Math.floor(Math.random() * nodeCount);
      }

      newLines.push({
        id: i,
        start: startNode,
        end: endNode,
      });
    }

    setLines(newLines);
  }, []);

  return (
    <div className="network-nodes">
      {nodes.map((node) => (
        <div
          key={node.id}
          className="network-node"
          style={{
            top: node.top,
            left: node.left,
            width: `${node.size}px`,
            height: `${node.size}px`,
            opacity: node.opacity,
            filter: "blur(0.3px)",
          }}
        />
      ))}

      {lines.map((line) => {
        if (!nodes[line.start] || !nodes[line.end]) return null;

        const startTop = nodes[line.start].top;
        const startLeft = nodes[line.start].left;
        const endTop = nodes[line.end].top;
        const endLeft = nodes[line.end].left;

        // Calculate the angle and length of the line
        const angle = Math.atan2(
          parseFloat(endTop) - parseFloat(startTop),
          parseFloat(endLeft) - parseFloat(startLeft),
        );

        const length = Math.sqrt(
          Math.pow(parseFloat(endLeft) - parseFloat(startLeft), 2) +
            Math.pow(parseFloat(endTop) - parseFloat(startTop), 2),
        );

        return (
          <div
            key={line.id}
            className="network-line"
            style={{
              top: startTop,
              left: startLeft,
              width: `${length}px`,
              transform: `rotate(${angle}rad)`,
              opacity: 0.08 + Math.random() * 0.12,
              height: "0.5px",
              filter: "blur(0.2px)",
            }}
          />
        );
      })}
    </div>
  );
};

export const TechGrid = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.2;
  z-index: 0;
  perspective: 1000px;
  transform-style: preserve-3d;
  animation: gridAnimation 25s linear infinite;

  @keyframes gridAnimation {
    0% {
      transform: rotateX(8deg) translateZ(0);
    }
    100% {
      transform: rotateX(8deg) translateZ(80px);
    }
  }
`;

export const ConnectionLines = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  .line {
    position: absolute;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(59, 130, 246, 0.25),
      transparent
    );
    animation: moveLine 15s linear infinite;
    opacity: 0;
    filter: blur(0.5px);
  }

  .line:nth-of-type(1) {
    width: 25%;
    top: 15%;
    left: 5%;
    animation-delay: 0s;
  }

  .line:nth-of-type(2) {
    width: 18%;
    top: 35%;
    right: 15%;
    animation-delay: 3s;
  }

  .line:nth-of-type(3) {
    width: 22%;
    bottom: 40%;
    left: 25%;
    animation-delay: 6s;
  }

  .line:nth-of-type(4) {
    width: 15%;
    bottom: 25%;
    right: 8%;
    animation-delay: 9s;
  }

  .line:nth-of-type(5) {
    width: 20%;
    top: 55%;
    left: 40%;
    animation-delay: 4.5s;
  }

  .line:nth-of-type(6) {
    width: 12%;
    top: 70%;
    right: 30%;
    animation-delay: 7.5s;
  }

  @keyframes moveLine {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    15% {
      opacity: 0.4;
    }
    85% {
      opacity: 0.4;
    }
    100% {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 15px;
  text-align: center;

  h1 {
    color: white;
    font-size: 36px; /* Reduced from 38px to 36px */
    font-weight: 700;
    margin-bottom: 14px; /* Reduced from 16px to 14px */
    text-align: center;
    text-shadow: 0 0 10px rgba(65, 132, 255, 0.5);
    animation: fadeIn 1s ease-out;
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    font-weight: 500;
    max-width: 600px;
    text-align: center;
    margin-bottom: 20px; /* Reduced from 24px to 20px */
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    line-height: 1.5;
    animation: fadeIn 1.5s ease-out;
  }

  @media (max-width: 576px) {
    h1 {
      font-size: 30px; /* Reduced for small screens */
      margin-bottom: 12px;
    }

    p {
      font-size: 14px;
      margin-bottom: 16px;
    }
  }

  @media (max-height: 700px) {
    h1 {
      font-size: 32px;
      margin-bottom: 12px;
    }

    p {
      font-size: 15px;
      margin-bottom: 16px;
      line-height: 1.4;
    }
  }

  @media (max-height: 600px) {
    h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }

    p {
      font-size: 14px;
      margin-bottom: 14px;
      line-height: 1.3;
    }
  }
`;

export const BrandTagline = styled(Paragraph)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 500;
  max-width: 320px;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
  animation: fadeIn 1.5s ease-out;
`;

export const OrgLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  margin-bottom: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 153, 255, 0.4);
  animation: pulse 2s infinite ease-in-out;
  position: relative;
  z-index: 5;

  .logo-text {
    font-size: 28px;
    font-weight: bold;
    color: white;
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

export const SearchSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px 25px;
  margin-top: -50px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  z-index: 10;
  position: relative;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  margin-bottom: 30px;

  &:hover {
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 576px) {
    padding: 30px 20px;
    margin-top: -40px;
    border-radius: 12px;
  }
`;

export const CertificateCard = styled(Card)`
  margin-top: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  .ant-card-body {
    padding: 0;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(59, 130, 246, 0.03),
      transparent
    );
    transform: translateX(-100%);
    animation: cardShine 3s infinite;
  }

  @keyframes cardShine {
    0% {
      transform: translateX(-100%) rotate(25deg);
    }
    100% {
      transform: translateX(100%) rotate(25deg);
    }
  }
`;

export const CertificateHeader = styled.div`
  padding: 32px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 100%
    );
    animation: shine 3s infinite;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(rgba(59, 130, 246, 0.2) 2px, transparent 2px),
      radial-gradient(rgba(59, 130, 246, 0.15) 2px, transparent 2px);
    background-size: 30px 30px;
    background-position:
      0 0,
      15px 15px;
    opacity: 0.3;
  }
`;

export const CertificateDetail = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;

export const StyledFooter = styled(Footer)`
  background-color: #0f172a;
  color: white;
  padding: 48px 24px;
  text-align: center;
`;

export const BlockchainBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(37, 99, 235, 0.1);
  color: #3b82f6;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  backdrop-filter: blur(8px);

  .anticon {
    margin-right: 8px;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  &:hover,
  &:focus-within {
    box-shadow: 0 8px 30px rgba(37, 99, 235, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateY(-2px);
  }
`;

export const SearchInput = styled(Input)`
  flex: 1;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  height: 56px;
  font-size: 16px;
  padding: 0 24px;

  .ant-input {
    background: transparent !important;
    color: #333;
    height: 56px;
    border-radius: 0;
    padding: 0 24px;
    font-size: 16px;
    border: none !important;
    box-shadow: none !important;

    &:hover,
    &:focus {
      border: none !important;
      box-shadow: none !important;
    }
  }

  .ant-input-prefix {
    margin-right: 12px;
    color: #3b82f6;
  }
`;

export const SearchButton = styled(Button)`
  height: 56px;
  border-radius: 0 28px 28px 0;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  padding: 0 32px;
  box-shadow: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg);
    transition: all 0.5s ease;
    opacity: 0;
  }

  &:hover::after {
    animation: shine 1.5s ease;
  }

  @keyframes shine {
    0% {
      left: -50%;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      left: 150%;
      opacity: 0;
    }
  }
`;

export const FeatureSection = styled.div`
  padding: 100px 50px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  transition: background 0.5s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: linear-gradient(180deg, #f7fafc 0%, #ffffff 100%);
    z-index: 0;
  }
`;

export const FeatureCard = styled(Card)`
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  height: 100%;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);

    .icon-wrapper {
      transform: translateY(-5px);
    }

    &::before {
      opacity: 1;
      transform: scale(1);
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.05) 0%,
      transparent 100%
    );
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.3s ease;
  }

  .ant-card-head {
    border-bottom: none;
    padding: 24px;
  }

  .ant-card-body {
    padding: 0 24px 24px;
  }

  .icon-wrapper {
    transition: transform 0.3s ease;
  }
`;

export const GradientIcon = styled.div`
  font-size: 48px;
  background: linear-gradient(135deg, #0b486b 0%, #3b8d99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

export const AnimatedBox = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  color: white;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  &:before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 80%
    );
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

export const EnhancedAnimatedBox = styled(AnimatedBox)`
  margin: 0 50px 40px;
  border-radius: 24px;
  padding: 50px;
  background: linear-gradient(135deg, #0f2852 0%, #2d4fa3 100%);

  &:before {
    animation: rotate 30s linear infinite;
  }

  .blockchain-visual {
    position: relative;
    height: 200px;

    .block {
      position: absolute;
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(0, 153, 255, 0.3);
      backdrop-filter: blur(5px);

      &.block-1 {
        top: 15px;
        left: 0;
        animation: float 4s ease-in-out infinite;
      }

      &.block-2 {
        top: 40px;
        left: 70px;
        animation: float 4s ease-in-out infinite 1s;
      }

      &.block-3 {
        top: 65px;
        left: 140px;
        animation: float 4s ease-in-out infinite 2s;
      }

      .icon {
        font-size: 24px;
        color: white;
      }
    }

    .connection {
      position: absolute;
      height: 2px;
      background: rgba(255, 255, 255, 0.3);
      z-index: 0;

      &.connection-1 {
        width: 60px;
        top: 40px;
        left: 40px;
        transform: rotate(15deg);
      }

      &.connection-2 {
        width: 60px;
        top: 55px;
        left: 110px;
        transform: rotate(15deg);
      }
    }
  }

  @media (max-width: 767px) {
    margin: 0 40px 35px;
    padding: 40px;

    .blockchain-visual {
      height: 180px;

      .block {
        width: 45px;
        height: 45px;

        .icon {
          font-size: 20px;
        }
      }

      .connection {
        width: 50px;
      }
    }
  }

  @media (max-width: 500px) {
    margin: 0 20px 30px;
    padding: 30px;
    border-radius: 20px;

    .blockchain-visual {
      height: 150px;

      .block {
        width: 40px;
        height: 40px;

        &.block-1 {
          top: 12px;
        }

        &.block-2 {
          top: 35px;
          left: 60px;
        }

        &.block-3 {
          top: 58px;
          left: 120px;
        }

        .icon {
          font-size: 18px;
        }
      }

      .connection {
        &.connection-1 {
          width: 50px;
          top: 35px;
          left: 30px;
        }

        &.connection-2 {
          width: 50px;
          top: 48px;
          left: 90px;
        }
      }
    }
  }
`;

export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  margin-right: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: #1890ff;
    transform: translateY(-3px);
    color: white;
  }
`;

export const ProcessSection = styled.div`
  padding: 100px 0;
  background: #fff;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: linear-gradient(180deg, #f7fafc 0%, #ffffff 100%);
    z-index: 0;
  }

  .process-container {
    position: relative;
    z-index: 1;

    &:after {
      content: "";
      position: absolute;
      top: 35%;
      left: 15%;
      right: 15%;
      height: 2px;
      background: linear-gradient(
        90deg,
        rgba(45, 79, 163, 0) 0%,
        rgba(45, 79, 163, 0.2) 10%,
        rgba(45, 79, 163, 0.2) 90%,
        rgba(45, 79, 163, 0) 100%
      );
      z-index: 0;
    }
  }
`;

export const ProcessCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  height: 100%;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  z-index: 1;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(45, 79, 163, 0.2);

    .step-number {
      transform: scale(1.1);
      background: linear-gradient(135deg, #0f2852 0%, #2d4fa3 100%);
      color: white;

      &:after {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
      }
    }

    .step-icon {
      transform: rotate(360deg);
      color: #2d4fa3;
    }

    .step-arrow {
      transform: translateX(5px);
      opacity: 1;
    }

    &:before {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(45, 79, 163, 0.03) 0%,
      transparent 70%
    );
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
    transition: all 0.4s ease;
    pointer-events: none;
  }

  .step-number {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #f0f5ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 600;
    color: #0f2852;
    margin-bottom: 24px;
    position: relative;
    transition: all 0.4s ease;

    &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid #0f2852;
      opacity: 0;
      transition: all 0.4s ease;
    }
  }

  .step-icon {
    font-size: 32px;
    margin-bottom: 20px;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    color: #0f2852;
  }

  .step-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #1a1a1a;
  }

  .step-description {
    color: #666;
    font-size: 15px;
    line-height: 1.6;
  }

  .step-arrow {
    position: absolute;
    top: 35%;
    right: -32px;
    color: #2d4fa3;
    font-size: 24px;
    z-index: 2;
    transition: all 0.3s ease;
    opacity: 0.7;
  }
`;
