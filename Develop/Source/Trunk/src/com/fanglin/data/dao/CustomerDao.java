/**
 * Title: CustomerDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.data.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.utils.Paging;

public interface CustomerDao extends Dao<CustomerPO> {

	public List<CustomerPO> pageCustomer(Paging paging, List<FilterVO> filters);
	
	public List<CustomerPO> queryCustomerForNameByPinyin(Paging paging, String pinyinName);
	
	public CustomerPO queryCustomerByCustomerId(String customerId);
	
	public List<CustomerPO> queryCustomerByPhone(String phone);
	
	public CustomerPO queryCustomerFromCommunionById(int cId);
	
	public int merge(CustomerPO customerPO);
	
}
