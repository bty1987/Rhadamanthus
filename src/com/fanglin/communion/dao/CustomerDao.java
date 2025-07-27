/**
 * Title: CustomerDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustomerDao extends Dao<CustomerPO> {

	public List<CustomerPO> pageCustomer(Paging paging, List<Filter> filters, Integer company);

	public List<CustomerPO> queryCustomerByPinyin(String pinyinName, int limit, Integer company);

	public List<CustomerPO> queryCustomer(String phone);

}
