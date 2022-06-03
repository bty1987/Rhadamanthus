package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.ChatingPO;
import com.fanglin.utils.Paging;

public interface ChatingDao extends Dao<ChatingPO> {

	public List<ChatingPO> pageChating(Paging paging, List<Filter> filters, int company);

	public List<ChatingPO> queryChating(int company);

}
