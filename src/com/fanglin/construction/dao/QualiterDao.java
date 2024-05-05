package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.QualiterPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface QualiterDao extends Dao<QualiterPO> {

	public List<QualiterPO> pageConstructionForQualiter(Paging paging, List<Filter> filters) throws FLException;

	public List<QualiterPO> queryQualiter(String orderId);

}
