/**
 * Title: CustomerDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.utils.Paging;

public interface CustomerDao extends Dao<CustomerPO> {

	public List<CustomerPO> pageCustomer(Paging paging, List<Filter> filters);
	
	public List<CustomerPO> queryCustomerByPinyin(String pinyinName,int limit);
	
	public CustomerPO queryCustomerByNo(String no);
	
}
