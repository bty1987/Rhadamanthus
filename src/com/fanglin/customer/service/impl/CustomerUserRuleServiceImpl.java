package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.customer.service.CustomerUserRuleService;
import com.fanglin.customer.vo.CustomerUserRuleVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerUserRuleService")
@Transactional(readOnly = true)
public class CustomerUserRuleServiceImpl implements CustomerUserRuleService {

	@Autowired
	private CustomerUserRuleDao customerUserRuleDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageCustomerUserRule(Paging paging, List<Filter> filters, CustomerUserRuleVO customerUserRule, int company) {

		if (customerUserRule.getUser() != null && customerUserRule.getUser().getDept() != null && customerUserRule.getUser().getDept().getFatherDept() != null && customerUserRule.getUser().getDept().getFatherDept().getNo() != null) {
			filters.add(new Filter("user.dept.fatherDept", customerUserRule.getUser().getDept().getFatherDept().getNo(), "eq"));
		}

		if (customerUserRule.getUser() != null && customerUserRule.getUser().getDept() != null && customerUserRule.getUser().getDept().getNo() != null) {
			filters.add(new Filter("user.dept", customerUserRule.getUser().getDept().getNo(), "eq"));
		}

		List<CustomerUserRulePO> customerUserRuleServicePOs = customerUserRuleDao.pageCustomerUserRule(paging, filters, company);
		List<CustomerUserRuleVO> customerUserRuleServiceVOs = new ArrayList<CustomerUserRuleVO>();

		for (CustomerUserRulePO customerUserRulePO : customerUserRuleServicePOs) {

			CustomerUserRuleVO customerUserRuleVO = new CustomerUserRuleVO(new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO())));

			customerUserRuleServiceVOs.add(customerUserRulePO.ptv(customerUserRuleVO));
		}

		paging.setData(customerUserRuleServiceVOs);
	}

	@Override
	public CustomerUserRuleVO queryCustomerUserRule(CustomerUserRuleVO customerUserRule) throws FLException {

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.queryCustomerUserRule(customerUserRule.getUser().getUid());

		if (customerUserRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		CustomerUserRuleVO customerUserRuleVO = new CustomerUserRuleVO(new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO())));

		return customerUserRulePO.ptv(customerUserRuleVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerUserRule(CustomerUserRuleVO customerUserRule, String userId, int company) throws FLException {

		UserPO user = userDao.queryUserByUserId(customerUserRule.getUser().getUserId());

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.queryCustomerUserRule(user.getUid());

		if (customerUserRulePO != null) {
			throw new FLException(330080, "规则已存在");
		}

		customerUserRulePO = new CustomerUserRulePO(new UserPO(), new UserPO());

		BeanUtil.copyProperties(customerUserRule, customerUserRulePO, Arrays.asList("user", "creater"));

		UserPO creater = userDao.queryUserByUserId(userId);

		customerUserRulePO.setUser(user);
		customerUserRulePO.setCreater(creater);
		customerUserRulePO.setStatus(CustomerUserRulePO.STATUS_ENABLE_INT);
		customerUserRulePO.setCompany(company);

		customerUserRuleDao.save(customerUserRulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerUserRule(CustomerUserRuleVO customerUserRule) throws FLException {

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.get(customerUserRule.getCurid());

		if (customerUserRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		BeanUtil.copyProperties(customerUserRule, customerUserRulePO, Arrays.asList("user", "creater"));

		customerUserRuleDao.update(customerUserRulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerUserRuleForStatus(CustomerUserRuleVO customerUserRule) throws FLException {

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.get(customerUserRule.getCurid());

		if (customerUserRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		if (customerUserRulePO.getStatus() == CustomerUserRulePO.STATUS_DISABLE_INT) {
			throw new FLException(330081, "无匹配规则");
		}

		if (customerUserRulePO.getStatus() == CustomerUserRulePO.STATUS_ENABLE_INT && customerUserRule.getStatus() < customerUserRulePO.getStatus()) {
			throw new FLException(330081, "无匹配规则");
		}

		if (customerUserRulePO.getStatus() == CustomerUserRulePO.STATUS_ENABLE_INT) {
			customerUserRulePO.setStatus(customerUserRule.getStatus());
		} else {
			customerUserRulePO.setStatus(CustomerUserRulePO.STATUS_ENABLE_INT);
		}

		customerUserRuleDao.update(customerUserRulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableCustomerUserRule(int company) {

		customerUserRuleDao.disableCustomerUserRule(company);
	}

}
