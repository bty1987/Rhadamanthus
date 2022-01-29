package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormricePO;
import com.fanglin.utils.Paging;

public interface NormriceDao extends Dao<NormricePO> {
	
	public List<NormricePO> pageNormrice(Paging paging, List<Filter> filters);
	
	public List<NormricePO> queryNormriceByQiid(Long qiid);
	
}
