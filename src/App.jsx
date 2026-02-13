import React, { useState, useEffect } from 'react';
import fireData from './fire_data.json'; // 載入您的消防資料檔案
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(fireData);

  // 當搜尋文字改變時，自動篩選資料
  useEffect(() => {
    const results = fireData.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.includes(searchTerm)
    );
    setFilteredData(results);
  }, [searchTerm]);

  return (
    <div className="app-container">
      {/* 固定在頂部的搜尋列 */}
      <header className="app-header">
        <h1>消防安全管理系統</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="搜尋文號、法規關鍵字..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* 解釋令列表區 */}
      <main className="data-list">
        <p className="result-count">找到 {filteredData.length} 筆資料</p>
        
        {filteredData.map((item) => (
          <div key={item.id} className="fire-card">
            <div className="card-tag">消防解釋令</div>
            <h3>{item.title}</h3>
            <p className="card-id">文號：{item.id}</p>
            <hr />
            <div className="card-content">{item.content}</div>
          </div>
        ))}

        {/* 查無資料時的提示 */}
        {filteredData.length === 0 && (
          <div className="no-result">查無資料，請嘗試其他關鍵字。</div>
        )}
      </main>
    </div>
  );
}

export default App;