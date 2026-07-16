package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
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
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerChanceOrderDao;
import com.fanglin.customer.dao.CustomerConfigRuleDao;
import com.fanglin.customer.dao.CustomerDeptRuleDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.dao.CustomerSourceRecordDao;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.dao.CustomerUserRuleItemDao;
import com.fanglin.customer.po.CustomerChanceOrderPO;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerConfigRulePO;
import com.fanglin.customer.po.CustomerDeptRulePO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.po.CustomerSourceRecordPO;
import com.fanglin.customer.po.CustomerUserRuleItemPO;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.customer.service.CustomerSourceService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.dao.DecorationBusitypeDao;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.dingding.service.DingTalkMessageService;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserDepartmentDao;
import com.fanglin.personel.po.UserDepartmentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("customerSourceService")
@Transactional(readOnly = true)
public class CustomerSourceServiceImpl implements CustomerSourceService {

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerChanceOrderDao customerChanceOrderDao;

	@Autowired
	private CustomerDeptRuleDao customerDeptRuleDao;

	@Autowired
	private CustomerUserRuleDao customerUserRuleDao;

	@Autowired
	private CustomerUserRuleItemDao customerUserRuleItemDao;

	@Autowired
	private CustomerSourceRecordDao customerSourceRecordDao;

	@Autowired
	private CustomerConfigRuleDao customerConfigRuleDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationBusitypeDao decorationBusitypeDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private DingTalkMessageService dingTalkMessageService;

	@Autowired
	private CountingService countingService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private UserDepartmentDao userDepartmentDao;

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

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private MessageQueuingDao messageQueuingDao;

	@Override
	public void pageCustomerSource(Paging paging, List<Filter> filters, CustomerSourceVO customerSource, int company) {

		if (customerSource.getCreater() != null && customerSource.getCreater().getUserId() != null) {
			filters.add(new Filter("user.userId", customerSource.getCreater().getUserId(), "eq"));
		}

		if (customerSource.getCreater() != null && customerSource.getCreater().getDept() != null && customerSource.getCreater().getDept().getFatherDept() != null && customerSource.getCreater().getDept().getFatherDept().getNo() != null) {
			filters.add(new Filter("user.dept.fatherDept", customerSource.getCreater().getDept().getFatherDept().getNo(), "eq"));
		}

		if (customerSource.getCreater() != null && customerSource.getCreater().getDept() != null && customerSource.getCreater().getDept().getNo() != null) {

			// 支持多部门查询: 当uid存在时, 查询UserDepartment扩展部门列表
			if (customerSource.getCreater().getUid() != null) {

				List<String> deptNos = new ArrayList<String>();
				deptNos.add(customerSource.getCreater().getDept().getNo());

				List<UserDepartmentPO> userDepartments = userDepartmentDao.queryUserDepartment(customerSource.getCreater().getUid());

				for (UserDepartmentPO ud : userDepartments) {
					if (ud.getDepartment() != null && ud.getDepartment().getNo() != null && !deptNos.contains(ud.getDepartment().getNo())) {
						deptNos.add(ud.getDepartment().getNo());
					}
				}

				filters.add(new Filter("user.dept", deptNos, "in"));
			} else {
				filters.add(new Filter("user.dept", customerSource.getCreater().getDept().getNo(), "eq"));
			}
		}

		List<CustomerSourcePO> customerSourcePOs = customerSourceDao.pageCustomerSource(paging, filters, company);
		List<CustomerSourceVO> customerSourceVOs = new ArrayList<CustomerSourceVO>();

		for (CustomerSourcePO customerSourcePO : customerSourcePOs) {

			customerSource = new CustomerSourceVO(new VillageVO(new CityProperVO(), new VillageVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new CustomerVO(), new HouseVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new DecorationBusitypeVO());

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

		CustomerSourceVO customerSourceVO = new CustomerSourceVO(new VillageVO(new CityProperVO(), new VillageVO()), new UserBaseVO(new DutyVO(), new DepartmentVO()), new CustomerVO(), new HouseVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserBaseVO())), new DecorationBusitypeVO());

		customerSourcePO.ptv(customerSourceVO);

		if (customerSourcePO.getCustomer() != null) {
			customerSourceVO.setPhone(SensitiveDataHelper.maskPhone(SensitiveDataHelper.decrypt(customerSourcePO.getCustomer().getPhone())));
		}

		return customerSourceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerSource(CustomerSourceVO customerSourceVO, String userId, int company) throws FLException {

		CustomerSourcePO customerSourcePO = new CustomerSourcePO();

		CustomerPO customerPO = null;

		UserPO creater = userDao.queryUserByUserId(userId);

		String phone = customerSourceVO.getPhone();

		CustomerSourcePO customerSourcePP = customerSourceDao.queryCustomerSource(creater.getUid(), phone, company);

		if (customerSourcePP != null) {
			// throw new FLException(330103, "客户手机号存在,发生撞尺");
			customerSourceVO.setCsid(customerSourcePP.getCsid());
			return;
		}

		if (customerSourceVO.getBusitype() == null || customerSourceVO.getBusitype().getDbid() == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		DecorationBusitypePO busitype = decorationBusitypeDao.get(customerSourceVO.getBusitype().getDbid());

		if (busitype == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		if (busitype.getType() == DecorationBusitypePO.TYPE_ORIGIN_INT) {
			throw new FLException(130062, "业务类型不匹配");
		}

		if (customerSourceVO.getCustomer() != null) {
			customerPO = customerDao.get(customerSourceVO.getCustomer().getCid());
		}

		if (customerPO != null) {
			customerSourcePO.setCustomer(customerPO);
			customerSourcePO.setPhone(customerPO.getPhone());
		}

		VillagePO villagePO = null;

		if (customerSourceVO.getVillage() != null) {
			villagePO = villageDao.get(customerSourceVO.getVillage().getNo());
		}

		if (villagePO != null) {
			customerSourcePO.setVillage(villagePO);
		}

		HousePO housePO = null;

		if (customerSourceVO.getHouse() != null) {
			housePO = houseDao.get(customerSourceVO.getHouse().getHid());
		}

		CustomerSourcePO customerSourceOO = customerSourceDao.queryCustomerSource(creater.getUid(), housePO.getHouseNumber(), housePO.getVillage().getVid(), company);

		if (housePO != null && customerSourceOO != null) {
			// throw new FLException(330102, "客户楼盘楼号存在");
			customerSourceVO.setCsid(customerSourceOO.getCsid());
			return;
		}

		if (housePO != null) {

			customerSourcePO.setHouse(housePO);
			customerSourcePO.setVillage(housePO.getVillage());
			customerSourcePO.setHouseNumber(housePO.getHouseNumber());
		}

		BeanUtil.copyProperties(customerSourceVO, customerSourcePO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman", "busitype", "phone"));

		if (customerSourceVO.getPhone() != null) {
			customerSourcePO.setPhone(SensitiveDataHelper.encrypt(phone));
		}

		customerSourcePO.setCreater(creater);
		customerSourcePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		customerSourcePO.setBusitype(busitype);
		customerSourcePO.setStatus(CustomerSourcePO.STATUS_INIT_INT);
		customerSourcePO.setCompany(company);

		customerSourceDao.save(customerSourcePO);

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), 0, String.format("客户资源创建,楼盘:%s,楼号:%s,电话:%s", villagePO != null ? villagePO.getName() : "", SensitiveDataHelper.decrypt(customerSourcePO.getHouseNumber()), SensitiveDataHelper.maskPhone(SensitiveDataHelper.decrypt(customerSourcePO.getPhone()))), CustomerSourceRecordPO.TYPE_SPECIAL_INT, customerSourcePO.getCreater()));

		customerSourceDao.flush();

		customerSourceVO.setCsid(customerSourcePO.getCsid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerSource(CustomerSourceVO customerSourceVO) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		if (customerChanceDao.countCustomerSchance(customerSourcePO.getCsid()) > 0) {
			throw new FLException(330074, "客户资源不可操作");
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
			customerSourcePO.setPhone(SensitiveDataHelper.encrypt(customerSourceVO.getPhone()));
		}

		String villageName = customerSourcePO.getVillage() != null ? customerSourcePO.getVillage().getName() : "";
		String houseNumber = SensitiveDataHelper.decrypt(customerSourcePO.getHouseNumber());
		String phone = SensitiveDataHelper.maskPhone(SensitiveDataHelper.decrypt(customerSourcePO.getPhone()));

		VillagePO villagePO = null;

		if (customerSourceVO.getVillage() != null) {
			villagePO = villageDao.get(customerSourceVO.getVillage().getNo());
		}

		if (villagePO != null) {
			customerSourcePO.setVillage(villagePO);
		}

		HousePO housePO = null;

		if (customerSourceVO.getHouse() != null) {
			housePO = houseDao.get(customerSourceVO.getHouse().getHid());
		}

		if (housePO != null && customerSourceDao.queryCustomerSource(customerSourcePO.getCreater().getUid(), housePO.getHouseNumber(), housePO.getVillage().getVid(), customerSourcePO.getCompany()) != null) {
			throw new FLException(330102, "客户楼盘楼号存在");
		}

		if (housePO != null) {

			customerSourcePO.setHouse(housePO);
			customerSourcePO.setVillage(housePO.getVillage());
			customerSourcePO.setHouseNumber(housePO.getHouseNumber());
		}

		if (customerSourceVO.getBusitype() != null && customerSourceVO.getBusitype().getDbid() != null) {

			DecorationBusitypePO busitype = decorationBusitypeDao.get(customerSourceVO.getBusitype().getDbid());

			if (busitype != null) customerSourcePO.setBusitype(busitype);
		}

		if (customerSourceVO.getPhone() != null) {
			customerSourcePO.setPhone(SensitiveDataHelper.encrypt(customerSourceVO.getPhone()));
		}

		BeanUtil.copyProperties(customerSourceVO, customerSourcePO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman", "busitype", "phone"));

		customerSourceDao.save(customerSourcePO);

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), 0, String.format("客户资源更新,原楼盘:%s,原楼号:%s,原电话:%s,新楼盘:%s,新楼号%s,新电话%s", villageName, houseNumber, phone, customerSourcePO.getVillage() != null ? customerSourcePO.getVillage().getName() : "", SensitiveDataHelper.decrypt(customerSourcePO.getHouseNumber()), SensitiveDataHelper.maskPhone(SensitiveDataHelper.decrypt(customerSourcePO.getPhone()))), CustomerSourceRecordPO.TYPE_COMMON_INT, customerSourcePO.getCreater()));
	}

	@Override
	public void updateCustomerSourceForAdvance(CustomerSourceVO customerSourceVO) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		int innerArea = customerSourcePO.getInnerArea();

		customerSourcePO.setBuildArea(customerSourceVO.getBuildArea());
		customerSourcePO.setInnerArea(customerSourceVO.getInnerArea());

		customerSourceDao.update(customerSourcePO);

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), 0, String.format("客户资源更新,原面积:%s,新面积:%s", innerArea, customerSourcePO.getInnerArea()), CustomerSourceRecordPO.TYPE_COMMON_INT, customerSourcePO.getCreater()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerSourceForStatus(CustomerSourceVO customerSourceVO) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		if (Arrays.asList(CustomerSourcePO.STATUS_TRAN_INT).contains(customerSourcePO.getStatus())) {
			throw new FLException(330074, "客户资源不可操作");
		}

		customerSourcePO.setStatus(customerSourceVO.getStatus());

		customerSourceDao.update(customerSourcePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerSourceForCustomer(CustomerSourceVO customerSourceVO) throws FLException {

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
			customerSourcePO.setPhone(SensitiveDataHelper.encrypt(customerSourceVO.getPhone()));
		}

		customerSourceDao.save(customerSourcePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerSourceForHouse(CustomerSourceVO customerSourceVO) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		if (!Arrays.asList(CustomerSourcePO.STATUS_INIT_INT, CustomerSourcePO.STATUS_APPROVE_ONE_INT).contains(customerSourcePO.getStatus())) {
			throw new FLException(330074, "客户资源不可操作");
		}

		String villageName = customerSourcePO.getVillage() != null ? customerSourcePO.getVillage().getName() : "";
		String houseNumber = SensitiveDataHelper.decrypt(customerSourcePO.getHouseNumber());

		VillagePO villagePO = null;

		if (customerSourceVO.getVillage() != null) {
			villagePO = villageDao.get(customerSourceVO.getVillage().getNo());
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

		customerSourceDao.save(customerSourcePO);

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), 0, String.format("客户资源更新,原楼盘:%s,原楼号:%s,新楼盘:%s,新楼号%s", villageName, houseNumber, customerSourcePO.getVillage().getName(), SensitiveDataHelper.decrypt(customerSourcePO.getHouseNumber())), CustomerSourceRecordPO.TYPE_COMMON_INT, customerSourcePO.getCreater()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void issueCustomerSource(CustomerSourceVO customerSourceVO, CustomerChanceVO customerChanceVO, String userId, int company) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		if (Arrays.asList(CustomerSourcePO.STATUS_DISABLE_INT, CustomerSourcePO.STATUS_TRAN_INT).contains(customerSourcePO.getStatus())) {
			// throw new FLException(330074, "客户资源不可操作");
		}

		CompanyPO companyPO = companyDao.get(company);

		short atttype = CustomerChancePO.ATTTYPE_USER_INT;

		DecorationBusitypePO busitype = customerSourcePO.getBusitype();

		UserPO issuer = userDao.queryUserByUserId(userId);

		CustomerChancePO customerChancePO = new CustomerChancePO();

		customerChancePO.setCno(customerChanceVO.getCno());
		customerChancePO.setCustomerno(customerChanceVO.getCustomerno());
		customerChancePO.setSource(customerSourcePO);
		customerChancePO.setIssuer(issuer);
		customerChancePO.setIssueTime(DateUtil.getDateToTimestamp(new Date()));
		customerChancePO.setStatus(CustomerChancePO.STATUS_INIT_INT);

		customerChancePO.setCreater(issuer);
		customerChancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		if (customerChanceVO.getCustomer() != null && customerChanceVO.getCustomer().getCid() != null) customerChancePO.setCustomer(new CustomerPO(customerChanceVO.getCustomer().getCid()));
		if (customerChanceVO.getHouse() != null && customerChanceVO.getHouse().getHid() != null) {

			HousePO housePO = houseDao.get(customerChanceVO.getHouse().getHid());

			if (housePO != null) {
				customerChancePO.setHouse(housePO);

				customerSourcePO.setBuildArea(housePO.getBuildArea());
				customerSourcePO.setInnerArea(housePO.getInnerArea());
			}
		}

		CustomerDeptRulePO customerDeptRulePO = customerDeptRuleDao.queryCustomerDeptRule(customerSourcePO.getCreater().getDept().getDid(), customerChanceVO.getBusitype().getDbid());

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

		// 获取楼盘所属城区ID
		Integer cpid = null;
		if (customerSourcePO.getVillage() != null && customerSourcePO.getVillage().getCityProper() != null) {
			cpid = customerSourcePO.getVillage().getCityProper().getCpid();
		}

		if (atttype == CustomerChancePO.ATTTYPE_AUTO_INT) {

			CustomerChancePO customerChanceEO = customerChanceDao.queryCustomerChance(customerSourcePO.getCsid(), company);

			if (checkCustomerChance(customerChanceEO) != null) {
				throw new FLException(330076, "客户机会已存在");
			}

			if (customerUserRuleDao.existCustomerUserRule(company, area) == 0) {
				throw new FLException(330104, "设计公司无设计师接单");
			}

			CustomerConfigRulePO customerConfigRulePO = customerConfigRuleDao.queryCustomerConfigRule(company);

			if (customerConfigRulePO != null && customerConfigRulePO.getSurplus() == 0) {
				customerUserRuleDao.pollingCustomerUserRule(company);
				customerConfigRuleDao.update(customerConfigRulePO.setSurplus(customerConfigRulePO.getPolling()));
			}

			List<Integer> exporters = new ArrayList<Integer>();

			CustomerUserRulePO customerUserRulePO;
			CustomerUserRuleItemPO customerUserRuleItemPO = null;

			while (true) {

				if (customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_COM_INT) customerUserRuleItemPO = customerUserRuleItemDao.pullCustomerUserRuleItem(company, area, exporters, customerSourcePO.getCreater().getDept().getDid(), customerSourcePO.getCreater().getDept().getType().getDtid(), cpid);
				if (customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_AREA_INT) customerUserRuleItemPO = customerUserRuleItemDao.pullCustomerUserRuleItem(company, area, exporters, 0, cpid);
				if (customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_DEPT_TYPE_INT) customerUserRuleItemPO = customerUserRuleItemDao.pullCustomerUserRuleItem(company, area, customerSourcePO.getCreater().getDept().getType().getDtid(), exporters);
				if (customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_DEPT_INT) customerUserRuleItemPO = customerUserRuleItemDao.pullCustomerUserRuleItem(company, area, exporters, customerSourcePO.getCreater().getDept().getDid(), cpid);
				if (customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_CITY_INT) customerUserRuleItemPO = customerUserRuleItemDao.pullCustomerUserRuleItem(company, area, exporters, 0, cpid);

				if (customerUserRuleItemPO == null && customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_COM_INT) {
					throw new FLException(330105, "无设计师接单"); // 无匹配规则
				}

				if (customerUserRuleItemPO == null && customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_AREA_INT) {
					throw new FLException(330106, "面积段无设计师接单");
				}

				if (customerUserRuleItemPO == null && customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_DEPT_TYPE_INT) {
					throw new FLException(330107, "部门类型无设计师接单");
				}

				if (customerUserRuleItemPO == null && customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_DEPT_INT) {
					throw new FLException(330108, "部门无设计师接单");
				}

				if (customerUserRuleItemPO == null && customerDeptRulePO.getFocus() == CustomerDeptRulePO.FOCUS_CITY_INT) {
					throw new FLException(330109, "城区无设计师接单");
				}

				customerUserRulePO = customerUserRuleDao.get(customerUserRuleItemPO.getCurid());

				if (customerUserRulePO == null) {
					throw new FLException(330110, "设计师匹配规则不存在");
				}

				if (customerSourceDao.countCustomerSource(customerUserRulePO.getUser().getUid(), customerSourcePO.getPhone(), company) == 0) break;
				if (exporters.size() >= 100) throw new FLException(330081, "无匹配规则");

				exporters.add(customerUserRulePO.getUser().getUid());
			}

			if (customerUserRuleItemPO.getIsSurplus() == CustomerUserRuleItemPO.ISSURPLUS_ENABLE_INT) {
				customerUserRulePO.setSurplus(customerUserRulePO.getSurplus() - 1000);
			}

			if (customerUserRuleItemPO.getIsDelete() == CustomerUserRuleItemPO.ISDELETE_ENABLE_INT) {
				customerUserRuleItemPO.setStatus(CustomerUserRuleItemPO.STATUS_DISABLED_INT);
				customerUserRuleItemPO.setDeleteTime(DateUtil.getDateToTimestamp(new Date()));
				customerUserRuleItemDao.save(customerUserRuleItemPO);
			}

			// type=6 面积轮训: 扣减明细机会数, 归0后由 SQL 的 chance>0 条件自动排除
			if (customerUserRuleItemPO.getType() == CustomerUserRuleItemPO.TYPE_AREA_POLLING_INT) {
				customerUserRuleItemPO.setChance(customerUserRuleItemPO.getChance() - 1);
				customerUserRuleItemDao.update(customerUserRuleItemPO);
			}

			customerUserRulePO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

			customerUserRuleDao.update(customerUserRulePO);

			UserPO belonger = customerUserRulePO.getUser();

			customerChanceEO = customerChanceDao.queryCustomerChance(customerSourcePO.getCsid(), belonger.getCompany());

			if (customerChanceEO != null) {
				throw new FLException(330076, "客户机会已存在");
			}

			customerChancePO.setBelonger(belonger);
			customerChancePO.setDepartment(belonger.getDept());
			customerChancePO.setRegion(belonger.getDept().getFatherDept());
			customerChancePO.setCompany(belonger.getCompany());
			customerChancePO.setIsIssue(CustomerChancePO.ISISSUE_ISSUED_INT);

			customerChancePO.setType(CustomerChancePO.ATTTYPE_AUTO_INT);
			customerChancePO.setBusitype(busitype);

			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);
			String orderId = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
			customerChancePO.setOrderId(orderId);

			customerChanceDao.save(customerChancePO);

			customerChanceOrderDao.save(new CustomerChanceOrderPO(customerChancePO.getCcid(), customerChancePO.getOrderId()));

			if (customerConfigRulePO != null) {
				customerConfigRuleDao.update(customerConfigRulePO.setSurplus(customerConfigRulePO.getSurplus() - 1000));
			}

			customerChanceVO.setCcid(customerChancePO.getCcid());
			customerChanceVO.setOrderId(customerChancePO.getOrderId());
			customerChanceVO.setBelonger(new UserBaseVO(belonger.getUserId()));
			customerChanceVO.setIssuer(new UserBaseVO(issuer.getUserId()));
			customerChanceVO.setIssueTime(customerChancePO.getIssueTime());
			customerChanceVO.setIsIssue(CustomerChancePO.ISISSUE_ISSUED_INT);

			customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), customerChancePO.getCcid(), String.format("自动分配,归属:%s(%s),部门:%s(%s),分区:%s(%s),机会数:%s,剩余数:%s,轮询数:%s", customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo(), Arith.div(customerUserRulePO.getChance(), 1000.0), Arith.div(customerUserRulePO.getSurplus(), 1000.0), customerUserRulePO.getPolling()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, issuer));
			customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), customerChancePO.getCcid(), String.format("分配规则,%s,%s", customerDeptRulePO.getFocus(), customerUserRuleItemPO.getCuriid()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, issuer));

			String message = String.format("设计:%s(%s),新分配客源,业务员:%s(%s),%s %s,请提醒他到方林办公小程序或钉钉信息平台查看.", belonger.getCurrentName(), belonger.getUserId(), customerSourcePO.getCreater().getCurrentName(), customerSourcePO.getCreater().getUserId(), customerSourcePO.getVillage().getName(), SensitiveDataHelper.decrypt(customerSourcePO.getHouseNumber()));

			if (customerChancePO.getDepartment().getManager() != null) messageService.sendMessage(customerChancePO.getDepartment().getManager().getUserId(), null, message, MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getDepartment().getManager().getCompany());
			if (customerChancePO.getRegion().getManager() != null) messageService.sendMessage(customerChancePO.getRegion().getManager().getUserId(), null, message, MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getRegion().getManager().getCompany());

			dingTalkMessageService.sendDing(customerChancePO.getBelonger().getUserId(), "您有新的客源信息, 请尽快到方林办公小程序或钉钉信息平台查看.", CompanyPO.TYPE_HEADQUARTER_INT);
			messageQueuingDao.save(new MessageCueuingPO().init(customerChancePO.getOrderId(), "addCustomerLead", "{\"orderId\":\"" + customerChancePO.getOrderId() + "\",\"ccid\":" + customerChancePO.getCcid() + ",\"csid\":" + customerSourcePO.getCsid() + ",\"event\":\"CUSTOMER_CHANCE_AUTO_ASSIGNED\"}"));

			return;
		}

		if (customerChanceVO.getRegion() != null && atttype == CustomerChancePO.ATTTYPE_REGION_INT) {

			DepartmentPO region = departmentDao.get(customerChanceVO.getRegion().getDid());

			if (region == null) {
				throw new FLException(310001, "部门不存在");
			}

			customerChancePO.setType(CustomerChancePO.ATTTYPE_REGION_INT);
			customerChancePO.setRegion(region);
			customerChancePO.setCompany(region.getCompany());

			if (region.getManager() != null) {
				customerChancePO.setBelonger(region.getManager());
			}

			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);

			String orderId = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

			customerChancePO.setOrderId(orderId);

			customerChanceDao.save(customerChancePO);

			customerChanceOrderDao.save(new CustomerChanceOrderPO(customerChancePO.getCcid(), customerChancePO.getOrderId()));

			customerChanceVO.setCcid(customerChancePO.getCcid());
			customerChanceVO.setOrderId(customerChancePO.getOrderId());
			if (customerChancePO.getBelonger() != null) {
				customerChanceVO.setBelonger(new UserBaseVO(customerChancePO.getBelonger().getUserId()));
			}
			customerChanceVO.setIssuer(new UserBaseVO(issuer.getUserId()));
			customerChanceVO.setIssueTime(customerChancePO.getIssueTime());
			customerChanceVO.setIsIssue(CustomerChancePO.ISISSUE_ISSUED_INT);

			String message = String.format("新分配客源,业务员:%s(%s),%s %s,请提醒他到方林办公小程序或钉钉信息平台查看.", customerSourcePO.getCreater().getCurrentName(), customerSourcePO.getCreater().getUserId(), customerSourcePO.getVillage().getName(), SensitiveDataHelper.decrypt(customerSourcePO.getHouseNumber()));

			if (customerChancePO.getRegion().getManager() != null) messageService.sendMessage(customerChancePO.getRegion().getManager().getUserId(), null, message, MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getRegion().getManager().getCompany());

			messageQueuingDao.save(new MessageCueuingPO().init(customerChancePO.getOrderId(), "addCustomerLead", "{\"orderId\":\"" + customerChancePO.getOrderId() + "\",\"ccid\":" + customerChancePO.getCcid() + ",\"csid\":" + customerSourcePO.getCsid() + ",\"event\":\"CUSTOMER_CHANCE_REGION_ASSIGNED\"}"));

			return;
		}

		if (customerChanceVO.getDepartment() != null && atttype == CustomerChancePO.ATTTYPE_DEPT_INT) {

			DepartmentPO dept = departmentDao.get(customerChanceVO.getDepartment().getDid());

			if (dept == null) {
				throw new FLException(310001, "部门不存在");
			}

			customerChancePO.setType(CustomerChancePO.ATTTYPE_DEPT_INT);
			customerChancePO.setDepartment(dept);
			customerChancePO.setRegion(dept.getFatherDept());
			customerChancePO.setCompany(dept.getCompany());

			if (dept.getFatherDept() == null) {
				customerChancePO.setRegion(dept);
			}

			if (dept.getManager() != null) {
				customerChancePO.setBelonger(dept.getManager());
			}

			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);

			String orderId = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

			customerChancePO.setOrderId(orderId);

			customerChanceDao.save(customerChancePO);

			customerChanceOrderDao.save(new CustomerChanceOrderPO(customerChancePO.getCcid(), customerChancePO.getOrderId()));

			customerChanceVO.setCcid(customerChancePO.getCcid());
			customerChanceVO.setOrderId(customerChancePO.getOrderId());
			if (customerChancePO.getBelonger() != null) {
				customerChanceVO.setBelonger(new UserBaseVO(customerChancePO.getBelonger().getUserId()));
			}
			customerChanceVO.setIssuer(new UserBaseVO(issuer.getUserId()));
			customerChanceVO.setIssueTime(customerChancePO.getIssueTime());

			customerChanceVO.setIsIssue(CustomerChancePO.ISISSUE_ISSUED_INT);
			customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), customerChancePO.getCcid(), String.format("手动部门分配,部门:%s(%s),分区:%s(%s)", customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, issuer));

			String message = String.format("新分配客源,业务员:%s(%s),%s %s,请提醒他到方林办公小程序或钉钉信息平台查看.", customerSourcePO.getCreater().getCurrentName(), customerSourcePO.getCreater().getUserId(), customerSourcePO.getVillage().getName(), SensitiveDataHelper.decrypt(customerSourcePO.getHouseNumber()));

			if (customerChancePO.getDepartment().getManager() != null) messageService.sendMessage(customerChancePO.getDepartment().getManager().getUserId(), null, message, MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getDepartment().getManager().getCompany());
			if (customerChancePO.getRegion().getManager() != null) messageService.sendMessage(customerChancePO.getRegion().getManager().getUserId(), null, message, MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getRegion().getManager().getCompany());

			messageQueuingDao.save(new MessageCueuingPO().init(customerChancePO.getOrderId(), "addCustomerLead", "{\"orderId\":\"" + customerChancePO.getOrderId() + "\",\"ccid\":" + customerChancePO.getCcid() + ",\"csid\":" + customerSourcePO.getCsid() + ",\"event\":\"CUSTOMER_CHANCE_DEPT_ASSIGNED\"}"));

			return;
		}

		if (customerChanceVO.getBelonger() != null && atttype == CustomerChancePO.ATTTYPE_USER_INT) {

			UserPO belonger = userDao.queryUserByUserId(customerChanceVO.getBelonger().getUserId());

			if (belonger == null) {
				throw new FLException(190005, "人员不存在");
			}

			CustomerChancePO customerChanceEO = customerChanceDao.queryCustomerChance(customerSourcePO.getCsid(), belonger.getCompany());

			if (checkCustomerChance(customerChanceEO) != null) {
				throw new FLException(330076, "客户机会已存在");
			}

			customerChancePO.setIsIssue(CustomerChancePO.ISISSUE_ISSUED_INT);
			customerChancePO.setType(CustomerChancePO.ATTTYPE_USER_INT);
			customerChancePO.setBelonger(belonger);
			customerChancePO.setDepartment(belonger.getDept());
			customerChancePO.setRegion(belonger.getDept().getFatherDept());
			customerChancePO.setCompany(belonger.getCompany());

			if (belonger.getDept().getFatherDept() == null) {
				customerChancePO.setRegion(belonger.getDept());
			}

			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);

			String orderId = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

			customerChancePO.setOrderId(orderId);

			customerChanceDao.save(customerChancePO);

			customerChanceOrderDao.save(new CustomerChanceOrderPO(customerChancePO.getCcid(), customerChancePO.getOrderId()));

			customerChanceVO.setCcid(customerChancePO.getCcid());
			customerChanceVO.setOrderId(customerChancePO.getOrderId());
			customerChanceVO.setBelonger(new UserBaseVO(belonger.getUserId()));
			customerChanceVO.setIssuer(new UserBaseVO(issuer.getUserId()));
			customerChanceVO.setIssueTime(customerChancePO.getIssueTime());
			customerChanceVO.setIsIssue(CustomerChancePO.ISISSUE_ISSUED_INT);

			customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), customerChancePO.getCcid(), String.format("手动人员分配,归属:%s(%s),部门:%s(%s),分区:%s(%s)", customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, issuer));

			dingTalkMessageService.sendDing(customerChancePO.getBelonger().getUserId(), "您有新的客源信息, 请尽快到方林办公小程序或钉钉信息平台查看.", CompanyPO.TYPE_HEADQUARTER_INT);

			String message = String.format("设计:%s(%s),新分配客源,业务员:%s(%s),%s %s,请提醒他到方林办公小程序或钉钉信息平台查看.", belonger.getCurrentName(), belonger.getUserId(), customerSourcePO.getCreater().getCurrentName(), customerSourcePO.getCreater().getUserId(), customerSourcePO.getVillage().getName(), SensitiveDataHelper.decrypt(customerSourcePO.getHouseNumber()));

			if (customerChancePO.getDepartment().getManager() != null) messageService.sendMessage(customerChancePO.getDepartment().getManager().getUserId(), null, message, MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getDepartment().getManager().getCompany());
			if (customerChancePO.getRegion().getManager() != null) messageService.sendMessage(customerChancePO.getRegion().getManager().getUserId(), null, message, MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getRegion().getManager().getCompany());

			messageQueuingDao.save(new MessageCueuingPO().init(customerChancePO.getOrderId(), "addCustomerLead", "{\"orderId\":\"" + customerChancePO.getOrderId() + "\",\"ccid\":" + customerChancePO.getCcid() + ",\"csid\":" + customerSourcePO.getCsid() + ",\"event\":\"CUSTOMER_CHANCE_USER_ASSIGNED\"}"));

			return;
		}
	}

	private CustomerChancePO checkCustomerChance(CustomerChancePO customerChancePO) {

		if (customerChancePO == null) return customerChancePO;

		if (customerChancePO.getOrderId() == null) return customerChancePO;

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(customerChancePO.getOrderId());

		if (decorationPO == null) return customerChancePO;

		if (Arrays.asList(DecorationPO.STATUS_TERMINATION_INT, DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_FINAL_INT).contains(decorationPO.getStatus())) return null;
		if (DecorationPO.BALANCESTATUS_CONDUCT_INT == decorationPO.getBalanceStatus()) return null;

		return customerChancePO;
	}
}
