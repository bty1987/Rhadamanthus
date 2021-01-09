package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.dao.CustomerOriginFunctionDao;
import com.fanglin.customer.po.CustomerOriginFunctionPO;
import com.fanglin.customer.service.CustomerOriginFunctionService;
import com.fanglin.customer.vo.CustomerOriginFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("customerOriginFunctionService")
@Transactional(readOnly = true)
public class CustomerOriginFunctionServiceImpl implements CustomerOriginFunctionService {
	
	@Autowired
	private CustomerOriginFunctionDao customerOriginFunctionDao;

	@Override
	public List<CustomerOriginFunctionVO> queryCustomerOriginFunction(CustomerOriginFunctionVO customerOriginFunctionVO) {
		
		List<CustomerOriginFunctionPO> customerOriginFunctionPOs = customerOriginFunctionDao.queryCustomerOriginFunction(customerOriginFunctionVO.getType());
		List<CustomerOriginFunctionVO> customerOriginFunctionVOs = new ArrayList<CustomerOriginFunctionVO>();
		
		for(CustomerOriginFunctionPO customerOriginFunctionPO : customerOriginFunctionPOs){
			
			customerOriginFunctionVO = new CustomerOriginFunctionVO();
			BeanUtil.copyPropertie(customerOriginFunctionPO, customerOriginFunctionVO);
			
			customerOriginFunctionVOs.add(customerOriginFunctionVO);
			
		}
		
		return customerOriginFunctionVOs;
	}

}
