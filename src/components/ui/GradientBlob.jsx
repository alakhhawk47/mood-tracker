import React from 'react';

export default function GradientBlob({ className = '', style = {} }) {
  return (
    <div
      className={`absolute rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob ${className}`}
      style={style}
    />
  );
}
