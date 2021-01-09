package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.dao.CustomerOriginFunctionDao;
import com.fanglin.customer.po.CustomerOriginFunctionPO;
import com.fanglin.customer.vo.CustomerOriginFunctionVO;
import com.fanglin.right.dao.CustomerOriginFunctionRightDao;
import com.fanglin.right.po.CustomerOriginFunctionRightPO;
import com.fanglin.right.service.CustomerOriginFunctionRightService;
import com.fanglin.right.vo.CustomerOriginFunctionRightVO;
import com.fanglin.utils.BeanUtil;

@Service("customerOriginFunctionRightService")
@Transactional(readOnly = true)
public class CustomerOriginFunctionRightServiceImpl implements CustomerOriginFunctionRightService {

	@Autowired
	private CustomerOriginFunctionRightDao customerOriginFunctionRightDao;
	
	@Autowired
	private CustomerOriginFunctionDao customerOriginFunctionDao;
	
	@Override
	public List<CustomerOriginFunctionRightVO> queryCustomerOriginFunctionRight(CustomerOriginFunctionRightVO customerOriginFunctionRightVO) {
		
		List<CustomerOriginFunctionRightPO> customerOriginFunctionRightPOs = customerOriginFunctionRightDao.queryCustomerOriginFunctionRight(customerOriginFunctionRightVO.getName());
		List<CustomerOriginFunctionRightVO> customerOriginFunctionRightVOs = new ArrayList<CustomerOriginFunctionRightVO>();
		
		for(CustomerOriginFunctionRightPO customerOriginFunctionRightPO : customerOriginFunctionRightPOs){
			
			customerOriginFunctionRightVO = new CustomerOriginFunctionRightVO(new CustomerOriginFunctionVO());
			
			BeanUtil.copyPropertie(customerOriginFunctionRightPO, customerOriginFunctionRightVO, Arrays.asList("customerOriginFunction"));
			BeanUtil.copyPropertie(customerOriginFunctionRightPO.getCustomerOriginFunction(), customerOriginFunctionRightVO.getCustomerOriginFunction());
			
			customerOriginFunctionRightVOs.add(customerOriginFunctionRightVO);
		}
		
		return customerOriginFunctionRightVOs;
	}

	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerOriginFunctionRight(CustomerOriginFunctionRightVO customerOriginFunctionRightVO, List<Long> cfids, int company) {
		
		customerOriginFunctionRightDao.deleteCustomerOriginFunctionRightByName(customerOriginFunctionRightVO.getName());
		
		for (Long cfid : cfids) {
			CustomerOriginFunctionRightPO customerOriginFunctionRightPO = new CustomerOriginFunctionRightPO();
			CustomerOriginFunctionPO customerOriginFunctionPO = customerOriginFunctionDao.get(cfid);
			
			customerOriginFunctionRightPO.setName(customerOriginFunctionRightVO.getName());
			customerOriginFunctionRightPO.setCustomerOriginFunction(customerOriginFunctionPO);
			customerOriginFunctionRightPO.setCompany(company);
			
			customerOriginFunctionRightDao.save(customerOriginFunctionRightPO);
		}
		
	}

}
