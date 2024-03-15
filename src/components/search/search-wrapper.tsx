'use client';
import React from 'react';

interface SearchWapperProps {
  children: React.ReactNode;
}

export default function SearchWapper({ children }: SearchWapperProps) {
  return (
    <div className="flex w-full grow">
      <div className="mt-3 flex w-full grow">
        <div className="relative z-0 flex size-full flex-col pb-1">
          <div className="relative flex grow flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}
