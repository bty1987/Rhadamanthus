package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CustypePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustypeDao extends Dao<CustypePO> {

	public List<CustypePO> pageCustype(Paging paging, List<Filter> filters, int company);

	public CustypePO queryCustype(int company, String dgrade, String sgrade, Short atttype, Short platform);

}
