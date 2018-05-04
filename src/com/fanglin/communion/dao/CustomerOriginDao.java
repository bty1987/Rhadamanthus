package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CustomerOriginPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustomerOriginDao extends Dao<CustomerOriginPO> {

	public List<CustomerOriginPO> pageCustomerOrigin(Paging paging, List<Filter> filters, List<Integer> dids);

}
