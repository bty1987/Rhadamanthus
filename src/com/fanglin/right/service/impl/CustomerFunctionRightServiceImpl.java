package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.dao.CustomerFunctionDao;
import com.fanglin.customer.po.CustomerFunctionPO;
import com.fanglin.customer.vo.CustomerFunctionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.dao.CustomerFunctionRightDao;
import com.fanglin.right.po.CustomerFunctionRightPO;
import com.fanglin.right.service.CustomerFunctionRightService;
import com.fanglin.right.vo.CustomerFunctionRightVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;

@Service("customerFunctionRightService")
@Transactional(readOnly = true)
public class CustomerFunctionRightServiceImpl implements CustomerFunctionRightService {

	@Autowired
	private CustomerFunctionRightDao customerFunctionRightDao;
	
	@Autowired
	private CustomerFunctionDao customerFunctionDao;
	
	@Override
	public List<CustomerFunctionRightVO> queryCustomerFunctionRight(CustomerFunctionRightVO customerFunctionRightVO, int company) {

		List<CustomerFunctionRightPO> customerFunctionRightPOs = customerFunctionRightDao.queryCustomerFunctionRight(customerFunctionRightVO.getName(), company);
		List<CustomerFunctionRightVO> customerFunctionRightVOs = new ArrayList<CustomerFunctionRightVO>();
		
		for(CustomerFunctionRightPO customerFunctionRightPO : customerFunctionRightPOs){
			
			customerFunctionRightVO = new CustomerFunctionRightVO(new CustomerFunctionVO());
			
			BeanUtil.copyPropertie(customerFunctionRightPO, customerFunctionRightVO, Arrays.asList("customerFunction"));
			BeanUtil.copyPropertie(customerFunctionRightPO.getCustomerFunction(), customerFunctionRightVO.getCustomerFunction());
			
			customerFunctionRightVOs.add(customerFunctionRightVO);
		}
		
		return customerFunctionRightVOs;
	}

	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerFunctionRight(CustomerFunctionRightVO customerFunctionRightVO, List<Long> cfids, int company) {

		customerFunctionRightDao.deleteCustomerFunctionRightByName(customerFunctionRightVO.getName(), company);

		for (Long cfid : cfids) {
			CustomerFunctionRightPO customerFunctionRightPO = new CustomerFunctionRightPO();
			CustomerFunctionPO customerFunctionPO = customerFunctionDao.get(cfid);

			customerFunctionRightPO.setName(customerFunctionRightVO.getName());
			customerFunctionRightPO.setCustomerFunction(customerFunctionPO);
			customerFunctionRightPO.setCompany(company);

			customerFunctionRightDao.save(customerFunctionRightPO);
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int syncCustomerFunctionRight(CustomerFunctionRightVO customerFunctionRightVO, List<String> companys, Integer company) throws FLException {

		List<Integer> cids = new ArrayList<Integer>();

		for (String cid : companys) {
			cids.add(CompanyServiceImpl.decode(cid));
		}

		customerFunctionRightDao.deleteCustomerFunctionRight(customerFunctionRightVO.getName(), cids);
		customerFunctionRightDao.syncCustomerFunctionRight(customerFunctionRightVO.getName(), cids, company);

		return 0;
	}

}
