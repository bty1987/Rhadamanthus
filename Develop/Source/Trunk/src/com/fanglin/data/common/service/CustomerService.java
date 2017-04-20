/**
 * Title: CustomerService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.data.common.service;

import java.util.List;
import java.util.Set;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.utils.Paging;

public interface CustomerService {
	
	public void pageCustomer(Paging paging, List<Filter> filters);
	
	public CustomerVO queryCustomerById(CustomerVO customerVO);
	
	public List<CustomerVO> queryCustomerForName(String pinyinName);
	
	public Set<Integer> checkCustomerForPhone(CustomerVO customerVO);
	
}
