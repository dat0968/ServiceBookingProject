import Header from "@/components/header";
import Footer from "@/components/footer";

export default function CustomerLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-grow-1">{children}</div>
      <Footer />
    </div>
  );
}
