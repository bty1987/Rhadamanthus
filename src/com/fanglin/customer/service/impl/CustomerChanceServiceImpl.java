package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.service.HouseService;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerChanceOrderDao;
import com.fanglin.customer.dao.CustomerProfileDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.dao.CustomerSourceRecordDao;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.po.CustomerChanceOrderPO;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.po.CustomerSourceRecordPO;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.customer.service.CustomerChanceService;
import com.fanglin.customer.service.CustomerSourceService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.dao.DecorationBusitypeDao;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.HttpUtil;
import com.fanglin.utils.Paging;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("CustomerChanceService")
@Transactional(readOnly = true)
public class CustomerChanceServiceImpl implements CustomerChanceService {

	private static final Logger log = LoggerFactory.getLogger(CustomerChanceServiceImpl.class);

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerChanceOrderDao customerChanceOrderDao;

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private CustomerProfileDao customerProfileDao;

	@Autowired
	private CustomerUserRuleDao customerUserRuleDao;

	@Autowired
	private CustomerSourceRecordDao customerSourceRecordDao;

	@Autowired
	private HouseDao houseDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationBusitypeDao decorationBusitypeDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private MessageQueuingDao messageQueuingDao;

	@Autowired
	private CustomerSourceService customerSourceService;

	@Autowired
	private WeChatAppService weChatAppService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private HouseService houseService;

	@Autowired
	private VillageDao villageDao;

	@Override
	public void pageCustomerChance(Paging paging, List<Filter> filters, CustomerChanceVO customerChanceVO, String userId, Integer company) {

		if (customerChanceVO.getBelonger() != null && customerChanceVO.getBelonger().getUserId() != null) {

			company = null;

			filters.add(new Filter("user.userId", customerChanceVO.getBelonger().getUserId(), "eq"));
		}

		if (customerChanceVO.getBelonger() != null && customerChanceVO.getBelonger().getDept() != null && customerChanceVO.getBelonger().getDept().getFatherDept() != null && customerChanceVO.getBelonger().getDept().getFatherDept().getNo() != null) {
			filters.add(new Filter("user.dept.fatherDept", customerChanceVO.getBelonger().getDept().getFatherDept().getNo(), "eq"));
		}

		if (customerChanceVO.getBelonger() != null && customerChanceVO.getBelonger().getDept() != null && customerChanceVO.getBelonger().getDept().getNo() != null) {
			filters.add(new Filter("user.dept", customerChanceVO.getBelonger().getDept().getNo(), "eq"));
		}

		if (customerChanceVO.getSource() != null && customerChanceVO.getSource().getCsid() != null) {

			company = null;

			filters.add(new Filter("source.csid", String.valueOf(customerChanceVO.getSource().getCsid()), "eq"));
		}

		List<CustomerChancePO> customerChancePOs = customerChanceDao.pageCustomerChance(paging, filters, company);
		List<CustomerChanceVO> customerChanceVOs = new ArrayList<CustomerChanceVO>();

		for (CustomerChancePO customerChancePO : customerChancePOs) {

			customerChanceVO = new CustomerChanceVO(new CustomerVO(), new HouseVO(new VillageVO(new VillageVO())), new CustomerSourceVO(new VillageVO(new CityProperVO(), new VillageVO()), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO(), new DecorationBusitypeVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(new DutyVO()), new DepartmentVO(), new DepartmentVO());

			customerChanceVOs.add(customerChancePO.ptv(customerChanceVO));
		}

		paging.setData(customerChanceVOs);
	}

	@Override
	public List<CustomerChanceVO> queryCustomerChance(CustomerChanceVO customerChanceVO) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerChanceVO.getSource().getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		List<CustomerChancePO> customerChancePOs = customerChanceDao.queryCustomerChance(customerSourcePO.getCsid());
		List<CustomerChanceVO> customerChanceVOs = new ArrayList<CustomerChanceVO>();

		for (CustomerChancePO customerChancePO : customerChancePOs) {

			customerChanceVO = new CustomerChanceVO(new CustomerVO(), new HouseVO(new VillageVO()), new CustomerSourceVO(new VillageVO(), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO(), new DecorationBusitypeVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(new DutyVO()), new DepartmentVO(), new DepartmentVO());

			customerChanceVOs.add(customerChancePO.ptv(customerChanceVO));
		}

		return customerChanceVOs;
	}

	@Override
	public CustomerChanceVO queryCustomerChanceByCcid(CustomerChanceVO customerChanceVO) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		customerChanceVO = new CustomerChanceVO(new CustomerVO(), new HouseVO(new VillageVO()), new CustomerSourceVO(new VillageVO(), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO(), new DecorationBusitypeVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(new DutyVO()), new DepartmentVO(), new DepartmentVO());

		customerChancePO.ptv(customerChanceVO);

		if (customerChancePO.getCustomer() != null) {
			customerChanceVO.getSource().setPhone(SensitiveDataHelper.maskPhone(SensitiveDataHelper.decrypt(customerChancePO.getCustomer().getPhone())));
		}

		CompanyPO companyPO = companyDao.get(customerChancePO.getCompany());

		if (companyPO != null) {
			customerChanceVO.setCompanyName(companyPO.getName());
		}

		return customerChanceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CustomerChanceVO addCustomerChance(CustomerChanceVO customerChanceVO, String userId, int company) throws FLException {

		if (customerChanceVO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChanceVO.getSource() == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		if (customerSourceDao.queryCustomerSourceByNo(customerChanceVO.getSource().getNo()) != null) {
			// throw new FLException(330072, "客户资源已存在");
		}

		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChanceByCno(customerChanceVO.getCno());

		if (customerChancePO != null) {
			CustomerSourcePO customerSourcePO = customerSourceDao.get(customerChancePO.getSource().getCsid());
			customerSourceService.issueCustomerSource(new CustomerSourceVO(customerSourcePO.getCsid()), customerChanceVO, userId, company);
			return customerChanceVO;
		}

		// UserPO creater = userDao.queryUserByUserId(userId);
		//
		// CustomerSourcePO customerSourcePO = customerSourceDao.queryCustomerSource(creater.getUid(), SensitiveDataHelper.encrypt(customerChanceVO.getSource().getPhone()), company);
		//
		// if (customerSourcePO != null) {
		// customerSourceService.issueCustomerSource(new CustomerSourceVO(customerSourcePO.getCsid()), customerChanceVO, userId, company);
		// return customerChanceVO;
		// }

		// ========== 自动处理客户和房产 ==========
		// 1. 处理客户信息
		CustomerVO customerVO = new CustomerVO(customerChanceVO.getSource().getName(), customerChanceVO.getSource().getPhone());

		if (customerChanceVO.getSource().getGender() != null) {
			customerVO.setGender(customerChanceVO.getSource().getGender());
		}

		// 调用 existCustomer：自动判断客户是否存在，不存在则创建
		customerService.existCustomer(customerVO, company);
		Long cid = customerVO.getCid();

		// 2. 处理房产信息
		HouseVO houseVO = new HouseVO();

		// 验证楼盘是否存在
		if (customerChanceVO.getSource().getVillage() == null || customerChanceVO.getSource().getVillage().getNo() == null) {
			throw new FLException(130018, "楼盘不存在");
		}

		VillagePO villagePO = villageDao.get(customerChanceVO.getSource().getVillage().getNo());
		if (villagePO == null) {
			throw new FLException(130018, "楼盘不存在");
		}

		houseVO.setVillage(new VillageVO(villagePO.getNo()));
		houseVO.setHouseNumber(customerChanceVO.getSource().getHouse().getHouseNumber());

		if (customerChanceVO.getSource().getHouse() != null && customerChanceVO.getSource().getHouse().getBuildArea() != null) {
			houseVO.setBuildArea(customerChanceVO.getSource().getHouse().getBuildArea());
		}

		// 调用 existHouse：自动判断房产是否存在，不存在则创建
		houseService.existHouse(houseVO, company);

		Long hid = houseVO.getHid();

		// 设置CID和HID到source对象
		customerChanceVO.getSource().getCustomer().setCid(cid);
		customerChanceVO.getSource().getHouse().setHid(hid);
		// ==========================================
		customerChanceVO.getSource().setBuildArea(customerChanceVO.getSource().getHouse().getBuildArea());
		customerChanceVO.getSource().setInnerArea(customerChanceVO.getSource().getHouse().getBuildArea());

		customerChanceVO.getSource().setBusitype(customerChanceVO.getBusitype());

		customerSourceService.addCustomerSource(customerChanceVO.getSource(), userId, company);

		customerChanceDao.flush();

		customerSourceService.issueCustomerSource(customerChanceVO.getSource(), customerChanceVO, userId, company);

		return customerChanceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerChance(CustomerChanceVO customerChanceVO) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_INIT_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		if (customerChanceVO.getCustomer() != null) customerChancePO.setCustomer(new CustomerPO(customerChanceVO.getCustomer().getCid()));
		if (customerChanceVO.getHouse() != null) customerChancePO.setHouse(new HousePO(customerChanceVO.getHouse().getHid()));
		if (customerChanceVO.getBusitype() != null) customerChancePO.setBusitype(new DecorationBusitypePO(customerChanceVO.getBusitype().getDbid()));
		if (customerChanceVO.getRate() != null) customerChancePO.setRate(customerChanceVO.getRate());

		customerChancePO.setRate(customerChanceVO.getRate());

		customerChanceDao.update(customerChancePO);

		if (customerChanceVO.getSource() == null) return;

		customerChanceVO.getSource().setCsid(customerChancePO.getSource().getCsid());
		customerChanceVO.getSource().setName(customerChancePO.getSource().getCustomer().getName());

		customerChanceVO.getSource().setGender(customerChancePO.getSource().getCustomer().getGender());
		customerChanceVO.getSource().getHouse().setHouseNumber(SensitiveDataHelper.decrypt(customerChancePO.getSource().getHouse().getHouseNumber()));
		customerChanceVO.getSource().getVillage().setVid(customerChancePO.getHouse().getVillage().getVid());

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerChancePO.getSource().getCsid());

		BeanUtil.copyProperties(customerChanceVO.getSource(), customerSourcePO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman", "busitype"));

		customerSourceDao.update(customerSourcePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableCustomerChance(CustomerChanceVO customerChanceVO, String userId) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChancePO.getStatus() == CustomerChancePO.STATUS_COMPLETE_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		UserPO operator = userDao.queryUserByUserId(userId);

		customerChancePO.setStatus(CustomerChancePO.STATUS_DISABLE_INT);
		customerChancePO.setAnnotate(customerChanceVO.getAnnotate());

		customerChanceDao.update(customerChancePO);

		UserPO belonger = customerChancePO.getBelonger() == null ? operator : customerChancePO.getBelonger();
		DepartmentPO dept = customerChancePO.getDepartment() == null ? operator.getDept() : customerChancePO.getDepartment();
		DepartmentPO region = dept.getFatherDept() == null ? dept : dept.getFatherDept();

		String content = String.format("客户机会释放", belonger.getCurrentName(), belonger.getUserId(), dept.getName(), dept.getNo(), region.getName(), region.getNo());

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerChancePO.getSource().getCsid(), customerChancePO.getCcid(), content, CustomerSourceRecordPO.TYPE_COMMON_INT, operator));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendCustomerChance(CustomerChanceVO customerChanceVO, String userId) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (Arrays.asList(CustomerChancePO.STATUS_DISABLE_INT, CustomerChancePO.STATUS_CONFIRM_INT, CustomerChancePO.STATUS_COMPLETE_INT).contains(customerChancePO.getStatus())) {
			throw new FLException(330077, "客户机会不可操作");
		}

		String content = String.format("客源确认,客户名:%s,楼盘:%s,电话:%s", customerChancePO.getSource().getName(), customerChancePO.getHouse().getVillage().getName(), customerChancePO.getCustomer().getPhone());

		UserPO designer = customerChancePO.getBelonger();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_CUSTOMER_INT, designer.getCompany());
	}

	@Override
	public String vodeCustomerChance(CustomerChanceVO customerChanceVO, String userId) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		CustomerPO customerPO = customerChancePO.getCustomer();

		if (customerPO == null) {
			throw new FLException(130002, "客户不存在");
		}

		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");

		String url = String.format("%s/queryVode.do?phone=%s", isv.getValue(), (customerChanceVO.getCustomer() != null) ? customerChanceVO.getCustomer().getPhone() : SensitiveDataHelper.decrypt(customerPO.getPhone()));

		JSONObject json = HttpUtil.httpGet(url);

		if (json != null && json.getInteger("errorCode") != null && json.getInteger("errorCode") == 0) {
			return json.getString("securityCode");
		}

		if (json == null || json.getInteger("errorCode") == null || json.getInteger("errorCode") != 0) {
			log.warn("queryVode failed, url: {}, response: {}", url, json);
		}

		return null;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmCustomerChance(CustomerChanceVO customerChanceVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		// 仅允许 初始(0) / 审批通过(2) 的客源进行确认, 防止已完成(4)/失效(1)/已确认(3)等状态被回退
		if (!Arrays.asList(CustomerChancePO.STATUS_INIT_INT, CustomerChancePO.STATUS_APPROVE_INT).contains(customerChancePO.getStatus())) {
			throw new FLException(330077, "客户机会不可操作");
		}

		CustomerPO customerPO = customerChancePO.getCustomer();

		if (customerPO == null) {
			throw new FLException(130002, "客户不存在");
		}

		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			customerChanceVO.getCustomer().setPhone(weChatPhoneInfoVO.getPhoneNumber());
		}

		HousePO housePO = customerChancePO.getHouse();

		if (housePO == null) {
			throw new FLException(130017, "房产不存在");
		}

		if (customerChanceVO.getCustomer() != null && customerChanceVO.getCustomer().getPhone() != null && !SensitiveDataHelper.decrypt(customerPO.getPhone()).equals(customerChanceVO.getCustomer().getPhone())) {
			throw new FLException(130115, "客户电话不匹配");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		customerChancePO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
		customerChancePO.setStatus(CustomerChancePO.STATUS_CONFIRM_INT);

		customerChanceDao.update(customerChancePO);

		customerSourcePO.setStatus(CustomerSourcePO.STATUS_CONFIRM_INT);

		customerSourceDao.update(customerSourcePO);

		String content = String.format("客源确认,装修单:%s,客户名:%s,楼盘:%s,楼号:%s,电话:%s", customerChancePO.getOrderId(), customerChancePO.getSource().getName(), customerChancePO.getHouse().getVillage().getName(), SensitiveDataHelper.decrypt(customerChancePO.getHouse().getHouseNumber()), customerChancePO.getCustomer().getPhone());

		UserPO creater = customerChancePO.getCreater();
		UserPO belonger = customerChancePO.getBelonger();

		messageService.sendMessage(belonger.getUserId(), creater.getUserId(), content, MessagePO.TYPE_SEND_CUSTOMER_INT, belonger.getCompany());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void affirmCustomerChance(CustomerChanceVO customerChanceVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {
		confirmCustomerChance(customerChanceVO, securityCode, verifyCode, phoneCode, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void issueCustomerChance(CustomerChanceVO customerChanceVO, String userId) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (Arrays.asList(CustomerChancePO.STATUS_DISABLE_INT, CustomerChancePO.STATUS_COMPLETE_INT).contains(customerChancePO.getStatus())) {
			throw new FLException(330077, "客户机会不可操作");
		}

		UserPO issuer = userDao.queryUserByUserId(userId);

		customerChancePO.setIssuer(issuer);
		customerChancePO.setIssueTime(DateUtil.getDateToTimestamp(new Date()));

		DecorationBusitypePO busitypePO = null;

		if (customerChanceVO != null && customerChanceVO.getBusitype() != null && customerChanceVO.getBusitype().getDbid() != null) {
			busitypePO = decorationBusitypeDao.get(customerChanceVO.getBusitype().getDbid());
		}

		if (busitypePO == null) {
			busitypePO = customerChancePO.getBusitype();
		}

		if (busitypePO == null) {
			busitypePO = customerChancePO.getSource().getBusitype();
		}

		customerChancePO.setBusitype(busitypePO);

		DepartmentPO region = null;

		if (customerChanceVO.getRegion() != null) {
			region = departmentDao.get(customerChanceVO.getRegion().getDid());
		}

		if (region != null) {
			customerChancePO.setRegion(region);
		}

		DepartmentPO dept = null;

		if (customerChanceVO.getDepartment() != null) {
			dept = departmentDao.get(customerChanceVO.getDepartment().getDid());
		}

		if (dept != null) {
			customerChancePO.setRegion(dept.getFatherDept());
			customerChancePO.setDepartment(dept);
		}

		if (dept != null && dept.getFatherDept() == null) {
			customerChancePO.setRegion(dept);
		}

		UserPO belonger = null;

		if (customerChanceVO.getBelonger() != null) {
			belonger = userDao.queryUserByUserId(customerChanceVO.getBelonger().getUserId());
		}

		if (belonger != null) {

			CustomerUserRulePO customerUserRulePO = customerUserRuleDao.queryCustomerUserRule(belonger.getUid());

			if (customerUserRulePO != null && customerUserRulePO.getStatus() == CustomerUserRulePO.STATUS_ADVANCE_INVALID_INT) {
				throw new FLException(330082, "规则不可操作");
			}

			customerChancePO.setIsIssue(CustomerChancePO.ISISSUE_ISSUED_INT);
			customerChancePO.setRegion(belonger.getDept().getFatherDept());
			customerChancePO.setDepartment(belonger.getDept());
			customerChancePO.setBelonger(belonger);
			customerChancePO.setCompany(belonger.getCompany());

			dept = belonger.getDept();
		}

		if (belonger.getDept().getFatherDept() == null) {
			customerChancePO.setRegion(belonger.getDept());
		}

		customerChancePO.setStatus(CustomerChancePO.STATUS_INIT_INT);

		customerChanceDao.update(customerChancePO);

		messageQueuingDao.save(new MessageCueuingPO().init(customerChancePO.getOrderId(), "issueCustomerChance", "{\"ccid\":" + customerChancePO.getCcid() + ",\"csid\":" + customerChancePO.getSource().getCsid() + ",\"event\":\"CUSTOMER_CHANCE_ISSUED\"" + buildLeadnoArgs(customerChancePO) + "}"));

		belonger = customerChancePO.getBelonger() == null ? issuer : customerChancePO.getBelonger();
		dept = customerChancePO.getDepartment() == null ? issuer.getDept() : customerChancePO.getDepartment();
		region = dept.getFatherDept() == null ? dept : dept.getFatherDept();

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerChancePO.getSource().getCsid(), customerChancePO.getCcid(), String.format("手动分配,归属:%s(%s),部门:%s(%s),分区:%s(%s)", belonger.getCurrentName(), belonger.getUserId(), dept.getName(), dept.getNo(), region.getName(), dept.getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, issuer));

		if (belonger != null) messageService.sendMessage(belonger.getUserId(), null, "您有新的客源信息, 请尽快到方林办公小程序或钉钉信息平台查看.", MessagePO.TYPE_SEND_CUSTOMER_INT, belonger.getCompany());

		String message = String.format("设计:%s(%s),新分配客源,业务员:%s(%s),%s %s,请提醒他到方林办公小程序或钉钉信息平台查看.", belonger.getCurrentName(), belonger.getUserId(), customerChancePO.getCreater().getCurrentName(), customerChancePO.getCreater().getUserId(), customerChancePO.getSource().getVillage().getName(), SensitiveDataHelper.decrypt(customerChancePO.getSource().getHouseNumber()));

		if (dept != null && dept.getManager() != null) messageService.sendMessage(dept.getManager().getUserId(), null, message, MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getDepartment().getManager().getCompany());
		if (region != null && region.getManager() != null) messageService.sendMessage(region.getManager().getUserId(), null, message, MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getRegion().getManager().getCompany());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeCustomerChance(DecorationVO decorationVO, CustomerChanceVO customerChanceVO, String userId, int company) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_CONFIRM_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		if (customerChancePO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		if (customerChancePO.getHouse() == null) {
			throw new FLException(130017, "房产不存在");
		}

		if (customerChancePO.getBusitype() == null) {
			throw new FLException(130061, "业务类型不存在");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		BeanUtil.copyPropertie(customerSourcePO, decorationVO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman"));

		decorationVO.setOrderId(customerChancePO.getOrderId());
		decorationVO.setCreater(new UserBaseVO(userId));
		decorationVO.setHouse(new HouseVO(customerChancePO.getHouse().getHid()));
		decorationVO.setCustomer(new CustomerVO(customerChancePO.getCustomer().getCid()));
		decorationVO.setDesigner(new UserBaseVO(customerChancePO.getBelonger().getUserId()));
		decorationVO.setSalesman(new UserBaseVO(customerSourcePO.getCreater().getUserId()));
		decorationVO.setGrade("C");
		decorationVO.setNotSalesmanRate(customerChancePO.getBusitype().getNotSalesmanRate());
		decorationVO.setBusitype(customerChancePO.getBusitype().getDbid());

		DecorationInfoVO decorationInfoVO = new DecorationInfoVO();

		decorationInfoVO.setIssueTime(customerChancePO.getIssueTime());
		decorationInfoVO.setMeetTime(customerChancePO.getMeetTime());
		decorationInfoVO.setCcid(customerChancePO.getCcid());

		if (customerChancePO.getHouse() != null) {
			HousePO housePO = customerChancePO.getHouse();

			housePO.setBuildArea(customerChancePO.getSource().getBuildArea());

			houseDao.update(housePO);
		}

		if (customerChancePO.getIsCheck() == CustomerChancePO.ISCHECK_CHECK_INT) decorationService.checkOverDecoration(customerChancePO.getCustomer().getCid(), customerChancePO.getHouse().getHid());

		// 保存原来的orderId，用于后续比较
		String originalOrderId = customerChancePO.getOrderId();

		decorationService.tranDecoration(decorationVO, decorationInfoVO, company);

		// 判断orderId是否发生变化，如果不同则更新
		if (!decorationVO.getOrderId().equals(originalOrderId)) {
			customerChancePO.setOrderId(decorationVO.getOrderId());

			messageQueuingDao.save(new MessageQueuingPO().init(decorationVO.getOrderId(), "changeCustomerChance", "{\"orderId\":\"" + decorationVO.getOrderId() + "\",\"originOrderId\":\"" + originalOrderId + "\",\"event\":\"TRAN_DECORATION_ORDER_CHANGED\",\"ccid\":" + customerChancePO.getCcid() + ",\"csid\":" + customerChancePO.getSource().getCsid() + buildLeadnoArgs(customerChancePO) + "}"));
		}

		messageQueuingDao.save(new MessageCueuingPO().init(decorationVO.getOrderId(), "changeCustomerChance", "{\"orderId\":\"" + decorationVO.getOrderId() + "\",\"originOrderId\":\"" + originalOrderId + "\",\"event\":\"TRAN_DECORATION\",\"ccid\":" + customerChancePO.getCcid() + ",\"csid\":" + customerChancePO.getSource().getCsid() + buildLeadnoArgs(customerChancePO) + "}"));

		customerChancePO.setOrderId(decorationVO.getOrderId());
		customerChancePO.setStatus(CustomerChancePO.STATUS_COMPLETE_INT);

		customerChanceDao.update(customerChancePO);

		CustomerChanceOrderPO existOrder = customerChanceOrderDao.queryCustomerChanceOrder(customerChancePO.getCcid());
		if (existOrder == null) {
			customerChanceOrderDao.save(new CustomerChanceOrderPO(customerChancePO.getCcid(), customerChancePO.getOrderId()));
		}

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), customerChancePO.getCcid(), String.format("客户资源转装修单,归属:%s(%s),部门:%s(%s),分区:%s(%s)", customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, operater));

		customerProfileDao.updateCustomerProfile(decorationVO.getOrderId(), customerChancePO.getCustomer().getCid(), customerSourcePO.getCsid());

		String message = String.format("设计:%s(%s),装修单:%s转单成功,%s %s.", customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), decorationVO.getOrderId(), customerChancePO.getHouse().getVillage().getName(), SensitiveDataHelper.decrypt(customerChancePO.getHouse().getHouseNumber()));

		messageService.sendMessage(customerChancePO.getCreater().getUserId(), null, message, MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getCreater().getCompany());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void readCustomerChance(CustomerChanceVO customerChanceVO) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		customerChancePO.setIsRead(CustomerChancePO.ISREAD_READ_INT);
		customerChancePO.setReadTime(DateUtil.getDateToTimestamp(new Date()));

		customerChanceDao.update(customerChancePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void configCustomerChance(CustomerChanceVO customerChanceVO) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (!StringUtils.isEmpty(customerChanceVO.getIsGroup())) {
			customerChancePO.setIsGroup(customerChanceVO.getIsGroup());
		}

		if (!StringUtils.isEmpty(customerChanceVO.getIsPhone())) {
			customerChancePO.setIsPhone(customerChanceVO.getIsPhone());
		}

		if (customerChanceVO.getIsMeet() != null && customerChanceVO.getIsMeet() == CustomerChancePO.ISMEET_MEET_INT && customerChancePO.getIsMeet() != CustomerChancePO.ISMEET_MEET_INT) {
			messageQueuingDao.save(new MessageCueuingPO().init(customerChancePO.getOrderId(), "meetCustomerChance", "{\"ccid\":" + customerChancePO.getCcid() + ",\"csid\":" + customerChancePO.getSource().getCsid() + ",\"event\":\"CUSTOMER_CHANCE_MEET\"" + buildLeadnoArgs(customerChancePO) + "}"));
		}

		if (!StringUtils.isEmpty(customerChanceVO.getIsMeet())) {
			customerChancePO.setIsMeet(customerChanceVO.getIsMeet());
		}

		if (CustomerChancePO.ISMEET_MEET_INT == customerChancePO.getIsMeet()) {
			customerChancePO.setMeetTime(DateUtil.getDateToTimestamp(new Date()));
		}

		if (!StringUtils.isEmpty(customerChanceVO.getIsTrue())) {
			customerChancePO.setIsTrue(customerChanceVO.getIsTrue());
		}

		customerChanceDao.update(customerChancePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void fineCustomerChance(CustomerChanceVO customerChance, String userId) throws FLException {
		CustomerChancePO customerChancePO = customerChanceDao.get(customerChance.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		customerChancePO.setFiner(userPO);
		customerChancePO.setFineTime(DateUtil.getDateToTimestamp(new Date()));
		customerChancePO.setIsFine(CustomerChancePO.ISFINE_FINE_INT);

		customerChanceDao.update(customerChancePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void finishCustomerChance(DecorationVO decorationVO, CustomerChanceVO customerChanceVO, String userId, int company) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_CONFIRM_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		customerChancePO.setOrderId(decorationVO.getOrderId());
		customerChancePO.setStatus(CustomerChancePO.STATUS_COMPLETE_INT);

		customerChanceDao.update(customerChancePO);

		customerChanceOrderDao.save(new CustomerChanceOrderPO(customerChancePO.getCcid(), customerChancePO.getOrderId()));

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerChancePO.getSource().getCsid(), customerChancePO.getCcid(), String.format("客户机会完成,装修单号:%s,归属:%s(%s),部门:%s(%s),分区:%s(%s)", decorationPO.getOrderId(), customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, operater));

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void uncheckCustomerChance(CustomerChanceVO customerChanceVO) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		// 设置 isCheck 为 1（忽略状态）
		customerChancePO.setIsCheck(CustomerChancePO.ISCHECK_IGNORE_INT);

		customerChanceDao.update(customerChancePO);

		log.info("客户机会设置为忽略状态, ccid={}, isCheck={}", customerChancePO.getCcid(), customerChancePO.getIsCheck());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void tranCustomerChance(CustomerChanceVO customerChanceVO, int company) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_CONFIRM_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		if (customerSourcePO == null) {
			throw new FLException(330094, "客户资源不存在");
		}

		if (customerSourcePO.getStatus() != CustomerSourcePO.STATUS_CONFIRM_INT) {
			// throw new FLException(330074, "客户资源不可操作");
		}

		CustomerPO customerPO = customerDao.get(customerChanceVO.getCustomer().getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户不存在");
		}

		HousePO housePO = houseDao.get(customerChanceVO.getHouse().getHid());

		if (housePO == null) {
			throw new FLException(130017, "房产不存在");
		}

		String orderId = customerChancePO.getOrderId();

		decorationService.checkOverDecoration(customerSourcePO.getCustomer().getCid(), customerSourcePO.getHouse().getHid(), company);

		DecorationVO decorationVO = new DecorationVO();
		decorationVO.setCreater(new UserBaseVO(customerChancePO.getCreater().getUserId()));
		decorationVO.setHouse(new HouseVO(customerSourcePO.getHouse().getHid()));
		decorationVO.setCustomer(new CustomerVO(customerSourcePO.getCustomer().getCid()));
		decorationVO.setDesigner(new UserBaseVO(customerChancePO.getBelonger().getUserId()));
		decorationVO.setSalesman(new UserBaseVO(customerSourcePO.getCreater().getUserId()));
		decorationVO.setGrade("C");
		decorationVO.setNotSalesmanRate(customerChancePO.getBusitype().getNotSalesmanRate());
		decorationVO.setBusitype(customerChancePO.getBusitype().getDbid());

		DecorationInfoVO decorationInfoVO = new DecorationInfoVO();
		decorationInfoVO.setIssueTime(customerChancePO.getIssueTime());
		decorationInfoVO.setMeetTime(customerChancePO.getMeetTime());
		decorationInfoVO.setCcid(customerChancePO.getCcid());

		decorationService.tranDecoration(decorationVO, decorationInfoVO, company);

		customerSourcePO.setOrderId(decorationVO.getOrderId());
		customerSourcePO.setDesigner(customerChancePO.getBelonger());
		customerSourcePO.setSalesman(customerSourcePO.getCreater());
		customerSourcePO.setStatus(CustomerSourcePO.STATUS_TRAN_INT);

		customerSourceDao.update(customerSourcePO);

		customerChancePO.setStatus(CustomerChancePO.STATUS_COMPLETE_INT);
		customerChanceDao.update(customerChancePO);

		customerProfileDao.updateCustomerProfile(decorationVO.getOrderId(), customerChancePO.getCustomer().getCid(), customerSourcePO.getCsid());

		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源转装修单成功,客户名:%s,楼盘:%s %s,装修单号:%s", customerSourcePO.getName(), villagePO.getName(), SensitiveDataHelper.decrypt(housePO.getHouseNumber()), customerSourcePO.getOrderId());
		UserPO designer = customerChancePO.getBelonger();
		UserPO salesman = customerSourcePO.getCreater();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());
		messageService.sendMessage(salesman.getUserId(), null, content, MessagePO.TYPE_SEND_PERSONEL_INT, salesman.getCompany());

		messageQueuingDao.save(new MessageCueuingPO().init(customerChancePO.getOrderId(), "tranCustomerChance", "{\"ccid\":" + customerChancePO.getCcid() + ",\"csid\":" + customerChancePO.getSource().getCsid() + ",\"originOrderId\":\"" + orderId + ",\"orderId\":\"" + customerChancePO.getOrderId() + "\",\"event\":\"CUSTOMER_CHANCE_ISSUED\"" + buildLeadnoArgs(customerChancePO) + "}"));

		log.info("客户机会直接转装修单成功, ccid={}, orderId={}", customerChancePO.getCcid(), decorationVO.getOrderId());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void approveCustomerChance(CustomerChanceVO customerChanceVO, int company) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		// 直接初审支持反复操作: 允许初始(0)和已审批(2)状态, 其他状态(失效1/确认3/完成4/废单5)禁止
		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_INIT_INT && customerChancePO.getStatus() != CustomerChancePO.STATUS_APPROVE_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		if (customerSourcePO == null) {
			throw new FLException(330094, "客户资源不存在");
		}

		// 如果前端传了 house.hid，优先使用前端传入的（支持直接初审时修改楼盘/楼号）
		HousePO housePO = null;

		if (customerChanceVO.getHouse() != null && customerChanceVO.getHouse().getHid() != null && customerChanceVO.getHouse().getHid() > 0) {
			housePO = houseDao.get(customerChanceVO.getHouse().getHid());
		}

		if (housePO == null) {
			housePO = customerSourcePO.getHouse();
		}

		if (housePO == null) {
			housePO = customerChancePO.getHouse();
		}

		if (housePO == null) {
			throw new FLException(130017, "房产不存在");
		}

		customerSourcePO.setHouse(housePO);
		customerChancePO.setHouse(housePO);

		CustomerPO customerPO = null;

		if (customerChanceVO.getCustomer() != null && customerChanceVO.getCustomer().getCid() != null) {
			customerPO = customerDao.get(customerChanceVO.getCustomer().getCid());
		}

		if (customerPO == null) {
			customerPO = customerSourcePO.getCustomer();
		}

		if (customerPO == null) {
			customerPO = customerChancePO.getCustomer();
		}

		if (customerPO == null) {
			CustomerVO customerVO = new CustomerVO(customerSourcePO.getName(), SensitiveDataHelper.decrypt(customerSourcePO.getPhone()));

			customerService.existCustomer(customerVO, company);

			customerPO = new CustomerPO(customerVO.getCid());
		}

		customerSourcePO.setCustomer(customerPO);
		customerChancePO.setCustomer(customerPO);

		// 检查是否需要校验重复订单（isCheck=0 校验，isCheck=1 忽略）
		if (customerChancePO.getIsCheck() == CustomerChancePO.ISCHECK_CHECK_INT) {
			decorationService.checkOverDecoration(customerPO.getCid(), housePO.getHid(), company);
		}

		// 设置客户来源状态为初审通过（STATUS_APPROVE_ONE_INT = 2）

		customerSourcePO.setStatus(CustomerSourcePO.STATUS_APPROVE_ONE_INT);
		customerSourceDao.update(customerSourcePO);

		// 设置客户机会信息（参照 approveForCustomerSource 的逻辑）

		customerChancePO.setRate(customerChanceVO.getRate() != null ? customerChanceVO.getRate() : 0);

		if (customerChanceVO.getBusitype() != null && customerChanceVO.getBusitype().getDbid() != null && customerChanceVO.getBusitype().getDbid() > 0) {
			customerChancePO.setBusitype(new DecorationBusitypePO(customerChanceVO.getBusitype().getDbid()));
		}

		// 设置客户机会状态为审批通过（STATUS_APPROVE_INT = 2）
		customerChancePO.setStatus(CustomerChancePO.STATUS_APPROVE_INT);
		customerChanceDao.update(customerChancePO);

		// 发送消息通知
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客户机会直接初审通过,客户名:%s,楼盘:%s %s %s %s", customerSourcePO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), SensitiveDataHelper.decrypt(housePO.getHouseNumber()));

		UserPO belonger = customerChancePO.getBelonger();
		if (belonger != null) {
			messageService.sendMessage(belonger.getUserId(), null, content, MessagePO.TYPE_SEND_PERSONEL_INT, belonger.getCompany());
		}

		log.info("客户机会直接初审成功, ccid={}, sourceStatus={}, chanceStatus={}", customerChancePO.getCcid(), customerSourcePO.getStatus(), customerChancePO.getStatus());
	}

	private String buildLeadnoArgs(CustomerChancePO customerChancePO) {
		String customerno = customerChancePO.getCustomerno();
		return (customerno != null && !customerno.isEmpty()) ? ",\"customerNo\":\"" + customerno + "\"" : "";
	}
}
