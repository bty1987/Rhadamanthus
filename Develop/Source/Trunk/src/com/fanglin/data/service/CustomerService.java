/**
 * Title: CustomerService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.data.service;

import java.util.List;
import java.util.Set;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.vo.CustomerVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.utils.Paging;

public interface CustomerService {
	
	public void pageCustomer(Paging paging, List<FilterVO> filters);
	
	public CustomerVO queryCustomerById(CustomerVO customerVO);
	
	public List<Float> queryCustomerForAdvanceByCustomerId(CustomerVO customerVO);

	public List<CustomerVO> queryCustomerForName(String pinyinName);
	
	public Set<Integer> checkCustomerForPhone(CustomerVO customerVO);
	
	public int updateCustomerForBalance(PaymentVO paymentVO) throws FLException;
	
}
