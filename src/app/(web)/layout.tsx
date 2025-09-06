import FooterApp from "@/components/footer";
import HeaderApp from "@/components/header";
import { AppProvider } from "@/contexts/app-context";
import { getUserBe } from "@services/backend.service";
import { Toaster } from "react-hot-toast";

export default async function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const resUser = await getUserBe()
  return (
    <AppProvider initUser={resUser}>
      <HeaderApp />
      {children}
      <FooterApp />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </AppProvider>
  );
}
