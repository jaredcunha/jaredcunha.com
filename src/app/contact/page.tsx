import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Jared Cunha',
  description: 'Contact me.',
};

export default function Contact() {
  return (
    <>
      <main className="site-wrap">
        <h1 className="page-title">Contact</h1>
        <div className="prose">
          <p>
            It‘s best to contact me by email. You can reach me at{' '}
            <a href="mailto:hello@jaredcunha.com">hello@jaredcunha.com</a>.
            <br />
          </p>
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </main>
    </>
  );
}
