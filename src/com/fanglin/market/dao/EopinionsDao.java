package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.po.EopinionsPO;
import com.fanglin.utils.Paging;

public interface EopinionsDao extends Dao<EopinionsPO>{

	public List<EopinionsPO> pageEopinions(Paging paging, List<Filter> filters);

	public List<EopinionsPO> queryEopinionsByType(short type);
}