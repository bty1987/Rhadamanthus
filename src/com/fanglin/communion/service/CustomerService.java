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

	public void pageCustomer(Paging paging, List<Filter> filters, CustomerVO customerVO, Integer company);

	public CustomerVO queryCustomerById(CustomerVO customerVO) throws FLException;

	public List<CustomerVO> queryCustomerForName(String pinyinName, Integer company);

	public CustomerVO queryCustomerForPhone(CustomerPhoneVO customerPhoneVO, String userId) throws FLException;

	public List<CustomerPhoneVO> queryCustomerPhoneByCid(CustomerPhoneVO customerPhoneVO) throws FLException;

	public int checkCustomerForPhone(CustomerPhoneVO customerPhone, Integer company) throws FLException;

	public int addCustomer(CustomerVO paramCustomerVO, Integer company) throws FLException;

	public int existCustomer(CustomerVO customerVO, Integer company);

	public int addCustomerPhone(CustomerPhoneVO customerPhoneVO, Integer company) throws FLException;

	public int updateCustomer(CustomerVO customerVO) throws FLException;

	public int updateCustomerForBase(CustomerVO customerVO) throws FLException;

	public int updateCustomerPhoneForStatus(CustomerPhoneVO customerPhoneVO) throws FLException;

	public int updateCustomerPhoneForDefault(CustomerPhoneVO customerPhoneVO) throws FLException;

	public int registCustomer(CustomerVO customerVO) throws FLException;

	public int resetCustomer(CustomerVO customerVO) throws FLException;

	public String authCustomer(CustomerVO customerVO) throws FLException;

	public int confirmCustomer(CustomerVO customerVO) throws FLException;

	public int signateCustomer(CustomerVO customerVO, String imgbase) throws FLException;


}
