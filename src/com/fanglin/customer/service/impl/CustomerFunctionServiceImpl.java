package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.dao.CustomerFunctionDao;
import com.fanglin.customer.po.CustomerFunctionPO;
import com.fanglin.customer.service.CustomerFunctionService;
import com.fanglin.customer.vo.CustomerFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("customerFunctionService")
@Transactional(readOnly = true)
public class CustomerFunctionServiceImpl implements CustomerFunctionService {

	@Autowired
	private CustomerFunctionDao customerFunctionDao;

	@Override
	public List<CustomerFunctionVO> queryCustomerFunction(CustomerFunctionVO customerFunctionVO) {

		List<CustomerFunctionPO> customerFunctionPOs = customerFunctionDao.queryCustomerFunction(customerFunctionVO.getType());
		List<CustomerFunctionVO> customerFunctionVOs = new ArrayList<CustomerFunctionVO>();

		for (CustomerFunctionPO customerFunctionPO : customerFunctionPOs) {

			customerFunctionVO = new CustomerFunctionVO();
			BeanUtil.copyPropertie(customerFunctionPO, customerFunctionVO);

			customerFunctionVOs.add(customerFunctionVO);

		}

		return customerFunctionVOs;
	}

}
