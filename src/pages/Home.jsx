import { Link } from 'react-router-dom';
import { Camera, TrendingUp, MessageSquare, ArrowRight, Users, Target, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Camera className="w-12 h-12 text-primary-600" />,
      title: t('features.disease.title'),
      description: t('features.disease.description'),
      link: '/disease-scanner',
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary-600" />,
      title: t('features.market.title'),
      description: t('features.market.description'),
      link: '/market-prices',
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-primary-600" />,
      title: t('features.chat.title'),
      description: t('features.chat.description'),
      link: '/ai-chat',
    },
  ];

  const stats = [
    { icon: <Users className="w-8 h-8" />, label: t('stats.farmers') },
    { icon: <Target className="w-8 h-8" />, label: t('stats.accuracy') },
    { icon: <Clock className="w-8 h-8" />, label: t('stats.support') },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/disease-scanner"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                {t('hero.cta')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                {t('hero.learnMore')}
              </a>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className="flex justify-center mb-3 text-primary-600">
                  {stat.icon}
                </div>
                <p className="text-lg font-semibold text-gray-900">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-red-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('problem.title')}
          </h2>
          <p className="text-lg text-gray-700">
            {t('problem.description')}
          </p>
        </div>
      </section>

      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t('features.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-4 text-primary-600 font-semibold flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-lg mb-8 text-primary-100">
            Join thousands of Karnataka farmers using KrishiMitra to protect their crops and increase profits
          </p>
          <Link
            to="/disease-scanner"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
