import Link from 'next/link';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav>
        <Link href="/">
          <a data-title="Home">Home</a>
        </Link>
        <Link href="/create">
          <a data-title="Create">Create</a>
        </Link>
        <Link href="/collection">
          <a data-title="Collection">Collection</a>
        </Link>
        <Link href="/dashboard">
          <a data-title="Creator Dashboard">Creator Dashboard</a>
        </Link>
      </nav>
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
