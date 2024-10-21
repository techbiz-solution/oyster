// src/app/menu/layout.tsx


export default function MenuLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="min-h-screen bg-white">
        {/* Header with title and cart icon */}
        <header className="bg-white fixed top-0 w-full z-10 flex justify-between items-center p-6">
          <h1 className="text-2xl font-bold text-gray-800">Menu</h1>
          <button className="text-gray-800">
            {/* Cart Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h18l-2 9H5L3 3zM16 13v6H8v-6m4-4V4"
              />
            </svg>
          </button>
        </header>
  
        {/* Content will be injected here */}
        <main className="pt-20">
          {children}
        </main>
      </section>
    );
  }
  