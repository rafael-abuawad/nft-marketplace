import '../styles/globals.css';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
