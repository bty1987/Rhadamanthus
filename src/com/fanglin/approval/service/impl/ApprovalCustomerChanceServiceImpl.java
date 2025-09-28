/**
 * @File Name		: ApprovalCustomerChanceServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2018-12-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalCustomerChanceDao;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalCustomerChancePO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCustomerChanceService;
import com.fanglin.approval.vo.ApprovalCustomerChanceVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerProfileDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.decoration.service.impl.DecorationServiceImpl;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("approvalCustomerChanceService")
@Transactional(readOnly = true)
public class ApprovalCustomerChanceServiceImpl implements ApprovalCustomerChanceService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalCustomerChanceDao approvalCustomerChanceDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerProfileDao customerProfileDao;

	@Autowired
	private DecorationServiceImpl decorationService;

	@Autowired
	private MessageService messageService;

	@Override
	public ApprovalCustomerChanceVO queryApprovalCustomerChance(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		ApprovalCustomerChancePO approvalCustomerChancePO = approvalCustomerChanceDao.queryCustomerChanceByAid(approvalPO.getAid());

		if (approvalCustomerChancePO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerChanceVO customerChanceVO = new CustomerChanceVO(new CustomerVO(), new HouseVO(), new CustomerSourceVO(new VillageVO(), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(), new UserBaseVO(), new DecorationBusitypeVO()), new DecorationBusitypeVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

		approvalCustomerChancePO.getChance().ptv(customerChanceVO);

		ApprovalCustomerChanceVO approvalCustomerChanceVO = new ApprovalCustomerChanceVO(customerChanceVO, new DecorationBusitypeVO());

		BeanUtil.copyPropertie(approvalCustomerChancePO, approvalCustomerChanceVO, Arrays.asList("chance", "busitype"));

		return approvalCustomerChanceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForCustomerChance(ApprovalVO approvalVO, ApprovalCustomerChanceVO approvalCustomerChanceVO, String userId, int company) throws FLException {

		Long ccid = approvalCustomerChanceVO.getChance().getCcid();
		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_CUSTOMER_CHANCE_INT, String.valueOf(ccid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		CustomerChancePO customerChancePO = customerChanceDao.get(ccid);

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (CustomerChancePO.STATUS_CONFIRM_INT != customerChancePO.getStatus()) {
			throw new FLException(330077, "客户机会不可操作");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		if (customerSourcePO.getStatus() != CustomerSourcePO.STATUS_CONFIRM_INT) {
			throw new FLException(330074, "客户资源不可操作");
		}

		decorationService.checkOverDecoration(customerSourcePO.getCustomer().getCid(), customerSourcePO.getHouse().getHid(), company);

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		HousePO housePO = customerSourcePO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源转装修单,客户名:%s,楼盘:%s %s %s %s", customerSourcePO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber());

		approvalPO = new ApprovalPO().init(sender, receiver, "", String.valueOf(ccid), ApprovalPO.APPROVAL_TYPE_CUSTOMER_CHANCE_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalCustomerChancePO approvalCustomerChancePO = new ApprovalCustomerChancePO(customerChancePO, customerChancePO.getBusitype());

		BeanUtil.copyPropertie(approvalCustomerChanceVO, approvalCustomerChancePO, Arrays.asList("CustomerChance", "decorationBusitype", "salesman"));

		approvalCustomerChancePO.setAid(approvalPO.getAid());

		approvalCustomerChanceDao.save(approvalCustomerChancePO);

		customerSourcePO.setStatus(CustomerSourcePO.STATUS_APPROVE_TWO_INT);

		customerChanceDao.update(customerSourcePO);

		String contents = String.format("客源转装修单提交,客户名:%s,楼盘:%s %s,装修单号:%s,批注:%s", customerSourcePO.getName(), villagePO.getName(), housePO.getHouseNumber(), customerSourcePO.getOrderId(), approvalPO.getAnnotate());

		messageService.sendMessage(receiver.getUserId(), null, contents, MessagePO.TYPE_SEND_APPROVAL_INT, receiver.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForCustomerChance(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerChancePO approvalCustomerChancePO = approvalCustomerChanceDao.queryCustomerChanceByAid(approvalPO.getAid());

		if (approvalCustomerChancePO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerChancePO customerChancePO = approvalCustomerChancePO.getChance();

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		DecorationVO decorationVO = new DecorationVO();

		BeanUtil.copyPropertie(approvalCustomerChancePO, decorationVO, Arrays.asList("CustomerChance", "decorationBusitype", "salesman"));

		decorationVO.setCreater(new UserBaseVO(customerChancePO.getCreater().getUserId()));
		decorationVO.setHouse(new HouseVO(customerSourcePO.getHouse().getHid()));
		decorationVO.setCustomer(new CustomerVO(customerSourcePO.getCustomer().getCid()));
		decorationVO.setDesigner(new UserBaseVO(customerChancePO.getBelonger().getUserId()));
		decorationVO.setSalesman(new UserBaseVO(customerSourcePO.getCreater().getUserId()));
		decorationVO.setGrade("C");
		decorationVO.setNotSalesmanRate(customerChancePO.getBusitype().getNotSalesmanRate());
		decorationVO.setBusitype(approvalCustomerChancePO.getBusitype().getDbid());

		DecorationInfoVO decorationInfoVO = new DecorationInfoVO();

		decorationInfoVO.setIssueTime(customerChancePO.getIssueTime());
		decorationInfoVO.setMeetTime(customerChancePO.getMeetTime());

		decorationService.tranDecoration(decorationVO, decorationInfoVO, approvalPO.getSender().getCompany());

		customerSourcePO.setOrderId(decorationVO.getOrderId());
		customerSourcePO.setDesigner(customerChancePO.getBelonger());
		customerSourcePO.setSalesman(customerSourcePO.getCreater());
		customerSourcePO.setStatus(CustomerSourcePO.STATUS_TRAN_INT);

		customerSourceDao.update(customerSourcePO);

		customerChancePO.setStatus(CustomerChancePO.STATUS_COMPLETE_INT);

		customerChanceDao.update(customerChancePO);

		customerProfileDao.updateCustomerProfile(decorationVO.getOrderId(), customerChancePO.getCustomer().getCid(), customerSourcePO.getCsid());

		HousePO housePO = customerSourcePO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源转装修单成功,客户名:%s,楼盘:%s %s,装修单号:%s,批注:%s", customerSourcePO.getName(), villagePO.getName(), housePO.getHouseNumber(), customerSourcePO.getOrderId(), approvalPO.getAnnotate());

		UserPO designer = customerChancePO.getBelonger();
		UserPO salesman = customerSourcePO.getCreater();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, designer.getCompany());
		messageService.sendMessage(salesman.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, salesman.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForCustomerChance(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerChancePO approvalCustomerChancePO = approvalCustomerChanceDao.queryCustomerChanceByAid(approvalPO.getAid());

		if (approvalCustomerChancePO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerChancePO customerChancePO = approvalCustomerChancePO.getChance();

		if (customerChancePO == null) {
			throw new FLException(330001, "客源不存在");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		if (customerSourcePO.getStatus() == CustomerSourcePO.STATUS_APPROVE_TWO_INT) {
			customerSourcePO.setStatus(CustomerSourcePO.STATUS_CONFIRM_INT);
			customerSourceDao.update(customerSourcePO);
		}

		HousePO housePO = customerSourcePO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客源转装修单失败,审批拒绝,客户名:%s,楼盘:%s %s,批注:%s", customerSourcePO.getName(), villagePO.getName(), housePO.getHouseNumber(), approvalPO.getAnnotate());

		UserPO designer = customerChancePO.getBelonger();
		UserPO salesman = customerSourcePO.getCreater();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, designer.getCompany());
		messageService.sendMessage(salesman.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, salesman.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForCustomerChanceToDisabled(ApprovalVO approvalVO, ApprovalCustomerChanceVO approvalCustomerChanceVO, String userId, int company) throws FLException {

		Long ccid = approvalCustomerChanceVO.getChance().getCcid();
		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_CUSTOMER_CHANCE_DISABLED_INT, String.valueOf(ccid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		CustomerChancePO customerChancePO = customerChanceDao.get(ccid);

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		if (CustomerChancePO.STATUS_CONFIRM_INT == customerChancePO.getStatus()) {
			throw new FLException(330077, "客户机会不可操作");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		if (customerSourcePO.getStatus() == CustomerSourcePO.STATUS_CONFIRM_INT) {
			throw new FLException(330074, "客户资源不可操作");
		}

		UserPO receiver = customerChancePO.getDepartment().getManager();
		UserPO sender = customerChancePO.getBelonger();

		HousePO housePO = customerSourcePO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客户机会不匹配,客户名:%s,楼盘:%s %s %s %s", customerSourcePO.getName(), villagePO.getCityProper().getCity().getName(), villagePO.getCityProper().getName(), villagePO.getName(), housePO.getHouseNumber());

		approvalPO = new ApprovalPO().init(sender, receiver, "", String.valueOf(ccid), ApprovalPO.APPROVAL_TYPE_CUSTOMER_CHANCE_DISABLED_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		String contents = String.format("客户机会不匹配,客户名:%s,楼盘:%s %s,批注:%s", customerSourcePO.getName(), villagePO.getName(), housePO.getHouseNumber(), approvalPO.getAnnotate());

		messageService.sendMessage(receiver.getUserId(), null, contents, MessagePO.TYPE_SEND_APPROVAL_INT, receiver.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForCustomerChanceToDisabled(ApprovalPO approvalPO) throws FLException {

		CustomerChancePO customerChancePO = customerChanceDao.get(Long.parseLong(approvalPO.getIdent()));

		if (customerChancePO == null) {
			throw new FLException(330075, "客户机会不存在");
		}

		CustomerSourcePO customerSourcePO = customerChancePO.getSource();

		HousePO housePO = customerSourcePO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String content = String.format("客户机会不匹配,审批通过,客户名:%s,楼盘:%s %s,批注:%s", customerSourcePO.getName(), villagePO.getName(), housePO.getHouseNumber(), approvalPO.getAnnotate());

		UserPO designer = customerChancePO.getBelonger();
		UserPO salesman = customerSourcePO.getCreater();

		customerChancePO.setStatus(CustomerChancePO.STATUS_DISABLE_INT);
		customerChancePO.setAnnotate(approvalPO.getComment());

		customerChanceDao.update(customerChancePO);

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, designer.getCompany());
		messageService.sendMessage(salesman.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, salesman.getCompany());

		return 0;
	}

}
