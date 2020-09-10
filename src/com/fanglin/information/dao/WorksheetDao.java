package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.WorksheetPO;
import com.fanglin.utils.Paging;

public interface WorksheetDao extends Dao<WorksheetPO> {

	public List<WorksheetPO> pageWorksheet(Paging paging, List<Filter> filters, int company);

}
