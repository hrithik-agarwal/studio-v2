export default function NoAccessCard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-12 text-center shadow-xl">
        <img
          src="/src/assets/404-error.svg"
          className="mx-auto mb-8 h-64 w-64 object-contain"
          alt=""
        />
        <h3 className="text-2xl font-semibold text-gray-900">
          Oops... you don't have access. <br />
          Please contact your admin to get the access.
        </h3>
      </div>
    </div>
  );
}
