export default function AdminContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`container mx-auto px-4 md:px-8 py-12 ${className}`}>{children}</div>;
}
