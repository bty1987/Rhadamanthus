package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.po.McategoryPO;
import com.fanglin.utils.Paging;

public interface McategoryDao extends Dao<McategoryPO> {

	public List<McategoryPO> pageMcategory(Paging paging, List<Filter> filters);

	public List<McategoryPO> queryMcategory();

	public List<McategoryPO> queryMcategoryForShow();

}
