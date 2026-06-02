import { isSuperAdminSession } from "@/actions/auth/isSuperAdminSession";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    await isSuperAdminSession();
  return (
      <div>
        {children}
      </div>
  );
}
