/**
 * Title: CustomerServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.common.service.CustomerService;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerService")
@Transactional(readOnly = true)
public class CustomerServiceImpl implements CustomerService {
	
	@Autowired
	private CustomerDao customerDao;
	
	@Override
	public void pageCustomer(Paging paging, List<Filter> filters){

		List<CustomerPO> customerPOs = customerDao.pageCustomer(paging, filters);
		List<CustomerVO> customerVOs = new ArrayList<CustomerVO>();

		for(CustomerPO customerPO : customerPOs){
			CustomerVO customerVO = new CustomerVO();
			BeanUtil.copyProperties(customerPO, customerVO);
			
			customerVOs.add(customerVO);
		}

		paging.setData(customerVOs);
	}
	
	@Override
	public CustomerVO queryCustomerById(CustomerVO customerVO){

		CustomerPO customerPO = customerDao.get(customerVO.getId());
		
		if(customerPO != null){
			customerVO = new CustomerVO();
			
			BeanUtil.copyProperties(customerPO, customerVO);
		}

		return customerVO;
	}
	
	@Override
	public List<CustomerVO> queryCustomerForName(String pinyinName){

		Paging paging = new Paging(0, 50);

		List<CustomerVO> customerVOs = new ArrayList<CustomerVO>();
		List<CustomerPO> customerPOs = customerDao.queryCustomerForNameByPinyin(paging, pinyinName);
		
		for(CustomerPO customerPO: customerPOs){
			CustomerVO customerVO = new CustomerVO();
			BeanUtil.copyProperties(customerPO, customerVO);
			
			customerVOs.add(customerVO);
		}
		return customerVOs;
	}
	
	@Override
	public Set<Integer> checkCustomerForPhone(CustomerVO customerVO){
		Set<Integer> customerIds = new HashSet<Integer>();
		List<CustomerPO> customerPOs = new ArrayList<CustomerPO>();
		
		String[] array = customerVO.getPhone().split(",");
		Set<String> set = new HashSet<String>();
		
		set.addAll(Arrays.asList(array));
		
		for(String phone: set){
			customerPOs = customerDao.queryCustomerByPhone(phone);
			for(CustomerPO customerPO: customerPOs){
				customerIds.add(customerPO.getId());
			}
		}
		
		return customerIds;
	}

}
