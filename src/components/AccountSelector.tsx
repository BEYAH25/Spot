'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export function SignInButton({ label, type }: { label: string; type: 'source' | 'destination' }) {
  return (
    <Button
      className="w-full mt-2"
      onClick={() => window.location.href = `/api/token/${type}`}
      variant="default"
    >
      {label}
    </Button>
  );
} 