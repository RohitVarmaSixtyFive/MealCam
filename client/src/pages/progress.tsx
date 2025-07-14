import Head from 'next/head';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function ProgressPage() {
  return (
    <ProtectedLayout>
      <Head>
        <title>Progress - BiteMe</title>
        <meta name="description" content="View your nutrition progress and trends" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress</h1>
          <p className="text-gray-600">Track your nutrition trends over time.</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Progress Tracking</h2>
          <p className="text-gray-600 mb-6">
            Detailed progress tracking and analytics are coming soon! You'll be able to view:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium">Weekly Trends</span>
              </div>
              <p className="text-sm text-gray-600">See your nutrition patterns over the week</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium">Goal Progress</span>
              </div>
              <p className="text-sm text-gray-600">Track progress toward your nutrition goals</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium">Insights</span>
              </div>
              <p className="text-sm text-gray-600">Get personalized nutrition insights</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
