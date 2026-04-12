/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useContext, useEffect, useState } from 'react';
import { Button, Typography, Input, Toast } from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { useTranslation } from 'react-i18next';
import { IconPlay, IconCopy, IconHelpCircle, IconDownload } from '@douyinfe/semi-icons';
import { Link, useNavigate } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  OpenAI,
  Claude,
  Gemini,
  DeepSeek,
  Qwen,
} from '@lobehub/icons';

const { Text } = Typography;

const NewLandingPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [userOS, setUserOS] = useState('unknown');
  const isMobile = useIsMobile();
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;

  // 检测用户操作系统
  useEffect(() => {
    const detectOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('win') > -1) return 'windows';
      if (userAgent.indexOf('mac') > -1) return 'mac';
      if (userAgent.indexOf('linux') > -1) return 'linux';
      return 'unknown';
    };
    setUserOS(detectOS());
  }, []);
  const isChinese = i18n.language.startsWith('zh');
  const isDark = actualTheme === 'dark';

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        const { marked } = await import('marked');
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  // 如果有自定义首页内容，显示自定义内容
  if (homePageContentLoaded && homePageContent !== '') {
    return (
      <div className='w-full overflow-x-hidden'>
        <NoticeModal
          visible={noticeVisible}
          onClose={() => setNoticeVisible(false)}
          isMobile={isMobile}
        />
        <div className='overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-screen border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      
      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden'>
        {/* Background Effects */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div 
            className='absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-15'
            style={{
              background: 'var(--semi-color-primary)',
              top: '-200px',
              right: '-200px',
              animation: 'float 20s ease-in-out infinite',
            }}
          />
          <div 
            className='absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-15'
            style={{
              background: '#a855f7',
              bottom: '-300px',
              left: '-200px',
              animation: 'float 25s ease-in-out infinite reverse',
            }}
          />
          {/* Grid Pattern */}
          <div 
            className='absolute inset-0 opacity-[0.02]'
            style={{
              backgroundImage: `
                linear-gradient(var(--semi-color-text-0) 1px, transparent 1px),
                linear-gradient(90deg, var(--semi-color-text-0) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className='relative z-10 max-w-4xl mx-auto text-center mt-16'>
          {/* Badge */}
          <div 
            className='inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border'
            style={{
              background: 'rgba(0, 240, 255, 0.1)',
              borderColor: 'rgba(0, 240, 255, 0.2)',
            }}
          >
            <span 
              className='w-2 h-2 rounded-full'
              style={{ 
                background: 'var(--semi-color-primary)',
                animation: 'pulse 2s infinite',
              }}
            />
            <span className='text-sm' style={{ color: 'var(--semi-color-primary)' }}>
              {t('国内直连 · 极速稳定')}
            </span>
          </div>

          {/* Title */}
          <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6'>
            <span className='shine-text'>{t('Claude Code')}</span>
            <br />
            <span style={{ color: 'var(--semi-color-text-0)' }}>{t('畅快体验')}</span>
          </h1>

          {/* Description */}
          <p 
            className='text-base md:text-lg lg:text-xl mb-8 max-w-xl mx-auto'
            style={{ color: 'var(--semi-color-text-1)' }}
          >
            {t('无需翻墙，原生接入Claude API。稳定、快速、价格实惠，让你的AI开发更高效。')}
          </p>

          {/* URL Input */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto mb-8'>
            <Input
              readonly
              value={serverAddress}
              className='flex-1 !rounded-full'
              size={isMobile ? 'default' : 'large'}
              suffix={
                <Button
                  type='primary'
                  onClick={handleCopyBaseURL}
                  icon={<IconCopy />}
                  className='!rounded-full'
                />
              }
            />
          </div>

          {/* Action Buttons */}
          <div className='flex flex-row gap-4 justify-center items-center mb-12'>
            <Link to='/console'>
              <Button
                theme='solid'
                type='primary'
                size={isMobile ? 'default' : 'large'}
                className='!rounded-3xl px-8 py-2'
                icon={<IconPlay />}
              >
                {t('立即开始')}
              </Button>
            </Link>
            <Button
              size={isMobile ? 'default' : 'large'}
              className='!rounded-3xl px-6 py-2'
              icon={<IconHelpCircle />}
              onClick={() => navigate('/tutorial')}
            >
              {t('查看教程')}
            </Button>
          </div>

          {/* Supported Models */}
          <div className='mt-12'>
            <Text
              type='tertiary'
              className='text-lg md:text-xl font-light mb-6 block'
            >
              {t('支持众多的大模型供应商')}
            </Text>
            <div className='flex flex-wrap items-center justify-center gap-6 max-w-3xl mx-auto'>
              <div className='w-10 h-10 flex items-center justify-center'>
                <Claude.Color size={40} />
              </div>
              <div className='w-10 h-10 flex items-center justify-center'>
                <OpenAI size={40} />
              </div>
              <div className='w-10 h-10 flex items-center justify-center'>
                <Gemini.Color size={40} />
              </div>
              <div className='w-10 h-10 flex items-center justify-center'>
                <DeepSeek.Color size={40} />
              </div>
              <div className='w-10 h-10 flex items-center justify-center'>
                <Qwen.Color size={40} />
              </div>
              <div className='w-10 h-10 flex items-center justify-center'>
                <Typography.Text className='!text-xl font-bold'>30+</Typography.Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4' style={{ background: 'var(--semi-color-bg-1)' }}>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <span 
              className='inline-block px-4 py-1 rounded-full text-sm mb-4 border'
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                borderColor: 'rgba(168, 85, 247, 0.2)',
                color: '#a855f7',
              }}
            >
              {t('核心优势')}
            </span>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4' style={{ color: 'var(--semi-color-text-0)' }}>
              {t('为什么选择我们')}
            </h2>
            <p className='text-base md:text-lg' style={{ color: 'var(--semi-color-text-1)' }}>
              {t('专为国内开发者打造的Claude API代理服务')}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              { icon: '🚀', title: t('国内直连'), desc: t('无需翻墙，直接访问Claude API。延迟低至50ms，体验流畅如本地。') },
              { icon: '⚡', title: t('极速响应'), desc: t('自建CDN加速，7×24小时稳定服务。官方API同等质量保障。') },
              { icon: '💰', title: t('价格实惠'), desc: t('比官方更低的价格，按量计费无最低消费。更有免费额度赠送。') },
              { icon: '🔧', title: t('完全兼容'), desc: t('完美兼容OpenAI SDK，只需修改baseURL即可平滑迁移。') },
              { icon: '🛡️', title: t('安全可靠'), desc: t('企业级安全加密，API Key加密存储。绝不记录你的请求内容。') },
              { icon: '💬', title: t('中文客服'), desc: t('7×24小时中文技术支持，响应迅速。随时答疑。') },
            ].map((feature, idx) => (
              <div
                key={idx}
                className='p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group'
                style={{
                  background: 'var(--semi-color-bg-2)',
                  borderColor: 'var(--semi-color-border)',
                }}
              >
                <div 
                  className='absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity'
                  style={{
                    background: 'linear-gradient(90deg, var(--semi-color-primary), #a855f7)',
                  }}
                />
                <div 
                  className='w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4'
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(168, 85, 247, 0.1))',
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className='text-lg font-semibold mb-2' style={{ color: 'var(--semi-color-text-0)' }}>
                  {feature.title}
                </h3>
                <p className='text-sm' style={{ color: 'var(--semi-color-text-1)' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className='py-20 px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-12'>
            <span 
              className='inline-block px-4 py-1 rounded-full text-sm mb-4 border'
              style={{
                background: 'rgba(0, 240, 255, 0.1)',
                borderColor: 'rgba(0, 240, 255, 0.2)',
                color: 'var(--semi-color-primary)',
              }}
            >
              {t('快速上手')}
            </span>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4' style={{ color: 'var(--semi-color-text-0)' }}>
              {t('三步开始使用')}
            </h2>
          </div>

          <div className='flex flex-col gap-6'>
            {/* 步骤1 */}
            <div
              className='flex gap-4 p-6 rounded-2xl border transition-all duration-300 hover:translate-x-2'
              style={{
                background: 'var(--semi-color-bg-1)',
                borderColor: 'var(--semi-color-border)',
              }}
            >
              <div 
                className='w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0'
                style={{
                  background: 'linear-gradient(135deg, var(--semi-color-primary), #a855f7)',
                  color: 'var(--semi-color-bg-0)',
                }}
              >
                1
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2' style={{ color: 'var(--semi-color-text-0)' }}>
                  {t('注册并登录账户')}
                </h3>
                <p className='text-sm' style={{ color: 'var(--semi-color-text-1)' }}>
                  {t('访问平台，注册一个账户（请记住用户名，方便找回），注册完成后登录。')}
                </p>
              </div>
            </div>

            {/* 步骤2 */}
            <div
              className='flex gap-4 p-6 rounded-2xl border transition-all duration-300 hover:translate-x-2'
              style={{
                background: 'var(--semi-color-bg-1)',
                borderColor: 'var(--semi-color-border)',
              }}
            >
              <div 
                className='w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0'
                style={{
                  background: 'linear-gradient(135deg, var(--semi-color-primary), #a855f7)',
                  color: 'var(--semi-color-bg-0)',
                }}
              >
                2
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2' style={{ color: 'var(--semi-color-text-0)' }}>
                  {t('兑换额度并创建令牌')}
                </h3>
                <p className='text-sm' style={{ color: 'var(--semi-color-text-1)' }}>
                  {t('点击「钱包管理」→「兑换额度」，然后点击「令牌管理」→「添加令牌」创建API Key。')}
                </p>
              </div>
            </div>

            {/* 步骤3 - 下载安装 */}
            <div
              className='flex gap-4 p-6 rounded-2xl border transition-all duration-300 hover:translate-x-2'
              style={{
                background: 'var(--semi-color-bg-1)',
                borderColor: 'var(--semi-color-border)',
              }}
            >
              <div 
                className='w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0'
                style={{
                  background: 'linear-gradient(135deg, var(--semi-color-primary), #a855f7)',
                  color: 'var(--semi-color-bg-0)',
                }}
              >
                3
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold mb-4' style={{ color: 'var(--semi-color-text-0)' }}>
                  {t('下载并一键安装')}
                </h3>
                
                {/* Windows 版本 */}
                <div 
                  className={`mb-4 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    userOS === 'windows' 
                      ? 'shadow-lg scale-[1.02]' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: userOS === 'windows' 
                      ? 'linear-gradient(135deg, rgba(0,120,212,0.12), rgba(0,120,212,0.04))'
                      : 'var(--semi-color-bg-2)',
                    borderColor: userOS === 'windows' ? '#0078D4' : 'var(--semi-color-border)',
                  }}
                >
                  <div className='flex items-center gap-3 mb-2'>
                    <div 
                      className='w-10 h-10 rounded-xl flex items-center justify-center shadow-md'
                      style={{ 
                        background: userOS === 'windows' 
                          ? 'linear-gradient(135deg, #0078D4, #106EBE)'
                          : 'linear-gradient(135deg, #6B7280, #4B5563)'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-bold text-base' style={{ color: userOS === 'windows' ? '#0078D4' : 'var(--semi-color-text-0)' }}>
                          Windows
                        </span>
                        {userOS === 'windows' && (
                          <span 
                            className='px-2 py-0.5 text-xs font-medium rounded-full'
                            style={{ 
                              background: 'linear-gradient(135deg, #0078D4, #106EBE)',
                              color: 'white'
                            }}
                          >
                            {t('当前系统')}
                          </span>
                        )}
                      </div>
                      <p className='text-xs mt-0.5' style={{ color: 'var(--semi-color-text-2)' }}>
                        {t('解压后运行')} <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${userOS === 'windows' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>claude.bat</code>
                      </p>
                    </div>
                    <Button
                      type={userOS === 'windows' ? 'primary' : 'secondary'}
                      theme='solid'
                      size='large'
                      icon={<IconDownload />}
                      onClick={() => window.open('/assets/files/Windows.zip', '_blank')}
                      style={userOS === 'windows' ? { 
                        background: 'linear-gradient(135deg, #0078D4, #106EBE)',
                        borderColor: '#0078D4'
                      } : {}}
                    >
                      {t('下载')}
                    </Button>
                  </div>
                </div>

                {/* Mac 版本 */}
                <div 
                  className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    userOS === 'mac' 
                      ? 'shadow-lg scale-[1.02]' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: userOS === 'mac' 
                      ? 'linear-gradient(135deg, rgba(50,50,50,0.1), rgba(50,50,50,0.03))'
                      : 'var(--semi-color-bg-2)',
                    borderColor: userOS === 'mac' ? '#333' : 'var(--semi-color-border)',
                  }}
                >
                  <div className='flex items-center gap-3'>
                    <div 
                      className='w-10 h-10 rounded-xl flex items-center justify-center shadow-md'
                      style={{ 
                        background: userOS === 'mac' 
                          ? 'linear-gradient(135deg, #333, #111)'
                          : 'linear-gradient(135deg, #6B7280, #4B5563)'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-bold text-base' style={{ color: userOS === 'mac' ? '#333' : 'var(--semi-color-text-0)' }}>
                          macOS
                        </span>
                        {userOS === 'mac' && (
                          <span 
                            className='px-2 py-0.5 text-xs font-medium rounded-full'
                            style={{ 
                              background: 'linear-gradient(135deg, #333, #111)',
                              color: 'white'
                            }}
                          >
                               {t('当前系统')}
                          </span>
                        )}
                      </div>
                      <p className='text-xs mt-0.5' style={{ color: 'var(--semi-color-text-2)' }}>
                        {t('解压后运行')} <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${userOS === 'mac' ? 'bg-gray-300 text-gray-800' : 'bg-gray-200 text-gray-600'}`}>claude.command</code>
                      </p>
                    </div>
                    <Button
                      type={userOS === 'mac' ? 'primary' : 'secondary'}
                      theme='solid'
                      size='large'
                      icon={<IconDownload />}
                      onClick={() => window.open('/assets/files/Mac.zip', '_blank')}
                      style={userOS === 'mac' ? { 
                        background: 'linear-gradient(135deg, #333, #111)',
                        borderColor: '#333'
                      } : {}}
                    >
                      {t('下载')}
                    </Button>
                  </div>
                </div>

                <p className='text-xs mt-4 pt-3 border-t text-center' style={{ color: 'var(--semi-color-text-2)', borderColor: 'var(--semi-color-border)' }}>
                  {t('安装完成后输入 API Key（使用后台创建的令牌），即可开始使用 Claude')}
                </p>
              </div>
            </div>
          </div>

          <div className='text-center mt-8'>
            <Button
              theme='solid'
              type='primary'
              size='large'
              className='!rounded-3xl px-8'
              icon={<IconHelpCircle />}
              onClick={() => navigate('/tutorial')}
            >
              {t('查看详细教程')}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className='py-20 px-4'
        style={{
          background: 'linear-gradient(180deg, var(--semi-color-bg-1), var(--semi-color-bg-0))',
        }}
      >
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4' style={{ color: 'var(--semi-color-text-0)' }}>
            {t('准备好开始了吗？')}
          </h2>
          <p className='text-base md:text-lg mb-8' style={{ color: 'var(--semi-color-text-1)' }}>
            {t('立即注册，开启你的Claude之旅。无需信用卡，立即免费试用。')}
          </p>
          <Link to='/console'>
            <Button
              theme='solid'
              type='primary'
              size='large'
              className='!rounded-3xl px-8'
              icon={<IconPlay />}
            >
              {t('免费注册')}
            </Button>
          </Link>
        </div>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(50px, 30px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default NewLandingPage;
