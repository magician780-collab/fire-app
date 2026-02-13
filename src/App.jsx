import React, { useState, useMemo } from 'react';
import { 
  AppBar, Toolbar, Typography, TextField, Card, CardContent, 
  Chip, Container, Box, Modal, IconButton, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import Fuse from 'fuse.js';

// 匯入您的資料 (請確認 fire_data.json 已經放在 src 資料夾內)
import fireData from './fire_data.json'; 

// 設定搜尋引擎邏輯
const fuse = new Fuse(fireData, {
  keys: ['主旨摘要', '完整內容', '發文字號', '分類標籤', '日期'],
  threshold: 0.3, // 模糊匹配程度
  ignoreLocation: true 
});

const App = () => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('全部');
  const [selectedItem, setSelectedItem] = useState(null);

  // 分類標籤
  const tags = ['全部', '電動車', '撒水設備', '警報設備', '防火管理', '危險物品', '檢修申報'];

  // 核心邏輯：即時篩選資料
  const filteredData = useMemo(() => {
    let results = fireData;
    if (query) {
      results = fuse.search(query).map(result => result.item);
    }
    if (selectedTag !== '全部') {
      results = results.filter(item => item['分類標籤'] && item['分類標籤'].includes(selectedTag));
    }
    return results;
  }, [query, selectedTag]);

  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', pb: 4 }}>
      {/* 頂部標題列 */}
      <AppBar position="sticky" sx={{ bgcolor: '#d32f2f' }}>
        <Toolbar>
          <ArticleIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            消防法令智庫
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 2 }}>
        {/* 搜尋框區域 */}
        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: 1, mb: 2 }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            placeholder="搜尋關鍵字 (如: 充電樁)" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          {/* 分類標籤 */}
          <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', mt: 2, pb: 0.5 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                clickable
                color={selectedTag === tag ? "error" : "default"}
                variant={selectedTag === tag ? "filled" : "outlined"}
                onClick={() => setSelectedTag(tag)}
                sx={{ mr: 1 }}
              />
            ))}
          </Box>
        </Box>

        {/* 搜尋結果統計 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 1 }}>
           <Typography variant="caption" color="text.secondary">
             共找到 {filteredData.length} 筆資料
           </Typography>
        </Box>

        {/* 資料列表 */}
        {filteredData.slice(0, 100).map((item, index) => (
          <Card key={index} sx={{ mb: 1.5, borderRadius: 2, cursor: 'pointer' }} onClick={() => setSelectedItem(item)}>
            <CardContent sx={{ pb: '16px !important' }}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Chip label={item['發文字號']} size="small" sx={{ fontSize: '0.7rem', height: 20, bgcolor: '#e3f2fd', color: '#1976d2' }} />
                <Typography variant="caption" color="text.secondary">{item['日期']}</Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.3, mb: 1 }}>
                {item['主旨摘要']?.substring(0, 50)}...
              </Typography>
              {item['分類標籤'] && (
                <Box>
                  {item['分類標籤'].split(',').map((t, i) => (
                     t && <Typography key={i} variant="caption" sx={{ color: '#666', bgcolor: '#eee', px: 0.5, py: 0.2, borderRadius: 0.5, mr: 0.5 }}>#{t}</Typography>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Container>

      {/* 詳細內容彈窗 */}
      <Modal open={!!selectedItem} onClose={() => setSelectedItem(null)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '90%', maxWidth: 500, maxHeight: '85vh', bgcolor: 'background.paper',
          boxShadow: 24, borderRadius: 3, outline: 'none', display: 'flex', flexDirection: 'column'
        }}>
          {selectedItem && (
            <>
              <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">函釋詳情</Typography>
                <IconButton onClick={() => setSelectedItem(null)}><CloseIcon /></IconButton>
              </Box>
              <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1 }}>
                <Typography variant="caption" display="block" color="primary" gutterBottom>
                  {selectedItem['發文字號']} | {selectedItem['日期']}
                </Typography>
                <Box sx={{ bgcolor: '#fff3e0', p: 1.5, borderRadius: 2, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">主旨：</Typography>
                  <Typography variant="body2">{selectedItem['主旨摘要']}</Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>完整內容：</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: '#333', lineHeight: 1.6 }}>
                  {selectedItem['完整內容']}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default App;