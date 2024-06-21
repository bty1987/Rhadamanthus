package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.DepartmentPO;
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
	private VillageDao villageDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void pageCustomerSource(Paging paging, List<Filter> filters) {

		List<CustomerSourcePO> customerSourcePOs = customerSourceDao.pageCustomerSource(paging, filters);
		List<CustomerSourceVO> customerSourceVOs = new ArrayList<CustomerSourceVO>();

		for (CustomerSourcePO customerSourcePO : customerSourcePOs) {
			customerSourceVOs.add(customerSourcePOToVO(customerSourcePO));
		}

		paging.setData(customerSourceVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerSource(CustomerSourceVO customerSourceVO, String userId) {

		CustomerSourcePO customerSourcePO = new CustomerSourcePO();

		BeanUtil.copyProperties(customerSourceVO, customerSourcePO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman"));

		UserPO userPO = userDao.queryUserByUserId(userId);

		customerSourcePO.setCreater(userPO);
		customerSourcePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		customerSourcePO.setStatus(CustomerSourcePO.STATUS_INIT_INT);

		if (customerSourceVO.getDesigner() != null && customerSourceVO.getDesigner().getUserId() != null) {
			customerSourcePO.setDesigner(userDao.queryUserByUserId(customerSourceVO.getDesigner().getUserId()));
		}

		if (customerSourceVO.getSalesman() != null && customerSourceVO.getSalesman().getUserId() != null) {
			customerSourcePO.setSalesman(userDao.queryUserByUserId(customerSourceVO.getSalesman().getUserId()));
		}

		VillagePO villagePO = villageDao.get(customerSourceVO.getVillage().getNo());

		customerSourcePO.setVillage(villagePO);

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
	public void issueCustomerChance(CustomerSourceVO customerSourceVO, CustomerChanceVO customerChanceVO, String userId, int company) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		short atttype = 1; // 默认处理方式为手动配置设计师

		DecorationBusitypePO busitype = null;

		UserPO issuer = userDao.queryUserByUserId(userId);

		CustomerChancePO customerChancePO = new CustomerChancePO(new CustomerSourcePO(), new DecorationBusitypePO(), new UserPO(), new UserPO(), new UserPO(), new DepartmentPO(), new DepartmentPO());

		customerChancePO.setSource(customerSourcePO);
		customerChancePO.setIssuer(issuer);
		customerChancePO.setIssueTime(DateUtil.getDateToTimestamp(new Date()));
		customerChancePO.setStatus((short) 0);

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

		if (atttype == 0) {

			if (customerUserRuleDao.countCustomerUserRule(company) == 0) {
				customerUserRuleDao.pollingCustomerUserRule(company);
			}

			CustomerUserRulePO customerUserRulePO = customerUserRuleDao.pullCustomerUserRule(company);

			if (customerUserRulePO == null) {
				throw new FLException(330081, "无匹配规则");
			}

			customerUserRulePO.setSurplus(customerUserRulePO.getSurplus() - 1);

			customerUserRuleDao.update(customerUserRulePO);

			UserPO belonger = customerUserRulePO.getUser();

			customerChancePO.setBelonger(belonger);
			customerChancePO.setDepartment(belonger.getDept());
			customerChancePO.setRegion(belonger.getDept().getFatherDept());

			customerChancePO.setStatus((short) 1);
			customerChancePO.setBusitype(busitype);

			customerChanceDao.save(customerChancePO);

			return;
		}

		if (customerChanceVO.getRegion() != null && atttype == 3) {

			DepartmentPO region = departmentDao.get(customerChanceVO.getRegion().getDid());

			if (region != null) {
				customerChancePO.setRegion(region);

				customerChanceDao.save(customerChancePO);

				return;
			}
		}

		if (customerChanceVO.getDepartment() != null && atttype == 2) {

			DepartmentPO dept = departmentDao.get(customerChanceVO.getDepartment().getDid());

			if (dept != null) {
				customerChancePO.setDepartment(dept);
				customerChancePO.setRegion(dept.getFatherDept());

				customerChanceDao.save(customerChancePO);

				return;
			}
		}

		if (customerChanceVO.getBelonger() != null && atttype == 1) {

			UserPO belonger = userDao.get(customerChanceVO.getBelonger().getUid());

			if (belonger != null) {
				customerChancePO.setBelonger(belonger);
				customerChancePO.setDepartment(belonger.getDept());
				customerChancePO.setRegion(belonger.getDept().getFatherDept());

				customerChanceDao.save(customerChancePO);

				return;
			}
		}
	}

	public CustomerSourceVO customerSourcePOToVO(CustomerSourcePO customerSourcePO) {

		CustomerSourceVO customerSourceVO = new CustomerSourceVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())));

		BeanUtil.copyProperties(customerSourcePO, customerSourceVO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman"));

		if (customerSourcePO.getVillage() != null) {
			BeanUtil.copyProperties(customerSourcePO.getVillage(), customerSourceVO.getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(customerSourcePO.getVillage().getCityProper(), customerSourceVO.getVillage().getCityProper(), Arrays.asList("city"));
		}

		BeanUtil.copyProperties(customerSourcePO.getCreater(), customerSourceVO.getCreater(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(customerSourcePO.getCustomer(), customerSourceVO.getCustomer());
		BeanUtil.copyProperties(customerSourcePO.getHouse(), customerSourceVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(customerSourcePO.getDesigner(), customerSourceVO.getDesigner(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(customerSourcePO.getSalesman(), customerSourceVO.getSalesman(), Arrays.asList("dept", "duty"));

		if (customerSourcePO.getDesigner() != null) {
			BeanUtil.copyProperties(customerSourcePO.getDesigner().getDept(), customerSourceVO.getDesigner().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(customerSourcePO.getDesigner().getDept().getFatherDept(), customerSourceVO.getDesigner().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		if (customerSourcePO.getSalesman() != null) {
			BeanUtil.copyProperties(customerSourcePO.getSalesman().getDept(), customerSourceVO.getSalesman().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(customerSourcePO.getSalesman().getDept().getFatherDept(), customerSourceVO.getSalesman().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		return customerSourceVO;
	}

}
