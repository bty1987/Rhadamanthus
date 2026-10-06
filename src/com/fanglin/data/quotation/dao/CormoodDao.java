package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.CormoodPO;
import com.fanglin.utils.Paging;

public interface CormoodDao extends Dao<CormoodPO> {

	public List<CormoodPO> pageCormood(Paging paging, List<Filter> filters);

	public List<CormoodPO> queryCormoodByQfid(Long qfid);

}
