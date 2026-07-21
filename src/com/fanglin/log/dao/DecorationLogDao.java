package com.fanglin.log.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.DecorationLogPO;
import com.fanglin.utils.Paging;

public interface DecorationLogDao extends Dao<DecorationLogPO> {

	List<DecorationLogPO> pageDecorationLog(Paging paging, List<Filter> filters);

}
