import Link from 'next/link';
import {
  HomeIcon,
  PlusIcon,
  ViewGridIcon,
  CogIcon,
} from '@heroicons/react/solid';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center flex-col space-y-6 md:space-y-0 md:flex-row md:justify-between text-black p-6">
      <p className="text-xl sm:text-3xl font-bold text-clip">
        <span className="text-white bg-fuchsia-500 px-3 py-2">Metaverse</span>{' '}
        Marketplace
      </p>
      <div className="flex space-x-6 items-center">
        <Link href="/">
          <a title="Home">
            <HomeIcon
              className={`navbar-icon ${
                router.pathname == '/' ? 'text-fuchsia-500' : ''
              }`}
            />
          </a>
        </Link>
        <Link href="/create">
          <a title="Create">
            <PlusIcon
              className={`navbar-icon ${
                router.pathname == '/create' ? 'text-fuchsia-500' : ''
              }`}
            />
          </a>
        </Link>
        <Link href="/collection">
          <a title="Collection">
            <ViewGridIcon
              className={`navbar-icon ${
                router.pathname == '/collection' ? 'text-fuchsia-500' : ''
              }`}
            />
          </a>
        </Link>
        <Link href="/dashboard">
          <a title="Creator Dashboard">
            <CogIcon
              className={`navbar-icon ${
                router.pathname == '/dashboard' ? 'text-fuchsia-500' : ''
              }`}
            />
          </a>
        </Link>
      </div>
    </nav>
  );
}
