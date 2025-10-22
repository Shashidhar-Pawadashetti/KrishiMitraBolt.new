import { Sprout, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sprout className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold">KrishiMitra</span>
            </div>
            <p className="text-gray-400">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-gray-400">{t('footer.email')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-gray-400">{t('footer.phone')}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Languages</h3>
            <div className="flex space-x-4 text-gray-400">
              <span>English</span>
              <span>हिन्दी</span>
              <span>ಕನ್ನಡ</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 KrishiMitra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
