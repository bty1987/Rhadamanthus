package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerProtectRuleDao;
import com.fanglin.customer.po.CustomerProtectRulePO;
import com.fanglin.customer.service.CustomerProtectRuleService;
import com.fanglin.customer.vo.CustomerProtectRuleVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerProtectRuleService")
@Transactional(readOnly = true)
public class CustomerProtectRuleServiceImpl implements CustomerProtectRuleService {

	@Autowired
	private CustomerProtectRuleDao customerProtectRuleDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageCustomerProtectRule(Paging paging, List<Filter> filters, int company) {

		List<CustomerProtectRulePO> customerProtectRulePOs = customerProtectRuleDao.pageCustomerProtectRule(paging, filters, company);
		List<CustomerProtectRuleVO> customerProtectRuleVOs = new ArrayList<CustomerProtectRuleVO>();

		for (CustomerProtectRulePO customerProtectRulePO : customerProtectRulePOs) {

			CustomerProtectRuleVO customerProtectRuleVO = new CustomerProtectRuleVO(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()));

			customerProtectRuleVOs.add(customerProtectRulePO.ptv(customerProtectRuleVO));

		}

		paging.setData(customerProtectRuleVOs);

	}

	@Override
	public List<CustomerProtectRuleVO> queryCustomerProtectRule(CustomerProtectRuleVO customerProtectRule) {

		List<CustomerProtectRulePO> customerProtectRulePOs = customerProtectRuleDao.queryCustomerProtectRule(customerProtectRule.getType(), customerProtectRule.getValue(), customerProtectRule.getDays());
		List<CustomerProtectRuleVO> customerProtectRuleVOs = new ArrayList<CustomerProtectRuleVO>();

		for (CustomerProtectRulePO customerProtectRulePO : customerProtectRulePOs) {

			CustomerProtectRuleVO customerProtectRuleVO = new CustomerProtectRuleVO(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()));

			customerProtectRuleVOs.add(customerProtectRulePO.ptv(customerProtectRuleVO));

		}

		return customerProtectRuleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerProtectRule(CustomerProtectRuleVO customerProtectRuleVO, String userId, int company) throws FLException {

		CustomerProtectRulePO customerProtectRulePO = customerProtectRuleDao.queryCustomerProtectRule(customerProtectRuleVO.getType(), customerProtectRuleVO.getValue());

		if (customerProtectRulePO != null) {
			throw new FLException(330080, "规则已存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		customerProtectRulePO = new CustomerProtectRulePO(creater);

		BeanUtil.copyProperties(customerProtectRuleVO, customerProtectRulePO, Arrays.asList("creater"));

		customerProtectRulePO.setCompany(company);

		customerProtectRuleDao.save(customerProtectRulePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteCustomerProtectRule(CustomerProtectRuleVO customerProtectRule) throws FLException {

		CustomerProtectRulePO customerProtectRulePO = customerProtectRuleDao.get(customerProtectRule.getCprid());

		if (customerProtectRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		customerProtectRuleDao.delete(customerProtectRulePO);

	}

}
