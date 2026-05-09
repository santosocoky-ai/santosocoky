export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-black/40 font-medium">
          © {new Date().getFullYear()} Digtal Portfolio & CMS. Built with React & Supabase.
        </p>
      </div>
    </footer>
  );
}
