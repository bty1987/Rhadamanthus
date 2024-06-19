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
	public void pageCustomerUserRule(Paging paging, List<Filter> filters, int company) {

		List<CustomerUserRulePO> customerUserRuleServicePOs = customerUserRuleDao.pageCustomerUserRule(paging, filters, company);
		List<CustomerUserRuleVO> customerUserRuleServiceVOs = new ArrayList<CustomerUserRuleVO>();

		for (CustomerUserRulePO customerUserRulePO : customerUserRuleServicePOs) {

			CustomerUserRuleVO customerUserRuleVO = new CustomerUserRuleVO(new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO())));

			BeanUtil.copyProperties(customerUserRulePO, customerUserRuleVO, Arrays.asList("user", "creater"));

			UserPO user = customerUserRulePO.getUser();
			BeanUtil.copyProperties(user, customerUserRuleVO.getUser(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(user.getDuty(), customerUserRuleVO.getUser().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(user.getDept(), customerUserRuleVO.getUser().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyPropertie(user.getDept().getFatherDept(), customerUserRuleVO.getUser().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));

			UserPO creater = customerUserRulePO.getCreater();
			BeanUtil.copyProperties(creater, customerUserRuleVO.getCreater(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(creater.getDuty(), customerUserRuleVO.getCreater().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(creater.getDept(), customerUserRuleVO.getCreater().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyPropertie(creater.getDept().getFatherDept(), customerUserRuleVO.getCreater().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));

			customerUserRuleServiceVOs.add(customerUserRuleVO);
		}

		paging.setData(customerUserRuleServiceVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerUserRule(CustomerUserRuleVO customerUserRule, String userId, int company) {

		CustomerUserRulePO customerUserRulePO = new CustomerUserRulePO(new UserPO(customerUserRule.getUser().getUid()), new UserPO());

		BeanUtil.copyProperties(customerUserRule, customerUserRulePO, Arrays.asList("user", "creater"));

		UserPO creater = userDao.queryUserByUserId(userId);

		customerUserRulePO.setCreater(creater);
		customerUserRulePO.setStatus(CustomerUserRulePO.STATUS_ENABLE_INT);
		customerUserRulePO.setCompany(company);

		customerUserRuleDao.save(customerUserRulePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerUserRule(CustomerUserRuleVO customerUserRule) throws FLException {

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.get(customerUserRule.getCurid());

		BeanUtil.copyProperties(customerUserRule, customerUserRulePO, Arrays.asList("user", "creater"));

		UserPO user = userDao.get(customerUserRule.getUser().getUid());

		customerUserRulePO.setUser(user);

		customerUserRuleDao.update(customerUserRulePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerUserRuleForStatus(CustomerUserRuleVO customerUserRule) throws FLException {

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.get(customerUserRule.getCurid());

		customerUserRulePO.setStatus(customerUserRule.getStatus());

		customerUserRuleDao.update(customerUserRulePO);

	}

}
