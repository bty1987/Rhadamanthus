package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentTypeDao;
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerSourceRecordDao;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.po.CustomerSourceRecordPO;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.customer.service.CustomerUserRuleService;
import com.fanglin.customer.vo.CustomerUserRuleVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("customerUserRuleService")
@Transactional(readOnly = true)
public class CustomerUserRuleServiceImpl implements CustomerUserRuleService {

	@Autowired
	private CustomerUserRuleDao customerUserRuleDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CustomerSourceRecordDao customerSourceRecordDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private DepartmentTypeDao departmentTypeDao;

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

		if (customerUserRule.getUser() != null && customerUserRule.getUser().getUserId() != null) {

			UserPO userPO = userDao.queryUserByUserId(customerUserRule.getUser().getUserId());

			if (userPO != null) customerUserRule.getUser().setUid(userPO.getUid());
		}

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.queryCustomerUserRule(customerUserRule.getUser().getUid());

		if (customerUserRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		CustomerUserRuleVO customerUserRuleVO = new CustomerUserRuleVO(new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO())));

		return customerUserRulePO.ptv(customerUserRuleVO);
	}

	@Override
	public List<UserBaseVO> queryCustomerUserRuleByPinyin(String pinyinName, UserVO userVO, DepartmentTypeVO departmentType, Integer company) throws FLException {

		CompanyPO companyPO = null;

		if (company != null) {
			companyPO = companyDao.get(company);
		}

		List<UserBaseVO> userBaseVOs = new ArrayList<UserBaseVO>();

		Paging paging = new Paging(0, 10);

		if (userVO == null) {
			userVO = new UserVO();
		}

		if (userVO.getStatus() == null) {
			userVO.setStatus(UserPO.STATUS_ONJOB_INT);
		}

		int dtid = 0;

		if (departmentType != null && departmentType.getName() != null && departmentType.getName().length() != 0) {
			DepartmentTypePO departmentTypePO = departmentTypeDao.queryDepartmentTypeByName(departmentType.getName());
			if (departmentTypePO != null) dtid = departmentTypePO.getDtid();
		}

		Integer did = null;

		if (userVO.getDept() != null && userVO.getDept().getDid() != null) {
			did = userVO.getDept().getDid();
		}

		Integer rid = null;

		if (userVO.getDept() != null && userVO.getDept().getFatherDept() != null && userVO.getDept().getFatherDept().getDid() != null) {
			rid = userVO.getDept().getFatherDept().getDid();
		}

		List<UserPO> userPOs = customerUserRuleDao.queryCustomerUserRuleByPinyin(paging, pinyinName, userVO.getStatus(), null, dtid, did, rid);

		for (UserPO userPO : userPOs) {
			userBaseVOs.add(new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentVO())).ptv(userPO, companyPO == null ? null : companyPO.getName()));
		}

		return userBaseVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerUserRule(CustomerUserRuleVO customerUserRuleVO, String userId, int company) throws FLException {

		UserPO user = userDao.queryUserByUserId(customerUserRuleVO.getUser().getUserId());

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.queryCustomerUserRule(user.getUid());

		if (customerUserRulePO != null) {
			throw new FLException(330080, "规则已存在");
		}

		customerUserRulePO = new CustomerUserRulePO(new UserPO(), new UserPO());

		BeanUtil.copyProperties(customerUserRuleVO, customerUserRulePO, Arrays.asList("user", "creater"));

		UserPO creater = userDao.queryUserByUserId(userId);

		customerUserRulePO.setUser(user);
		customerUserRulePO.setCreater(creater);
		customerUserRulePO.setStatus(CustomerUserRulePO.STATUS_ENABLE_INT);
		customerUserRulePO.setCompany(company);

		customerUserRulePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		customerUserRulePO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		customerUserRuleDao.save(customerUserRulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerUserRule(CustomerUserRuleVO customerUserRuleVO, String userId) throws FLException {

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.get(customerUserRuleVO.getCurid());

		if (customerUserRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		int chance = customerUserRulePO.getChance();
		int surplus = customerUserRulePO.getSurplus();

		BeanUtil.copyProperties(customerUserRuleVO, customerUserRulePO, Arrays.asList("user", "creater"));

		customerUserRuleDao.update(customerUserRulePO);

		UserPO issuer = userDao.queryUserByUserId(userId);

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(String.format("更新人员规则,归属:%s(%s),原机会数:%s,原剩余数:%s,现机会数:%s,现剩余数:%s", customerUserRulePO.getUser().getCurrentName(), customerUserRulePO.getUser().getUserId(), chance, customerUserRuleVO.getChance(), surplus, customerUserRuleVO.getSurplus()), CustomerSourceRecordPO.TYPE_USER_RULE_INT, issuer));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerUserRuleForStatus(CustomerUserRuleVO customerUserRuleVO, String userId) throws FLException {

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.get(customerUserRuleVO.getCurid());

		if (customerUserRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		short status = customerUserRulePO.getStatus();

		if (status == CustomerUserRulePO.STATUS_DISABLE_INT) {
			throw new FLException(330082, "规则不可操作");
		}

		if (customerUserRuleVO.getStatus() != CustomerUserRulePO.STATUS_ENABLE_INT && customerUserRuleVO.getStatus() < customerUserRulePO.getStatus()) {
			throw new FLException(330082, "规则不可操作");
		}

		if (customerUserRuleVO.getStatus() == CustomerUserRulePO.STATUS_USER_INVALID_INT && systemConfigDao.querySystemConfig("CUSTOMER_USER_RULE_CONTROL", customerUserRulePO.getCompany()) != null) {
			throw new FLException(330082, "规则不可操作");
		}

		if (status == CustomerUserRulePO.STATUS_ENABLE_INT) {
			customerUserRulePO.setStatus(customerUserRuleVO.getStatus());
		} else {
			customerUserRulePO.setStatus(CustomerUserRulePO.STATUS_ENABLE_INT);
		}

		customerUserRuleDao.update(customerUserRulePO);

		UserPO issuer = userDao.queryUserByUserId(userId);

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(String.format("更新人员规则,归属:%s(%s),原状态:%s,现状态:%s", customerUserRulePO.getUser().getCurrentName(), customerUserRulePO.getUser().getUserId(), status, customerUserRulePO.getStatus()), CustomerSourceRecordPO.TYPE_USER_RULE_INT, issuer));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableCustomerUserRule(int company) {

		customerUserRuleDao.disableCustomerUserRule(company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableCustomerUserRuleByCurid(CustomerUserRuleVO customerUserRuleVO) throws FLException {

		CustomerUserRulePO customerUserRulePO = customerUserRuleDao.get(customerUserRuleVO.getCurid());

		if (customerUserRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		customerUserRulePO.setStatus(CustomerUserRulePO.STATUS_DISABLE_INT);

		customerUserRuleDao.update(customerUserRulePO);
	}

}
