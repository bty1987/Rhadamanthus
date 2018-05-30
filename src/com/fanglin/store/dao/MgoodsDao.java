package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.utils.Paging;

public interface MgoodsDao extends Dao<MgoodsPO> {

	public List<MgoodsPO> pageMgoods(Paging paging, List<Filter> filters);
	
	public List<MgoodsPO> queryMgoods(Long bid, Short status);

	public List<MgoodsPO> queryMgoodsBypinyinName(Paging paging, String pinyinName);
	
}
