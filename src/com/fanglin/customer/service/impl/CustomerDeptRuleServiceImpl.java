package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerDeptRuleDao;
import com.fanglin.customer.po.CustomerDeptRulePO;
import com.fanglin.customer.service.CustomerDeptRuleService;
import com.fanglin.customer.vo.CustomerDeptRuleVO;
import com.fanglin.data.common.dao.DecorationBusitypeDao;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("customerDeptRuleService")
@Transactional(readOnly = true)
public class CustomerDeptRuleServiceImpl implements CustomerDeptRuleService {

	@Autowired
	private CustomerDeptRuleDao customerDeptRuleDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private DecorationBusitypeDao decorationBusitypeDao;

	@Override
	public void pageCustomerDeptRule(Paging paging, List<Filter> filters, int company) throws FLException {

		List<CustomerDeptRulePO> customerDeptRulePOs = customerDeptRuleDao.pageCustomerDeptRule(paging, filters, company);
		List<CustomerDeptRuleVO> customerDeptRuleVOs = new ArrayList<CustomerDeptRuleVO>();

		for (CustomerDeptRulePO customerDeptRulePO : customerDeptRulePOs) {

			CustomerDeptRuleVO customerDeptRuleVO = new CustomerDeptRuleVO(new UserBaseVO(), new DepartmentVO(), new DecorationBusitypeVO());

			customerDeptRuleVOs.add(customerDeptRulePO.ptv(customerDeptRuleVO));
		}

		paging.setData(customerDeptRuleVOs);
	}

	@Override
	public List<CustomerDeptRuleVO> queryCustomerDeptRuleByDid(CustomerDeptRuleVO customerDeptRuleVO) throws FLException {

		List<CustomerDeptRulePO> customerDeptRulePOs = customerDeptRuleDao.queryCustomerDeptRule(customerDeptRuleVO.getDepartment().getDid());
		List<CustomerDeptRuleVO> customerDeptRuleVOs = new ArrayList<CustomerDeptRuleVO>();

		for (CustomerDeptRulePO customerDeptRulePO : customerDeptRulePOs) {

			customerDeptRuleVO = new CustomerDeptRuleVO(new UserBaseVO(), new DepartmentVO(), new DecorationBusitypeVO());

			customerDeptRuleVOs.add(customerDeptRulePO.ptv(customerDeptRuleVO));
		}

		return customerDeptRuleVOs;
	}

	@Override
	public CustomerDeptRuleVO queryCustomerDeptRuleByDbid(CustomerDeptRuleVO customerDeptRuleVO) throws FLException {

		CustomerDeptRulePO customerDeptRulePO = customerDeptRuleDao.queryCustomerDeptRule(customerDeptRuleVO.getDepartment().getDid(), customerDeptRuleVO.getBusitype().getDbid());

		customerDeptRuleVO.setCreater(new UserBaseVO());

		if (customerDeptRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		return customerDeptRulePO.ptv(customerDeptRuleVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerDeptRule(CustomerDeptRuleVO customerDeptRuleVO, String userId, int company) throws FLException {

		CustomerDeptRulePO customerDeptRulePO = customerDeptRuleDao.queryCustomerDeptRule(customerDeptRuleVO.getDepartment().getDid(), customerDeptRuleVO.getBusitype().getDbid());

		if (customerDeptRulePO != null && customerDeptRulePO.getBusitype().getName() != null) {
			throw new FLException(330080, "规则已存在");
		}

		DepartmentPO departmentPO = departmentDao.get(customerDeptRuleVO.getDepartment().getDid());

		if (departmentPO == null) {
			throw new FLException(310001, "部门不存在");
		}

		if (departmentPO.getStatus() == DepartmentPO.STATUS_DISABLE_INT) {
			throw new FLException(310003, "状态不可操作");
		}

		short type = CustomerDeptRulePO.TYPE_DEPT_INT; // 部门

		if (departmentPO.getFatherDept() == null || departmentPO.getFatherDept().getDid() == departmentPO.getDid()) {
			type = CustomerDeptRulePO.TYPE_RULE_INT; // 分区
		}

		DecorationBusitypePO decorationBusitypePO = decorationBusitypeDao.get(customerDeptRuleVO.getBusitype().getDbid());

		UserPO creater = userDao.queryUserByUserId(userId);

		customerDeptRulePO = new CustomerDeptRulePO();

		BeanUtil.copyProperties(customerDeptRuleVO, customerDeptRulePO, Arrays.asList("creater", "department", "busitype"));

		customerDeptRulePO.setName(departmentPO.getName());

		customerDeptRulePO.setCreater(creater);
		customerDeptRulePO.setCompany(company);

		customerDeptRulePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		customerDeptRulePO.setDepartment(departmentPO);
		customerDeptRulePO.setBusitype(decorationBusitypePO);

		customerDeptRulePO.setType(type);

		customerDeptRuleDao.save(customerDeptRulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteCustomerDeptRule(CustomerDeptRuleVO customerDeptRule) throws FLException {

		CustomerDeptRulePO customerDeptRulePO = customerDeptRuleDao.get(customerDeptRule.getCdrid());

		if (customerDeptRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		customerDeptRuleDao.delete(customerDeptRulePO);
	}

}
