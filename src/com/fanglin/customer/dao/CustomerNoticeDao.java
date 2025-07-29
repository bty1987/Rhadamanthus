package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerNoticePO;
import com.fanglin.utils.Paging;

public interface CustomerNoticeDao extends Dao<CustomerNoticePO> {

	public List<CustomerNoticePO> pageCustomerNotice(Paging paging, List<Filter> filters);

}
