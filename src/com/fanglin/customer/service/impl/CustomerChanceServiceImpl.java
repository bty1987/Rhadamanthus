package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerProfileDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.dao.CustomerSourceRecordDao;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.po.CustomerSourceRecordPO;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.customer.service.CustomerChanceService;
import com.fanglin.customer.service.CustomerSourceService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.HttpUtil;
import com.fanglin.utils.Paging;

@Service("CustomerChanceService")
@Transactional(readOnly = true)
public class CustomerChanceServiceImpl implements CustomerChanceService {

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private CustomerProfileDao customerProfileDao;

	@Autowired
	private CustomerUserRuleDao customerUserRuleDao;

	@Autowired
	private CustomerSourceRecordDao customerSourceRecordDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private CustomerSourceService customerSourceService;

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

			customerChanceVO = new CustomerChanceVO(new CustomerVO(), new HouseVO(new VillageVO(new VillageVO())), new CustomerSourceVO(new VillageVO(new CityProperVO(), new VillageVO()), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO(), new DecorationBusitypeVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

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

			customerChanceVO = new CustomerChanceVO(new CustomerVO(), new HouseVO(new VillageVO()), new CustomerSourceVO(new VillageVO(), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO(), new DecorationBusitypeVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

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

		customerChanceVO = new CustomerChanceVO(new CustomerVO(), new HouseVO(new VillageVO()), new CustomerSourceVO(new VillageVO(), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO(), new DecorationBusitypeVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

		customerChancePO.ptv(customerChanceVO);

		if (customerChancePO.getCustomer() != null) {
			customerChanceVO.getSource().setPhone(customerChancePO.getCustomer().getPhone());
		}

		return customerChanceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerChance(CustomerChanceVO customerChanceVO, String userId, int company) throws FLException {

		if (customerChanceVO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChanceVO.getSource() == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		if (customerSourceDao.queryCustomerSourceByNo(customerChanceVO.getSource().getNo()) != null) {
			throw new FLException(330072, "客户资源已存在");
		}

		if (customerChanceDao.queryCustomerChanceByCno(customerChanceVO.getCno()) != null) {
			throw new FLException(330076, "客户机会已存在");
		}

		String phone = customerChanceVO.getSource().getPhone();

		customerChanceVO.getSource().setBusitype(customerChanceVO.getBusitype());
		customerChanceVO.getSource().setPhone(phone.substring(0, 3) + "****" + phone.substring(7));

		customerSourceService.addCustomerSource(customerChanceVO.getSource(), userId, company);

		customerChanceDao.flush();

		customerSourceService.issueCustomerSource(customerChanceVO.getSource(), customerChanceVO, userId, company);
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

		String phone = FormatUtil.decodePhone(customerChancePO.getSource().getCustomer().getPhone());

		customerChanceVO.getSource().setPhone(phone.substring(0, 3) + "****" + phone.substring(7));
		customerChanceVO.getSource().setGender(customerChancePO.getSource().getCustomer().getGender());
		customerChanceVO.getSource().getHouse().setHouseNumber(customerChancePO.getSource().getHouse().getHouseNumber());
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

		String url = String.format("%s/queryVode.do?phone=%s", isv.getValue(), (customerChanceVO.getCustomer() != null) ? customerChanceVO.getCustomer().getPhone() : FormatUtil.decodePhone(customerPO.getPhone()));

		JSONObject json = HttpUtil.httpGet(url);

		if (json != null && json.getInteger("errorCode") != null && json.getInteger("errorCode") == 0) {
			return json.getString("securityCode");
		}

		if (json == null || json.getInteger("errorCode") == null || json.getInteger("errorCode") != 0) {
			System.out.println(url);
			System.out.println(json);
		}

		return null;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmCustomerChance(CustomerChanceVO customerChanceVO, String securityCode, String verifyCode) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		CustomerPO customerPO = customerChancePO.getCustomer();

		if (customerPO == null) {
			throw new FLException(130002, "客户不存在");
		}

		HousePO housePO = customerChancePO.getHouse();

		if (housePO == null) {
			throw new FLException(130017, "房产不存在");
		}

		if (customerChanceVO.getCustomer() != null && customerChanceVO.getCustomer().getPhone() != null && !customerPO.getPhone().equals(FormatUtil.encodePhone(customerChanceVO.getCustomer().getPhone()))) {
			throw new FLException(130115, "客户电话不匹配");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		customerChancePO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
		customerChancePO.setStatus(CustomerChancePO.STATUS_CONFIRM_INT);

		customerChanceDao.update(customerChancePO);

		customerSourcePO.setStatus(CustomerSourcePO.STATUS_CONFIRM_INT);

		customerSourceDao.update(customerSourcePO);

		String content = String.format("客源确认,装修单:%s,客户名:%s,楼盘:%s,楼号:%s,电话:%s", customerChancePO.getOrderId(), customerChancePO.getSource().getName(), customerChancePO.getHouse().getVillage().getName(), customerChancePO.getHouse().getHouseNumber(), customerChancePO.getCustomer().getPhone());

		UserPO creater = customerChancePO.getCreater();
		UserPO belonger = customerChancePO.getBelonger();

		messageService.sendMessage(belonger.getUserId(), creater.getUserId(), content, MessagePO.TYPE_SEND_CUSTOMER_INT, belonger.getCompany());

		if (customerChancePO.getCno() == null) return;

		SystemConfigPO url = systemConfigDao.querySystemConfig("qw_url");// 获取新系统URL

		if (url == null) return;

		SystemConfigPO appkey = systemConfigDao.querySystemConfig("qw_appkey");

		if (appkey == null) return;

		SystemConfigPO appsecret = systemConfigDao.querySystemConfig("qw_appsecret");

		if (appsecret == null) return;

		String timestamp = String.valueOf(System.currentTimeMillis());
		String sign = MD5Helper.MD5(appkey.value("") + appsecret.value("") + timestamp).toLowerCase();

		String fullUrl = new StringBuilder(url.value("")).append("?appKey=").append(appkey.value("")).append("&timestamp=").append(timestamp).append("&sign=").append(sign).toString();

		JSONObject args = new JSONObject();
		args.put("adornCode", customerChanceVO.getCno());
		args.put("erpJhCode", String.valueOf(customerChanceVO.getCcid()));
		args.put("statusName", "CONFIRM_DESIGNER_FINISHED");
		args.put("statusTime", DateUtil.current("yyyy-MM-dd HH:mm:ss"));

		JSONObject res = HttpUtil.httpPost(fullUrl, args);

		System.out.println(res);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void affirmCustomerChance(CustomerChanceVO customerChanceVO, String securityCode, String verifyCode) throws FLException {
		confirmCustomerChance(customerChanceVO, securityCode, verifyCode);
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

		customerChancePO.setBusitype(new DecorationBusitypePO(customerChanceVO.getBusitype().getDbid()));

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

		belonger = customerChancePO.getBelonger() == null ? issuer : customerChancePO.getBelonger();
		dept = customerChancePO.getDepartment() == null ? issuer.getDept() : customerChancePO.getDepartment();
		region = dept.getFatherDept() == null ? dept : dept.getFatherDept();

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerChancePO.getSource().getCsid(), customerChancePO.getCcid(), String.format("手动分配,归属:%s(%s),部门:%s(%s),分区:%s(%s)", belonger.getCurrentName(), belonger.getUserId(), dept.getName(), dept.getNo(), region.getName(), dept.getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, issuer));

		if (belonger != null) messageService.sendMessage(belonger.getUserId(), null, "您有新的客源信息, 请尽快到方林办公小程序或钉钉信息平台查看.", MessagePO.TYPE_SEND_CUSTOMER_INT, belonger.getCompany());

		String message = String.format("设计:%s(%s),新分配客源,业务员:%s(%s),%s %s,请提醒他到方林办公小程序或钉钉信息平台查看.", belonger.getCurrentName(), belonger.getUserId(), customerChancePO.getCreater().getCurrentName(), customerChancePO.getCreater().getUserId(), customerChancePO.getSource().getVillage().getName(), customerChancePO.getSource().getHouseNumber());

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

		decorationService.tranDecoration(decorationVO, decorationInfoVO, company);

		customerChancePO.setOrderId(decorationVO.getOrderId());
		customerChancePO.setStatus(CustomerChancePO.STATUS_COMPLETE_INT);

		customerChanceDao.update(customerChancePO);

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), customerChancePO.getCcid(), String.format("客户资源转装修单,归属:%s(%s),部门:%s(%s),分区:%s(%s)", customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, operater));

		customerProfileDao.updateCustomerProfile(decorationVO.getOrderId(), customerChancePO.getCustomer().getCid(), customerSourcePO.getCsid());

		String message = String.format("设计:%s(%s),装修单:%s转单成功,%s %s.", customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), decorationVO.getOrderId(), customerChancePO.getHouse().getVillage().getName(), customerChancePO.getHouse().getHouseNumber());

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
	public void configCustomerChance(CustomerChanceVO customerChance) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChance.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (!StringUtils.isEmpty(customerChance.getIsGroup())) {
			customerChancePO.setIsGroup(customerChance.getIsGroup());
		}

		if (!StringUtils.isEmpty(customerChance.getIsPhone())) {
			customerChancePO.setIsPhone(customerChance.getIsPhone());
		}

		if (!StringUtils.isEmpty(customerChance.getIsMeet())) {
			customerChancePO.setIsMeet(customerChance.getIsMeet());
		}

		if (CustomerChancePO.ISMEET_MEET_INT == customerChancePO.getIsMeet()) {
			customerChancePO.setMeetTime(DateUtil.getDateToTimestamp(new Date()));
		}

		if (!StringUtils.isEmpty(customerChance.getIsTrue())) {
			customerChancePO.setIsTrue(customerChance.getIsTrue());
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
			throw new FLException(140013, "订单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		customerChancePO.setOrderId(decorationVO.getOrderId());
		customerChancePO.setStatus(CustomerChancePO.STATUS_COMPLETE_INT);

		customerChanceDao.update(customerChancePO);

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerChancePO.getSource().getCsid(), customerChancePO.getCcid(), String.format("客户机会完成,装修单号:%s,归属:%s(%s),部门:%s(%s),分区:%s(%s)", decorationPO.getOrderId(), customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, operater));

	}
}
