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
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.service.CustomerChanceService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
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
	private UserDao userDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private MessageService messageService;

	@Override
	public void pageCustomerChance(Paging paging, List<Filter> filters, String userId) {

		List<CustomerChancePO> customerChancePOs = customerChanceDao.pageCustomerChance(paging, filters);
		List<CustomerChanceVO> customerChanceVOs = new ArrayList<CustomerChanceVO>();

		for (CustomerChancePO customerChancePO : customerChancePOs) {

			CustomerChanceVO customerChanceVO = new CustomerChanceVO(new CustomerSourceVO(new VillageVO(), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

			BeanUtil.copyProperties(customerChancePO, customerChanceVO, Arrays.asList("source", "busitype", "creater", "issuer", "belonger", "department", "region"));
			BeanUtil.copyProperties(customerChancePO.getSource(), customerChanceVO.getSource(), Arrays.asList("village", "creater", "customer", "house", "designer", "salesman"));
			BeanUtil.copyProperties(customerChancePO.getBusitype(), customerChanceVO.getBusitype());
			BeanUtil.copyProperties(customerChancePO.getCreater(), customerChanceVO.getCreater());
			BeanUtil.copyProperties(customerChancePO.getIssuer(), customerChanceVO.getIssuer());
			BeanUtil.copyProperties(customerChancePO.getBelonger(), customerChanceVO.getBelonger());
			BeanUtil.copyProperties(customerChancePO.getDepartment(), customerChanceVO.getDepartment());
			BeanUtil.copyProperties(customerChancePO.getRegion(), customerChanceVO.getRegion());

			customerChanceVOs.add(customerChanceVO);
		}

		paging.setData(customerChanceVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableCustomerChance(CustomerChanceVO customerChanceVO, String userId) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_INIT_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		customerChancePO.setStatus(CustomerChancePO.STATUS_LNVALID_INT);

		customerChanceDao.update(customerChancePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendCustomerChance(CustomerChanceVO customerChanceVO, String userId) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_DISTRIBUTION_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		String content = String.format("客源确认,客户名:%s,楼盘:%s,电话:%s", customerChancePO.getSource().getName(), customerChancePO.getSource().getHouse().getVillage().getName(), customerChancePO.getSource().getPhone());

		UserPO designer = customerChancePO.getSource().getDesigner();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_CUSTOMER_INT, designer.getCompany());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmCustomerChange(CustomerChanceVO customerChanceVO, String securityCode, String verifyCode) throws FLException {

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

		if (customerChancePO.getStatus() != CustomerChancePO.STATUS_DISTRIBUTION_INT) {
			throw new FLException(330077, "客户机会不可操作");
		}

		customerChancePO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
		customerChancePO.setStatus(CustomerChancePO.STATUS_CONFIRM_INT);

		customerChanceDao.update(customerChancePO);

		String content = String.format("客源确认,客户名:%s,楼盘:%s,电话:%s", customerChancePO.getSource().getName(), customerChancePO.getSource().getHouse().getVillage().getName(), customerChancePO.getSource().getPhone());

		UserPO designer = customerChancePO.getSource().getDesigner();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_CUSTOMER_INT, designer.getCompany());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void issueCustomerChance(CustomerChanceVO customerChanceVO, String userId) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(customerChanceVO.getCcid());

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		UserPO issuer = userDao.queryUserByOldUserId(userId);

		customerChancePO.setIssuer(issuer);
		customerChancePO.setIssueTime(DateUtil.getDateToTimestamp(new Date()));

		customerChancePO.setBusitype(new DecorationBusitypePO(customerChanceVO.getBusitype().getDbid()));

		DepartmentPO region = departmentDao.get(customerChanceVO.getRegion().getDid());

		if (region != null) {
			customerChancePO.setRegion(region);
		}

		DepartmentPO dept = departmentDao.get(customerChanceVO.getDepartment().getDid());

		if (dept != null) {
			customerChancePO.setDepartment(dept);
		}

		UserPO belonger = userDao.get(customerChanceVO.getBelonger().getUid());

		if (belonger != null) {
			customerChancePO.setBelonger(belonger);
		}

		customerChanceDao.update(customerChancePO);
	}
}
