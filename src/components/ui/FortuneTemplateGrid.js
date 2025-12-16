import React, { useState, useEffect } from 'react';

const FortuneTemplateGrid = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/fortune-templates`);
        const data = await response.json();

        if (data.success) {
          setTemplates(data.templates.filter(template => template.isActive));
        } else {
          setError('템플릿을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('Error fetching fortune templates:', err);
        setError('템플릿을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);


  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">등록된 운세 템플릿이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {templates.map((template) => (
        <article
          key={template.id}
          className=""
        >
          <a href={`/fortune/${template.templateKey}`} className="block">
            <div className="relative w-full" style={{ paddingBottom: '158.33%' }}>
              <img
                src={template.imageUrl || '/images/characters/webtoon/desert_fox_card_on_hands.jpeg'}
                alt={template.title}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/characters/webtoon/desert_fox_card_on_hands.jpeg';
                }}
              />
              {template.isPremium && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                    Premium
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-black mb-2">
                {template.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed truncate">
                {template.description || `${template.category === 'love' ? '연애운' :
                   template.category === 'career' ? '직업운' :
                   template.category === 'health' ? '건강운' :
                   template.category === 'money' ? '재물운' :
                   template.category === 'study' ? '학업운' :
                   template.category === 'special' ? '특별운세' : '기타'} 보러가기`}
              </p>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
};

export default FortuneTemplateGrid;