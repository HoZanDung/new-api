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

import React, { useState, useContext } from 'react';
import {
  Typography,
  Collapse,
  Button,
  Tabs,
  TabPane,
} from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconCopy } from '@douyinfe/semi-icons';
import { StatusContext } from '../../context/Status';
import { copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';

const { Title, Text, Paragraph } = Typography;

const TutorialPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [statusState] = useContext(StatusContext);
  const isMobile = useIsMobile();
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;

  const handleCopy = async (text) => {
    const ok = await copy(text);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  const CodeBlock = ({ code, language = 'bash' }) => (
    <div className='relative group'>
      <pre
        className='p-4 rounded-lg overflow-x-auto text-sm'
        style={{
          background: 'var(--semi-color-bg-1)',
          border: '1px solid var(--semi-color-border)',
        }}
      >
        <code style={{ color: 'var(--semi-color-text-1)' }}>{code}</code>
      </pre>
      <Button
        size='small'
        icon={<IconCopy />}
        className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
        onClick={() => handleCopy(code)}
      />
    </div>
  );

  const StepCard = ({ number, title, children, warning }) => (
    <div
      className='flex gap-4 p-5 rounded-xl border transition-all duration-300'
      style={{
        background: 'var(--semi-color-bg-1)',
        borderColor: 'var(--semi-color-border)',
      }}
    >
      <div
        className='w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold shrink-0'
        style={{
          background: 'linear-gradient(135deg, var(--semi-color-primary), #a855f7)',
          color: 'var(--semi-color-bg-0)',
        }}
      >
        {number}
      </div>
      <div className='flex-1'>
        <h4 className='text-base font-semibold mb-2' style={{ color: 'var(--semi-color-text-0)' }}>
          {title}
        </h4>
        <div className='text-sm' style={{ color: 'var(--semi-color-text-1)' }}>
          {children}
        </div>
        {warning && (
          <div
            className='mt-3 p-3 rounded-lg text-sm'
            style={{
              background: 'rgba(251, 222, 40, 0.1)',
              border: '1px solid rgba(251, 222, 40, 0.2)',
              color: '#fbde28',
            }}
          >
            ⚠️ {warning}
          </div>
        )}
      </div>
    </div>
  );

  const ModelTag = ({ type, children }) => {
    const styles = {
      expensive: {
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#ef4444',
      },
      recommended: {
        background: 'rgba(0, 240, 255, 0.1)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        color: 'var(--semi-color-primary)',
      },
      cheap: {
        background: 'rgba(34, 197, 94, 0.15)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        color: '#22c55e',
      },
    };
    return (
      <span
        className='inline-block px-3 py-1 rounded-lg text-sm font-medium mr-2 mb-2'
        style={styles[type]}
      >
        {children}
      </span>
    );
  };

  return (
    <div className='min-h-screen pb-20' style={{ background: 'var(--semi-color-bg-0)' }}>
      {/* Header */}
      <div
        className='sticky top-0 z-10 px-4 py-4 border-b'
        style={{
          background: 'var(--semi-color-bg-0)',
          borderColor: 'var(--semi-color-border)',
        }}
      >
        <div className='max-w-4xl mx-auto flex items-center gap-4'>
          <Button
            icon={<IconArrowLeft />}
            onClick={() => navigate('/')}
            type='tertiary'
          />
          <Title heading={4} className='!mb-0'>
            {t('使用教程')}
          </Title>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-8'>
        {/* Quick Navigation */}
        <Tabs type='button' size='large'>
          <TabPane tab={t('Key兑换教程')} itemKey='key'>
            <div className='flex flex-col gap-4 mt-6'>
              <StepCard number='1' title={t('注册并登录账户')}>
                <p>{t('访问平台地址，注册一个账户（请记住用户名，方便找回），注册完成后登录。')}</p>
                <div className='mt-3'>
                  <CodeBlock code={`${serverAddress}`} />
                </div>
              </StepCard>

              <StepCard number='2' title={t('兑换额度')}>
                <p>{t('点击「钱包管理」→「兑换额度」，将人民币兑换为美元额度。兑换完成后可在钱包查看当前余额。')}</p>
              </StepCard>

              <StepCard number='3' title={t('创建 API 令牌')}>
                <p>{t('点击「令牌管理」→「添加令牌」。名称随意填写，令牌分组可选择默认或 Claude Code 分组。')}</p>
                {/* <div
                  className='mt-3 p-3 rounded-lg text-sm'
                  style={{
                    background: 'rgba(0, 240, 255, 0.1)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    color: 'var(--semi-color-primary)',
                  }}
                >
                  💡 {t('Claude Code 分组：1.5倍倍率，支持 1M 上下文，带缓存，整体使用体验更顺滑稳定。')}
                </div> */}
              </StepCard>

              <StepCard 
                number='4' 
                title={t('复制使用 API Key')}
      
              >
                <div className='mt-3 space-y-2'>
                <div
                      className='mt-3 p-3 rounded-lg text-sm'
                      style={{
                        background: 'rgba(0, 240, 255, 0.1)',
                        border: '1px solid rgba(0, 240, 255, 0.2)',
                        color: 'var(--semi-color-primary)',
                      }}
                    >
                      💡 Windows在一键安装过程中,会弹出记事本,将令牌粘贴到记事本中即可。如需要更新令牌,运行安装包中内的setup程序
                </div>


                <div
                      className='mt-3 p-3 rounded-lg text-sm'
                      style={{
                        background: 'rgba(168, 85, 247, 0.1)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        color: '#a855f7',
                      }}
                    >
                      💡 macOS在一键安装过程中,把令牌复制到窗口中即可
                </div>

                </div>

                {/* <div
                  className='mt-3 p-3 rounded-lg text-sm'
                  style={{
                    background: 'rgba(0, 240, 255, 0.1)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    color: 'var(--semi-color-primary)',
                  }}
                >
                  💡 {t('复制令牌时注意检查前后是否有空格')}
                </div> */}
                
              </StepCard>
            </div>

            {/* Model Selection Guide */}
            {/* <div
              className='mt-8 p-6 rounded-2xl border'
              style={{
                background: 'var(--semi-color-bg-1)',
                borderColor: 'var(--semi-color-border)',
              }}
            >
              <Title heading={5} className='!mb-4'>
                📊 {t('模型选择指南')}
              </Title>
              
              <div className='mb-4'>
                <p className='text-sm mb-2' style={{ color: 'var(--semi-color-text-1)' }}>
                  💰 {t('价格昂贵的模型（慎用）')}
                </p>
                <div>
                  <ModelTag type='expensive'>Opus 4.0</ModelTag>
                  <ModelTag type='expensive'>Opus 4.1</ModelTag>
                </div>
                <p className='text-xs mt-1' style={{ color: 'var(--semi-color-text-2)' }}>
                  {t('这两个模型比 Opus 4.5 和 4.6 都贵，请慎重选择！')}
                </p>
              </div>

              <div className='mb-4'>
                <p className='text-sm mb-2' style={{ color: 'var(--semi-color-text-1)' }}>
                  ✅ {t('推荐模型（价格适中）')}
                </p>
                <div>
                  <ModelTag type='recommended'>Sonnet 3.5</ModelTag>
                  <ModelTag type='recommended'>Sonnet 3.7</ModelTag>
                  <ModelTag type='recommended'>Sonnet 4.0</ModelTag>
                  <ModelTag type='recommended'>Sonnet 4.5</ModelTag>
                  <ModelTag type='recommended'>Sonnet 4.6</ModelTag>
                </div>
                <p className='text-xs mt-1' style={{ color: 'var(--semi-color-text-2)' }}>
                  {t('这些模型智商足够写代码，价格适中，推荐使用！')}
                </p>
              </div>

              <div>
                <p className='text-sm mb-2' style={{ color: 'var(--semi-color-text-1)' }}>
                  🔰 {t('便宜模型（简单任务）')}
                </p>
                <div>
                  <ModelTag type='cheap'>Haiku 3.5</ModelTag>
                  <ModelTag type='cheap'>Haiku 4.5</ModelTag>
                </div>
                <p className='text-xs mt-1' style={{ color: 'var(--semi-color-text-2)' }}>
                  {t('极其便宜，适合翻译、写简单注释或润色文档。写复杂代码可能会写出 Bug。')}
                </p>
              </div>
            </div> */}

            {/* Billing Info */}
            {/* <div
              className='mt-6 p-6 rounded-2xl'
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(0, 240, 255, 0.1))',
                border: '1px solid var(--semi-color-border)',
              }}
            >
              <Title heading={5} className='!mb-4' style={{ color: '#a855f7' }}>
                📋 {t('计费说明')}
              </Title>
              <ul className='space-y-2 text-sm' style={{ color: 'var(--semi-color-text-1)' }}>
                <li className='flex items-start gap-2'>
                  <span style={{ color: 'var(--semi-color-primary)' }}>→</span>
                  {t('计费逻辑完全同步官方：模型单价 × (输入 + 输出) + 缓存机制')}
                </li>
                <li className='flex items-start gap-2'>
                  <span style={{ color: 'var(--semi-color-primary)' }}>→</span>
                  {t('1元人民币 = 1美元额度')}
                </li>
                <li className='flex items-start gap-2'>
                  <span style={{ color: 'var(--semi-color-primary)' }}>→</span>
                  {t('默认/VIP 分组：1倍倍率 | Claude Code 分组：1.5倍倍率')}
                </li>
                <li className='flex items-start gap-2'>
                  <span style={{ color: 'var(--semi-color-primary)' }}>→</span>
                  {t('建议使用 Sonnet 模型，倍率 1.5倍，价格适中')}
                </li>
              </ul>
            </div> */}
          </TabPane>

          <TabPane tab='Claude Code' itemKey='claude-code'>
            <div className='mt-6'>
              <Title heading={5} className='!mb-4'>
                🔥 Claude Code {t('配置教程')}
              </Title>

              {/* Windows */}
              <Collapse accordion>
                <Collapse.Panel header={`🪟 Windows ${t('版配置')}`} itemKey='windows'>
                  <div className='flex flex-col gap-4 py-4'>
                    <StepCard number='1' title={t('安装 Node.js')}>
                      <p>{t('从 Node.js 官网下载并安装 LTS 版本。安装完成后打开终端验证：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code='node --version' />
                      </div>
                    </StepCard>

                    <StepCard number='2' title={t('安装 Claude Code')}>
                      <p>{t('打开 PowerShell 或 CMD，运行以下命令：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code='npm install -g @anthropic-ai/claude-code' />
                      </div>
                    </StepCard>

                    <StepCard number='3' title={t('配置环境变量')}>
                      <p>{t('设置 API 地址和密钥。在 PowerShell 中运行：')}</p>
                      <div className='mt-2 space-y-2'>
                        <CodeBlock code={`$env:ANTHROPIC_BASE_URL = "${serverAddress}"`} />
                        <CodeBlock code='$env:ANTHROPIC_API_KEY = "你的API密钥"' />
                      </div>
                      <p className='mt-2 text-xs' style={{ color: 'var(--semi-color-text-2)' }}>
                        {t('提示：可以将环境变量添加到系统环境变量中实现永久生效。')}
                      </p>
                    </StepCard>

                    <StepCard number='4' title={t('启动使用')}>
                      <p>{t('在项目目录中运行：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code='claude' />
                      </div>
                      <p className='mt-2'>{t('首次运行会提示登录，按提示操作即可。')}</p>
                    </StepCard>
                  </div>
                </Collapse.Panel>

                <Collapse.Panel header={`🍎 macOS ${t('版配置')}`} itemKey='macos'>
                  <div className='flex flex-col gap-4 py-4'>
                    <StepCard number='1' title={t('安装 Node.js')}>
                      <p>{t('推荐使用 Homebrew 安装：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code='brew install node' />
                      </div>
                    </StepCard>

                    <StepCard number='2' title={t('安装 Claude Code')}>
                      <div className='mt-2'>
                        <CodeBlock code='npm install -g @anthropic-ai/claude-code' />
                      </div>
                    </StepCard>

                    <StepCard number='3' title={t('配置环境变量')}>
                      <p>{t('编辑 ~/.zshrc 或 ~/.bash_profile，添加：')}</p>
                      <div className='mt-2 space-y-2'>
                        <CodeBlock code={`export ANTHROPIC_BASE_URL="${serverAddress}"`} />
                        <CodeBlock code='export ANTHROPIC_API_KEY="你的API密钥"' />
                      </div>
                      <p className='mt-2'>{t('然后执行：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code='source ~/.zshrc' />
                      </div>
                    </StepCard>

                    <StepCard number='4' title={t('启动使用')}>
                      <div className='mt-2'>
                        <CodeBlock code='claude' />
                      </div>
                    </StepCard>
                  </div>
                </Collapse.Panel>

                <Collapse.Panel header={`🐧 Linux ${t('版配置')}`} itemKey='linux'>
                  <div className='flex flex-col gap-4 py-4'>
                    <StepCard number='1' title={t('安装 Node.js')}>
                      <p>{t('Ubuntu/Debian：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code={`curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs`} />
                      </div>
                    </StepCard>

                    <StepCard number='2' title={t('安装 Claude Code')}>
                      <div className='mt-2'>
                        <CodeBlock code='sudo npm install -g @anthropic-ai/claude-code' />
                      </div>
                    </StepCard>

                    <StepCard number='3' title={t('配置环境变量')}>
                      <p>{t('编辑 ~/.bashrc，添加：')}</p>
                      <div className='mt-2 space-y-2'>
                        <CodeBlock code={`export ANTHROPIC_BASE_URL="${serverAddress}"`} />
                        <CodeBlock code='export ANTHROPIC_API_KEY="你的API密钥"' />
                      </div>
                      <div className='mt-2'>
                        <CodeBlock code='source ~/.bashrc' />
                      </div>
                    </StepCard>

                    <StepCard number='4' title={t('启动使用')}>
                      <div className='mt-2'>
                        <CodeBlock code='claude' />
                      </div>
                    </StepCard>
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          </TabPane>

          <TabPane tab={t('编辑器配置')} itemKey='editor'>
            <div className='mt-6'>
              <Title heading={5} className='!mb-4'>
                💻 {t('编辑器配置教程')}
              </Title>

              <Collapse accordion>
                {/* VS Code */}
                <Collapse.Panel header='🐬 VS Code + Claude Code' itemKey='vscode'>
                  <div className='flex flex-col gap-4 py-4'>
                    <StepCard number='1' title={t('安装 Claude Code 扩展')}>
                      <p>{t('在 VS Code 扩展市场搜索 "Claude Code" 并安装官方扩展。')}</p>
                    </StepCard>

                    <StepCard number='2' title={t('配置 API 设置')}>
                      <p>{t('打开 VS Code 设置 (Ctrl+,)，搜索 Claude Code，配置：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code={`API Base URL: ${serverAddress}
API Key: 你的API密钥`} />
                      </div>
                    </StepCard>

                    <StepCard number='3' title={t('或者使用环境变量')}>
                      <p>{t('也可以通过环境变量配置，在终端中设置后启动 VS Code：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code={`# Windows PowerShell
$env:ANTHROPIC_BASE_URL="${serverAddress}"
$env:ANTHROPIC_API_KEY="你的API密钥"
code .

# macOS/Linux
export ANTHROPIC_BASE_URL="${serverAddress}"
export ANTHROPIC_API_KEY="你的API密钥"
code .`} />
                      </div>
                    </StepCard>
                  </div>
                </Collapse.Panel>

                {/* JetBrains */}
                <Collapse.Panel header='📕 JetBrains IDEA 系列' itemKey='jetbrains'>
                  <div className='flex flex-col gap-4 py-4'>
                    <StepCard number='1' title={t('安装插件')}>
                      <p>{t('在 Settings → Plugins → Marketplace 搜索 "Claude Code" 并安装。')}</p>
                    </StepCard>

                    <StepCard number='2' title={t('配置 API')}>
                      <p>{t('在 Settings → Tools → Claude Code 中配置：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code={`API URL: ${serverAddress}
API Key: 你的API密钥`} />
                      </div>
                    </StepCard>

                    <StepCard number='3' title={t('使用')}>
                      <p>{t('配置完成后，可以通过工具栏或快捷键调用 Claude Code 功能。')}</p>
                    </StepCard>
                  </div>
                </Collapse.Panel>

                {/* Cursor */}
                <Collapse.Panel header='🍕 Cursor' itemKey='cursor'>
                  <div className='flex flex-col gap-4 py-4'>
                    <StepCard number='1' title={t('打开设置')}>
                      <p>{t('点击右上角齿轮图标，选择 "Settings"。')}</p>
                    </StepCard>

                    <StepCard number='2' title={t('配置 Claude API')}>
                      <p>{t('找到 "Claude API" 或 "Model Provider" 设置，添加自定义提供商：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code={`Provider: Anthropic (Custom)
Base URL: ${serverAddress}
API Key: 你的API密钥`} />
                      </div>
                    </StepCard>

                    <StepCard number='3' title={t('选择模型')}>
                      <p>{t('在聊天界面选择配置好的 Claude 模型即可使用。')}</p>
                    </StepCard>
                  </div>
                </Collapse.Panel>

                {/* Trae */}
                <Collapse.Panel header='🌲 Trae' itemKey='trae'>
                  <div className='flex flex-col gap-4 py-4'>
                    <StepCard number='1' title={t('打开设置')}>
                      <p>{t('在 Trae 中打开设置面板。')}</p>
                    </StepCard>

                    <StepCard number='2' title={t('配置 Claude Code 插件')}>
                      <p>{t('找到 Claude Code 插件设置，配置自定义 API 端点：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code={`API Endpoint: ${serverAddress}
API Key: 你的API密钥`} />
                      </div>
                    </StepCard>
                  </div>
                </Collapse.Panel>

                {/* Windsurf */}
                <Collapse.Panel header='🏄 Windsurf' itemKey='windsurf'>
                  <div className='flex flex-col gap-4 py-4'>
                    <StepCard number='1' title={t('打开设置')}>
                      <p>{t('使用 Ctrl+Shift+P 打开命令面板，搜索 "Settings"。')}</p>
                    </StepCard>

                    <StepCard number='2' title={t('配置 Claude Code')}>
                      <p>{t('在设置中找到 Claude Code 配置项：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code={`Base URL: ${serverAddress}
API Key: 你的API密钥`} />
                      </div>
                    </StepCard>

                    <StepCard number='3' title={t('或使用环境变量')}>
                      <div className='mt-2'>
                        <CodeBlock code={`export ANTHROPIC_BASE_URL="${serverAddress}"
export ANTHROPIC_API_KEY="你的API密钥"
windsurf .`} />
                      </div>
                    </StepCard>
                  </div>
                </Collapse.Panel>

                {/* Roo Code */}
                <Collapse.Panel header='🦘 VS Code + Roo Code' itemKey='roocode'>
                  <div className='flex flex-col gap-4 py-4'>
                    <StepCard number='1' title={t('安装 Roo Code 扩展')}>
                      <p>{t('在 VS Code 扩展市场搜索 "Roo Code" 并安装。')}</p>
                    </StepCard>

                    <StepCard number='2' title={t('配置 API 提供商')}>
                      <p>{t('打开 Roo Code 设置，选择 "Anthropic" 作为提供商：')}</p>
                      <div className='mt-2'>
                        <CodeBlock code={`Base URL: ${serverAddress}
API Key: 你的API密钥
Model: claude-sonnet-4-20250514 (推荐)`} />
                      </div>
                    </StepCard>

                    <StepCard number='3' title={t('开始使用')}>
                      <p>{t('配置完成后，使用侧边栏的 Roo Code 面板开始对话。')}</p>
                    </StepCard>
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          </TabPane>

          <TabPane tab={t('常用参数')} itemKey='params'>
            <div className='mt-6 space-y-6'>
              <div
                className='p-6 rounded-2xl border'
                style={{
                  background: 'var(--semi-color-bg-1)',
                  borderColor: 'var(--semi-color-border)',
                }}
              >
                <Title heading={5} className='!mb-4'>
                  🌐 API {t('地址')}
                </Title>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm mb-2' style={{ color: 'var(--semi-color-text-1)' }}>
                      OpenAI {t('协议')} ({t('大多数SDK使用')}):
                    </p>
                    <CodeBlock code={`${serverAddress}/v1`} />
                  </div>
                  <div>
                    <p className='text-sm mb-2' style={{ color: 'var(--semi-color-text-1)' }}>
                      Anthropic {t('协议')} ({t('Claude Code等使用')}):
                    </p>
                    <CodeBlock code={serverAddress} />
                  </div>
                </div>
              </div>

              <div
                className='p-6 rounded-2xl border'
                style={{
                  background: 'var(--semi-color-bg-1)',
                  borderColor: 'var(--semi-color-border)',
                }}
              >
                <Title heading={5} className='!mb-4'>
                  💡 {t('使用建议')}
                </Title>
                <ul className='space-y-3 text-sm' style={{ color: 'var(--semi-color-text-1)' }}>
                  <li className='flex items-start gap-2'>
                    <span style={{ color: 'var(--semi-color-primary)' }}>→</span>
                    {t('大多数 SDK 使用 OpenAI 协议即可')}
                  </li>
                  <li className='flex items-start gap-2'>
                    <span style={{ color: 'var(--semi-color-primary)' }}>→</span>
                    {t('Claude Code、OpenClaw 等建议使用 Anthropic 协议')}
                  </li>
                  <li className='flex items-start gap-2'>
                    <span style={{ color: 'var(--semi-color-primary)' }}>→</span>
                    {t('复制 Key 时注意检查前后是否有空格')}
                  </li>
                </ul>
              </div>

              <div
                className='p-6 rounded-2xl'
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(0, 240, 255, 0.1))',
                  border: '1px solid var(--semi-color-border)',
                }}
              >
                <Title heading={5} className='!mb-4' style={{ color: '#22c55e' }}>
                  🎯 {t('节省 Token 技巧')}
                </Title>
                <ul className='space-y-3 text-sm' style={{ color: 'var(--semi-color-text-1)' }}>
                  <li className='flex items-start gap-2'>
                    <span style={{ color: '#22c55e' }}>✓</span>
                    {t('使用「开始新任务」按钮重置对话上下文')}
                  </li>
                  <li className='flex items-start gap-2'>
                    <span style={{ color: '#22c55e' }}>✓</span>
                    {t('每完成一个小功能就重置一次任务')}
                  </li>
                  <li className='flex items-start gap-2'>
                    <span style={{ color: '#22c55e' }}>✓</span>
                    {t('避免在同一个对话中处理多个不相关任务')}
                  </li>
                  <li className='flex items-start gap-2'>
                    <span style={{ color: '#22c55e' }}>✓</span>
                    {t('使用 Claude Code 分组可享受缓存命中优惠')}
                  </li>
                </ul>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default TutorialPage;
