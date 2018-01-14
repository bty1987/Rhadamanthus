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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerPhoneVO;
import com.fanglin.data.common.vo.CustomerVO;

import com.fanglin.utils.Paging;

public interface CustomerService {
	
	public void pageCustomer(Paging paging, List<Filter> filters);
	
	public CustomerVO queryCustomerById(CustomerVO customerVO);
	
	public List<CustomerVO> queryCustomerForName(String pinyinName);
	
	public List<CustomerVO> checkCustomerForPhone(CustomerPhoneVO customerPhone) throws FLException;
	
	public List<CustomerPhoneVO> queryCustomerPhoneByCid(CustomerPhoneVO customerPhoneVO)throws FLException;
	
	public int addCustomer(CustomerVO paramCustomerVO)throws FLException;
	
	public int addCustomerPhone(CustomerPhoneVO customerPhoneVO) throws FLException;

	public int updateCustomer(CustomerVO customerVO)throws FLException;

	public int updateCustomerPhoneForStatus(CustomerPhoneVO customerPhoneVO) throws FLException;
	
}
