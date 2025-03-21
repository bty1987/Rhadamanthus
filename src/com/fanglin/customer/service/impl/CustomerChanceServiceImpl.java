package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.dao.CustomerSourceRecordDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.po.CustomerSourceRecordPO;
import com.fanglin.customer.service.CustomerChanceService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("CustomerChanceService")
@Transactional(readOnly = true)
public class CustomerChanceServiceImpl implements CustomerChanceService {

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private CustomerSourceRecordDao customerSourceRecordDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private MessageService messageService;

	@Override
	public void pageCustomerChance(Paging paging, List<Filter> filters, CustomerChanceVO customerChanceVO, String userId, Integer company) {

		if (customerChanceVO.getBelonger() != null && customerChanceVO.getBelonger().getUserId() != null) {
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

			customerChanceVO = new CustomerChanceVO(new CustomerVO(), new HouseVO(new VillageVO(new VillageVO())), new CustomerSourceVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO(), new DecorationBusitypeVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

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

		customerChancePO.setRate(customerChanceVO.getRate());

		customerChanceDao.update(customerChancePO);
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

		String content = String.format("客户机会释放", customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo());

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
	@Transactional(rollbackFor = Exception.class)
	public void confirmCustomerChance(CustomerChanceVO customerChanceVO, String securityCode, String verifyCode) throws FLException {

		try {

			if (!verifyCode.equals(AESHelper.decrypt(securityCode, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")))) {
				throw new FLException(330010, "客机确认失败,验证码错误");
			}
		} catch (Exception e) {
			throw new FLException(330010, "客机确认失败,验证码错误");
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

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerChancePO.getSource().getCsid(), customerChancePO.getCcid(), String.format("手动分配,归属:%s(%s),部门:%s(%s),分区:%s(%s)", customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, issuer));

		if (belonger != null) messageService.sendMessage(belonger.getUserId(), null, "您有新的客源信息, 请尽快到方林办公小程序或钉钉信息平台查看.", MessagePO.TYPE_SEND_CUSTOMER_INT, belonger.getCompany());

		if (dept != null && dept.getManager() != null) messageService.sendMessage(dept.getManager().getUserId(), null, String.format("部门成员%s(%s)有一条新的客源信息, 请提醒他到方林办公小程序或钉钉信息平台查看.", belonger.getCurrentName(), belonger.getUserId()), MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getDepartment().getManager().getCompany());
		if (region != null && region.getManager() != null) messageService.sendMessage(region.getManager().getUserId(), null, String.format("部门成员%s(%s)有一条新的客源信息, 请提醒他到方林办公小程序或钉钉信息平台查看.", belonger.getCurrentName(), belonger.getUserId()), MessagePO.TYPE_SEND_CUSTOMER_INT, customerChancePO.getRegion().getManager().getCompany());

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
		decorationVO.setNotSalesmanRate(customerChancePO.getRate());
		decorationVO.setBusitype(customerChancePO.getBusitype().getDbid());

		decorationService.tranDecoration(decorationVO, company);

		customerChancePO.setOrderId(decorationVO.getOrderId());
		customerChancePO.setStatus(CustomerChancePO.STATUS_COMPLETE_INT);

		customerChanceDao.update(customerChancePO);

		customerSourceRecordDao.save(new CustomerSourceRecordPO().init(customerSourcePO.getCsid(), customerChancePO.getCcid(), String.format("客户资源转装修单,归属:%s(%s),部门:%s(%s),分区:%s(%s)", customerChancePO.getBelonger().getCurrentName(), customerChancePO.getBelonger().getUserId(), customerChancePO.getDepartment().getName(), customerChancePO.getDepartment().getNo(), customerChancePO.getRegion().getName(), customerChancePO.getRegion().getNo()), CustomerSourceRecordPO.TYPE_SPECIAL_INT, operater));
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
}
