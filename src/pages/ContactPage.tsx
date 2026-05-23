export default function ContactPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Contact Us</h1>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Reach out to the Rakta-Vahini team
        </p>

        <a
          href="mailto:support@raktavahini.app"
          className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="text-2xl">📧</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100">Email</p>
            <p className="text-sm text-gray-500">support@raktavahini.app</p>
          </div>
        </a>

        <a
          href="tel:+911800123456"
          className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="text-2xl">📞</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100">Helpline</p>
            <p className="text-sm text-gray-500">1800-123-456</p>
          </div>
        </a>

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <span className="text-2xl">🌐</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100">Website</p>
            <p className="text-sm text-gray-500">www.raktavahini.app</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Office Address</h3>
        <p>
          Rakta-Vahini Foundation<br />
          #42, Health Tech Park<br />
          Bengaluru, Karnataka 560001<br />
          India
        </p>
      </div>

      <p className="text-xs text-gray-400 text-center">
        We typically respond within 24 hours.
      </p>
    </div>
  );
}
