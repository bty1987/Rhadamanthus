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

		// 操作方判定: 规则归属人=个人侧, 其余(部门/分区/公司视角)=管理侧
		boolean owner = customerUserRulePO.getUser().getUserId().equals(userId);

		if (status == CustomerUserRulePO.STATUS_DISABLE_INT) {
			throw new FLException(330082, "规则不可操作");
		}

		// 个人侧硬锁: 5管理禁用对个人全锁(5→6只走管理侧, 个人无法操作管理禁用态)
		if (owner && status == CustomerUserRulePO.STATUS_ADVANCE_INVALID_INT) {
			throw new FLException(330122, "管理禁用状态下, 个人无法操作");
		}

		// 翻转垫: 归属人本人对已停用(1)/管理启用(6)规则发停用target=1 → 落个人启用(0): 外部小程序停/接单双钮共用一函数恒发1, 翻转仅限本人自己的规则, 管理侧对他人规则仍为显式直写不受影响; 6态翻转=个人经由启用状态接管管理启用(2026-11-11拍板)
		boolean flip = owner
				&& (status == CustomerUserRulePO.STATUS_USER_INVALID_INT || status == CustomerUserRulePO.STATUS_ADVANCE_ENABLE_INT)
				&& customerUserRuleVO.getStatus() == CustomerUserRulePO.STATUS_USER_INVALID_INT;
		short target = flip ? CustomerUserRulePO.STATUS_ENABLE_INT : customerUserRuleVO.getStatus();

		// 6管理启用: 个人仅可启用接管(显式target=0或翻转落0, 个人与管理经由启用状态过渡), 停用及其他目标仍拒
		if (owner && status == CustomerUserRulePO.STATUS_ADVANCE_ENABLE_INT && target != CustomerUserRulePO.STATUS_ENABLE_INT) {
			throw new FLException(330123, "管理启用状态下, 个人无法操作");
		}

		if (target == CustomerUserRulePO.STATUS_USER_INVALID_INT && systemConfigDao.querySystemConfig("CUSTOMER_USER_RULE_CONTROL", customerUserRulePO.getCompany()) != null) {
			throw new FLException(330082, "规则不可操作");
		}

		// target驱动直写(0/1/2/3/5/6均为显式目标状态, 由前端按钮选择口径与目标; 仅本人flip翻转例外)
		customerUserRulePO.setStatus(target);

		customerUserRuleDao.update(customerUserRulePO);

		UserPO issuer = userDao.queryUserByUserId(userId);

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(String.format("更新人员规则,归属:%s(%s),原状态:%s,现状态:%s%s", customerUserRulePO.getUser().getCurrentName(), customerUserRulePO.getUser().getUserId(), status, customerUserRulePO.getStatus(), flip ? "(个人侧翻转)" : ""), CustomerSourceRecordPO.TYPE_USER_RULE_INT, issuer));
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
