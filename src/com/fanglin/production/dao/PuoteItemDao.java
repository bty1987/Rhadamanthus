package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.PuoteItemPO;
import com.fanglin.utils.Paging;

public interface PuoteItemDao extends Dao<PuoteItemPO> {
	
	public List<PuoteItemPO> pageQuoteItem(Paging paging,List<Filter> filter);
	
	public List<PuoteItemPO> queryQuoteItemByPinyin(Paging paging, String pinyin, Integer company);
}
