package com.fanglin.log.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.CustomerLogPO;
import com.fanglin.utils.Paging;

public interface CustomerLogDao extends Dao<CustomerLogPO> {

	List<CustomerLogPO> pageCustomerLog(Paging paging, List<Filter> filters);

}
