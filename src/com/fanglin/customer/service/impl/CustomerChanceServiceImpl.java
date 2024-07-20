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
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerSourcePO;
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
	private UserDao userDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private MessageService messageService;

	@Override
	public void pageCustomerChance(Paging paging, List<Filter> filters, CustomerChanceVO customerChanceVO, String userId) {

		if (customerChanceVO.getBelonger() != null && customerChanceVO.getBelonger().getUserId() != null) {
			filters.add(new Filter("user.userId", customerChanceVO.getBelonger().getUserId(), "eq"));
		}

		if (customerChanceVO.getBelonger() != null && customerChanceVO.getBelonger().getDept() != null && customerChanceVO.getBelonger().getDept().getFatherDept() != null && customerChanceVO.getBelonger().getDept().getFatherDept().getNo() != null) {
			filters.add(new Filter("user.dept.fatherDept", customerChanceVO.getBelonger().getDept().getFatherDept().getNo(), "eq"));
		}

		if (customerChanceVO.getBelonger() != null && customerChanceVO.getBelonger().getDept() != null && customerChanceVO.getBelonger().getDept().getNo() != null) {
			filters.add(new Filter("user.dept", customerChanceVO.getBelonger().getDept().getNo(), "eq"));
		}

		List<CustomerChancePO> customerChancePOs = customerChanceDao.pageCustomerChance(paging, filters);
		List<CustomerChanceVO> customerChanceVOs = new ArrayList<CustomerChanceVO>();

		for (CustomerChancePO customerChancePO : customerChancePOs) {

			customerChanceVO = new CustomerChanceVO(new CustomerSourceVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

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

			customerChanceVO = new CustomerChanceVO(new CustomerSourceVO(new VillageVO(), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

			customerChanceVOs.add(customerChancePO.ptv(customerChanceVO));
		}

		return customerChanceVOs;
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

		customerChancePO.setStatus(CustomerChancePO.STATUS_DISABLE_INT);

		customerChanceDao.update(customerChancePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendCustomerChance(CustomerChanceVO customerChanceVO, String userId) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_ISSUE_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		String content = String.format("客源确认,客户名:%s,楼盘:%s,电话:%s", customerChancePO.getSource().getName(), customerChancePO.getSource().getHouse().getVillage().getName(), customerChancePO.getSource().getPhone());

		UserPO designer = customerChancePO.getSource().getDesigner();

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

		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_ISSUE_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		if (customerSourcePO.getStatus() != CustomerSourcePO.STATUS_APPROVE_ONE_INT) {
			throw new FLException(330074, "客户资源不可操作");
		}

		customerChancePO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
		customerChancePO.setStatus(CustomerChancePO.STATUS_CONFIRM_INT);

		customerChanceDao.update(customerChancePO);

		customerSourcePO.setStatus(CustomerSourcePO.STATUS_CONFIRM_INT);

		customerSourceDao.update(customerSourcePO);

		String content = String.format("客源确认,客户名:%s,楼盘:%s,电话:%s", customerChancePO.getSource().getName(), customerChancePO.getSource().getHouse().getVillage().getName(), customerChancePO.getSource().getPhone());

		UserPO creater = customerChancePO.getSource().getCreater();

		messageService.sendMessage(creater.getUserId(), null, content, MessagePO.TYPE_SEND_CUSTOMER_INT, creater.getCompany());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void issueCustomerChance(CustomerChanceVO customerChanceVO, String userId) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_INIT_INT && customerChancePO.getStatus() != CustomerChancePO.STATUS_ISSUE_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		UserPO issuer = userDao.queryUserByOldUserId(userId);

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

			customerChancePO.setStatus(CustomerChancePO.STATUS_ISSUE_INT);
		}

		if (belonger.getDept().getFatherDept() == null) {
			customerChancePO.setRegion(belonger.getDept());
		}

		customerChanceDao.update(customerChancePO);
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

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		if (customerSourcePO.getStatus() != CustomerSourcePO.STATUS_CONFIRM_INT) {
			throw new FLException(330074, "客户资源不可操作");
		}

		if (customerSourcePO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		if (customerSourcePO.getHouse() == null) {
			throw new FLException(130017, "房产不存在");
		}

		BeanUtil.copyPropertie(customerSourcePO, decorationVO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman"));

		decorationVO.setCreater(new UserBaseVO(userId));
		decorationVO.setHouse(new HouseVO(customerSourcePO.getHouse().getHid()));
		decorationVO.setCustomer(new CustomerVO(customerSourcePO.getCustomer().getCid()));
		decorationVO.setDesigner(new UserBaseVO(customerChancePO.getBelonger().getUserId()));
		decorationVO.setSalesman(new UserBaseVO(customerSourcePO.getCreater().getUserId()));
		decorationVO.setGrade("C");
		decorationVO.setNotSalesmanRate(customerChancePO.getRate());
		decorationVO.setBusitype(customerChancePO.getBusitype().getDbid());

		decorationService.tranDecoration(decorationVO, company);

		customerSourcePO.setOrderId(decorationVO.getOrderId());
		customerSourcePO.setStatus(CustomerSourcePO.STATUS_TRAN_INT);

		customerSourcePO.setDesigner(customerChancePO.getBelonger());
		customerSourcePO.setSalesman(customerSourcePO.getCreater());

		customerSourceDao.update(customerSourcePO);

		customerChancePO.setStatus(CustomerChancePO.STATUS_COMPLETE_INT);

		customerChanceDao.update(customerChancePO);
	}
}
