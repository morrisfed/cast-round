function Welcome() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-overlay bg-black/60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Cast Round</h1>
          <p className="mb-5">
            Welcome to Cast Round, the Morris Federation&apos;s voting system.
          </p>
          <p className="mb-5">
            To get started, please tap the button below to log in with your
            Membership Works account.
          </p>
          <form action="/api/auth/mw" method="get">
            <button className="btn-primary btn" type="submit">
              Log in with Membership Works
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
