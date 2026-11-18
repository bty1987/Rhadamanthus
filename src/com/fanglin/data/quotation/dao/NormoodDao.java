package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.utils.Paging;

public interface NormoodDao extends Dao<NormoodPO> {
	
	public List<NormoodPO> pageNormood(Paging paging, List<Filter> filters);
	
	public List<NormoodPO> queryNormoodByQiid(Long qiid);

}
