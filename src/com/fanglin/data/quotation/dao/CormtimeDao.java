package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.CormtimePO;
import com.fanglin.utils.Paging;

public interface CormtimeDao extends Dao<CormtimePO> {

	public List<CormtimePO> pageCormtime(Paging paging, List<Filter> filters);

	public List<CormtimePO> queryCormtimeByQfid(Long qfid);

}
