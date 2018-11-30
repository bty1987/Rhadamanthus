package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.po.EpersonPO;
import com.fanglin.utils.Paging;

public interface EpersonDao extends Dao<EpersonPO>{

	public List<EpersonPO> pageEperson(Paging paging, List<Filter> filters);
	
	public EpersonPO queryEpersonByEuid(long euid);
	
	public List<EpersonPO> queryEpersonByPinYin(String pinyin);
	
}
