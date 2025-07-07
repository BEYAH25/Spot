import React from 'react';

export default function MigrationStatus({ status }: { status: any }) {
  if (!status) return null;
  if (status.error) return <div className="text-red-600">{status.error}</div>;
  if (status.success) return <div className="text-green-600">{status.success}</div>;
  return <div>{JSON.stringify(status)}</div>;
} 