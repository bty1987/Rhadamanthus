/**
 * Title: CustomerService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.CustomerPhoneVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustomerService {
	
	public void pageCustomer(Paging paging, List<Filter> filters,Integer company);
	
	public CustomerVO queryCustomerById(CustomerVO customerVO);
	
	public List<CustomerVO> queryCustomerForName(String pinyinName,Integer company);
	
	public int checkCustomerForPhone(CustomerPhoneVO customerPhone,Integer company) throws FLException;
	
	public List<CustomerPhoneVO> queryCustomerPhoneByCid(CustomerPhoneVO customerPhoneVO)throws FLException;
	
	public int addCustomer(CustomerVO paramCustomerVO,Integer company)throws FLException;
	
	public int addCustomerPhone(CustomerPhoneVO customerPhoneVO,Integer company) throws FLException;

	public int updateCustomer(CustomerVO customerVO)throws FLException;

	public int updateCustomerPhoneForStatus(CustomerPhoneVO customerPhoneVO) throws FLException;
	
	public int updateCustomerPhoneForDstatus(CustomerPhoneVO customerPhoneVO) throws FLException;
	
	
	
}
