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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 处理 JSON 文件，将所有 value 乘以指定系数并保留指定小数位数
 * @param {string} inputFile - 输入文件路径
 * @param {number} multiplier - 乘数
 * @param {number} decimals - 保留小数位数
 * @param {string} outputFile - 输出文件路径（可选，默认生成 input_updated.json）
 */
function processJsonFile(inputFile, multiplier, decimals = 2, outputFile = null) {
  // 读取输入文件
  const data = fs.readFileSync(inputFile, 'utf8');
  const jsonData = JSON.parse(data);

  // 处理数据
  const processedData = {};
  for (const [key, value] of Object.entries(jsonData)) {
    if (typeof value === 'number') {
      const multipliedValue = value * multiplier;
      // 保留指定小数位数
      processedData[key] = parseFloat(multipliedValue.toFixed(decimals));
    } else {
      processedData[key] = value;
    }
  }

  // 生成输出文件路径
  if (!outputFile) {
    const ext = path.extname(inputFile);
    const baseName = path.basename(inputFile, ext);
    const dir = path.dirname(inputFile);
    outputFile = path.join(dir, `${baseName}_updated${ext}`);
  }

  // 写入输出文件
  fs.writeFileSync(outputFile, JSON.stringify(processedData, null, 2), 'utf8');

  console.log(`处理完成！`);
  console.log(`输入文件: ${inputFile}`);
  console.log(`输出文件: ${outputFile}`);
  console.log(`乘数: ${multiplier}`);
  console.log(`保留小数位数: ${decimals}`);
  console.log(`共处理 ${Object.keys(processedData).length} 条数据`);

  return processedData;
}


processJsonFile('./origin.json', 1.2792);


export { processJsonFile };
