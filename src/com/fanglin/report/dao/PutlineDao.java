package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.PutlinePO;
import com.fanglin.utils.Paging;

public interface PutlineDao extends Dao<PutlinePO> {

	List<PutlinePO> pagePutline (Paging paging, List<Filter> filters);

}
