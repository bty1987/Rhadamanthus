package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerDeptRuleDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerDeptRulePO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.customer.service.CustomerSourceService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("customerSourceService")
@Transactional(readOnly = true)
public class CustomerSourceServiceImpl implements CustomerSourceService {

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerDeptRuleDao customerDeptRuleDao;

	@Autowired
	private CustomerUserRuleDao customerUserRuleDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private VillageDao villageDao;

	@Autowired
	private HouseDao houseDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void pageCustomerSource(Paging paging, List<Filter> filters, CustomerSourceVO customerSource) {

		if (customerSource.getCreater() != null && customerSource.getCreater().getUserId() != null) {
			filters.add(new Filter("user.userId", customerSource.getCreater().getUserId(), "eq"));
		}

		if (customerSource.getCreater() != null && customerSource.getCreater().getDept() != null && customerSource.getCreater().getDept().getFatherDept() != null && customerSource.getCreater().getDept().getFatherDept().getNo() != null) {
			filters.add(new Filter("user.dept.fatherDept", customerSource.getCreater().getDept().getFatherDept().getNo(), "eq"));
		}

		if (customerSource.getCreater() != null && customerSource.getCreater().getDept() != null && customerSource.getCreater().getDept().getNo() != null) {
			filters.add(new Filter("user.dept", customerSource.getCreater().getDept().getNo(), "eq"));
		}

		List<CustomerSourcePO> customerSourcePOs = customerSourceDao.pageCustomerSource(paging, filters);
		List<CustomerSourceVO> customerSourceVOs = new ArrayList<CustomerSourceVO>();

		for (CustomerSourcePO customerSourcePO : customerSourcePOs) {

			customerSource = new CustomerSourceVO(new VillageVO(new CityProperVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new CustomerVO(), new HouseVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())));

			customerSourceVOs.add(customerSourcePO.ptv(customerSource));
		}

		paging.setData(customerSourceVOs);
	}

	@Override
	public CustomerSourceVO queryCustomerSource(CustomerSourceVO customerSource) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSource.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		CustomerSourceVO customerSourceVO = new CustomerSourceVO(new VillageVO(new CityProperVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new CustomerVO(), new HouseVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())));

		return customerSourcePO.ptv(customerSourceVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerSource(CustomerSourceVO customerSourceVO, String userId) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.queryCustomerSource(customerSourceVO.getPhone());

		if (customerSourcePO != null && DateUtil.diffDay(customerSourcePO.getCreateTime(), DateUtil.getDateToTimestamp(new Date())) < 1) {
			throw new FLException(330073, "客户资源保护中");
		}

		customerSourcePO = new CustomerSourcePO();

		CustomerPO customerPO = null;

		if (customerSourceVO.getCustomer() != null) {
			customerPO = customerDao.get(customerSourceVO.getCustomer().getCid());
		}

		if (customerPO != null) {
			customerSourcePO.setCustomer(customerPO);
			customerSourcePO.setPhone(customerSourceVO.getPhone());
		}

		VillagePO villagePO = null;

		if (customerSourceVO.getVillage() != null) {
			villagePO = villageDao.get(customerSourceVO.getVillage().getVid());
		}

		if (villagePO != null) {
			customerSourcePO.setVillage(villagePO);
		}

		HousePO housePO = null;

		if (customerSourceVO.getHouse() != null) {
			housePO = houseDao.get(customerSourceVO.getHouse().getHid());
		}

		if (housePO != null) {
			customerSourcePO.setHouse(housePO);
			customerSourcePO.setVillage(housePO.getVillage());
			customerSourcePO.setHouseNumber(housePO.getHouseNumber());
		}

		BeanUtil.copyProperties(customerSourceVO, customerSourcePO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman"));

		UserPO userPO = userDao.queryUserByUserId(userId);

		customerSourcePO.setCreater(userPO);
		customerSourcePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		customerSourcePO.setStatus(CustomerSourcePO.STATUS_INIT_INT);

		customerSourceDao.save(customerSourcePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerSource(CustomerSourceVO customerSourceVO) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		if (!Arrays.asList(CustomerSourcePO.STATUS_INIT_INT, CustomerSourcePO.STATUS_APPROVE_ONE_INT).contains(customerSourcePO.getStatus())) {
			throw new FLException(330074, "客户资源不可操作");
		}

		CustomerPO customerPO = null;

		if (customerSourceVO.getCustomer() != null) {
			customerPO = customerDao.get(customerSourceVO.getCustomer().getCid());
		}

		if (customerPO != null) {
			customerSourcePO.setCustomer(customerPO);
			customerSourcePO.setPhone(customerSourceVO.getPhone());
		}

		VillagePO villagePO = null;

		if (customerSourceVO.getVillage() != null) {
			villagePO = villageDao.get(customerSourceVO.getVillage().getVid());
		}

		if (villagePO != null) {
			customerSourcePO.setVillage(villagePO);
		}

		HousePO housePO = null;

		if (customerSourceVO.getHouse() != null) {
			housePO = houseDao.get(customerSourceVO.getHouse().getHid());
		}

		if (housePO != null) {
			customerSourcePO.setHouse(housePO);
			customerSourcePO.setVillage(housePO.getVillage());
			customerSourcePO.setHouseNumber(housePO.getHouseNumber());
		}

		BeanUtil.copyProperties(customerSourceVO, customerSourcePO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman"));

		customerSourceDao.save(customerSourcePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerSourceForStatus(CustomerSourceVO customerSourceVO) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		customerSourcePO.setStatus(customerSourceVO.getStatus());

		customerSourceDao.update(customerSourcePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void issueCustomerSource(CustomerSourceVO customerSourceVO, CustomerChanceVO customerChanceVO, String userId, int company) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		if (Arrays.asList(CustomerSourcePO.STATUS_DISABLE_INT, CustomerSourcePO.STATUS_TRAN_INT).contains(customerSourcePO.getStatus())) {
			throw new FLException(330074, "客户资源不可操作");
		}

		short atttype = CustomerChancePO.ATTTYPE_USER_INT;

		DecorationBusitypePO busitype = null;

		UserPO issuer = userDao.queryUserByUserId(userId);

		CustomerChancePO customerChancePO = new CustomerChancePO();

		customerChancePO.setSource(customerSourcePO);
		customerChancePO.setIssuer(issuer);
		customerChancePO.setIssueTime(DateUtil.getDateToTimestamp(new Date()));
		customerChancePO.setStatus(CustomerChancePO.STATUS_INIT_INT);

		CustomerDeptRulePO customerDeptRulePO = customerDeptRuleDao.queryCustomerDeptRule(customerSourcePO.getCreater().getDept().getDid());

		if (customerDeptRulePO == null) {

			SystemConfigPO rule = systemConfigDao.querySystemConfig("CUSTOMER_ISSUE_RULE_INT", company);

			if (rule != null) {
				atttype = Short.parseShort(rule.value(String.valueOf(atttype)));
			}
		}

		if (customerDeptRulePO != null) {
			busitype = customerDeptRulePO.getBusitype();
			atttype = customerDeptRulePO.getAtttype();
		}

		int area = customerSourcePO.getInnerArea();

		if (atttype == CustomerChancePO.ATTTYPE_AUTO_INT) {

			if (customerUserRuleDao.existCustomerUserRule(company, area) == 0) {
				throw new FLException(330081, "无匹配规则");
			}

			if (customerUserRuleDao.countCustomerUserRule(company, area) == 0) {
				customerUserRuleDao.pollingCustomerUserRule(company);
			}

			CustomerUserRulePO customerUserRulePO = customerUserRuleDao.pullCustomerUserRule(company, area);

			if (customerUserRulePO == null) {
				throw new FLException(330081, "无匹配规则");
			}

			customerUserRulePO.setSurplus(customerUserRulePO.getSurplus() - 1000);

			customerUserRuleDao.update(customerUserRulePO);

			UserPO belonger = customerUserRulePO.getUser();

			if (customerChanceDao.queryCustomerChance(customerSourcePO.getCsid(), belonger.getCompany()) != null) {
				throw new FLException(330076, "客户机会已存在");
			}

			customerChancePO.setBelonger(belonger);
			customerChancePO.setDepartment(belonger.getDept());
			customerChancePO.setRegion(belonger.getDept().getFatherDept());

			if (belonger.getDept().getFatherDept() == null) {
				customerChancePO.setRegion(belonger.getDept());
			}

			customerChancePO.setStatus(CustomerChancePO.STATUS_ISSUE_INT);
			customerChancePO.setBusitype(busitype);

			customerChanceDao.save(customerChancePO);

			return;
		}

		if (customerChanceVO.getRegion() != null && atttype == CustomerChancePO.ATTTYPE_REGION_INT) {

			DepartmentPO region = departmentDao.get(customerChanceVO.getRegion().getDid());

			if (region == null) {
				throw new FLException(310001, "部门不存在");
			}

			customerChancePO.setRegion(region);

			customerChanceDao.save(customerChancePO);

			return;
		}

		if (customerChanceVO.getDepartment() != null && atttype == CustomerChancePO.ATTTYPE_DEPT_INT) {

			DepartmentPO dept = departmentDao.get(customerChanceVO.getDepartment().getDid());

			if (dept == null) {
				throw new FLException(310001, "部门不存在");
			}

			customerChancePO.setDepartment(dept);
			customerChancePO.setRegion(dept.getFatherDept());

			if (dept.getFatherDept() == null) {
				customerChancePO.setRegion(dept);
			}

			customerChanceDao.save(customerChancePO);

			return;
		}

		if (customerChanceVO.getBelonger() != null && atttype == CustomerChancePO.ATTTYPE_USER_INT) {

			UserPO belonger = userDao.queryUserByUserId(customerChanceVO.getBelonger().getUserId());

			if (belonger == null) {
				throw new FLException(190005, "人员不存在");
			}

			if (customerChanceDao.queryCustomerChance(customerSourcePO.getCsid(), belonger.getCompany()) != null) {
				throw new FLException(330076, "客户机会已存在");
			}

			customerChancePO.setBelonger(belonger);
			customerChancePO.setDepartment(belonger.getDept());
			customerChancePO.setRegion(belonger.getDept().getFatherDept());

			if (belonger.getDept().getFatherDept() == null) {
				customerChancePO.setRegion(belonger.getDept());
			}

			customerChanceDao.save(customerChancePO);

			return;
		}
	}

}
