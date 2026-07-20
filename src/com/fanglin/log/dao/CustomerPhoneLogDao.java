package com.fanglin.log.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.CustomerPhoneLogPO;
import com.fanglin.utils.Paging;

public interface CustomerPhoneLogDao extends Dao<CustomerPhoneLogPO> {

	List<CustomerPhoneLogPO> pageCustomerPhoneLog(Paging paging, List<Filter> filters);

}
