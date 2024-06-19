package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerDeptRuleDao;
import com.fanglin.customer.po.CustomerDeptRulePO;
import com.fanglin.customer.service.CustomerDeptRuleService;
import com.fanglin.customer.vo.CustomerDeptRuleVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerDeptRuleService")
@Transactional(readOnly = true)
public class CustomerDeptRuleServiceImpl implements CustomerDeptRuleService {

	@Autowired
	private CustomerDeptRuleDao customerDeptRuleDao;

	@Override
	public void pageCustomerDeptRule(Paging paging, List<Filter> filters) throws FLException {

		List<CustomerDeptRulePO> customerDeptRulePOs = customerDeptRuleDao.pageCustomerDeptRule(paging, filters);
		List<CustomerDeptRuleVO> customerDeptRuleVOs = new ArrayList<CustomerDeptRuleVO>();

		for (CustomerDeptRulePO customerDeptRulePO : customerDeptRulePOs) {

			CustomerDeptRuleVO customerDeptRuleVO = new CustomerDeptRuleVO(new UserBaseVO());

			BeanUtil.copyProperties(customerDeptRulePO, customerDeptRuleVO, Arrays.asList("creater"));

			BeanUtil.copyProperties(customerDeptRulePO.getCreater(), customerDeptRuleVO.getCreater(), Arrays.asList("dept", "duty"));

			customerDeptRuleVOs.add(customerDeptRuleVO);
		}

		paging.setData(customerDeptRuleVOs);
	}

	@Override
	public List<CustomerDeptRuleVO> queryCustomerDeptRule(CustomerDeptRuleVO customerDeptRuleVO) {

		List<CustomerDeptRulePO> customerDeptRulePOs = customerDeptRuleDao.queryCustomerDeptRule(customerDeptRuleVO);
		List<CustomerDeptRuleVO> customerDeptRuleVOs = new ArrayList<CustomerDeptRuleVO>();

		for (CustomerDeptRulePO customerDeptRulePO : customerDeptRulePOs) {

			customerDeptRuleVO = new CustomerDeptRuleVO(new UserBaseVO());

			BeanUtil.copyProperties(customerDeptRulePO, customerDeptRuleVO, Arrays.asList("creater"));

			BeanUtil.copyProperties(customerDeptRulePO.getCreater(), customerDeptRuleVO.getCreater(), Arrays.asList("dept", "duty"));

			customerDeptRuleVOs.add(customerDeptRuleVO);
		}

		return customerDeptRuleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteCustomerDeptRule(CustomerDeptRuleVO customerDeptRule) throws FLException {

		CustomerDeptRulePO customerDeptRulePO = customerDeptRuleDao.get(customerDeptRule.getCdrid());

		customerDeptRuleDao.delete(customerDeptRulePO);

	}

}
