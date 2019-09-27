/**
 * @File Name		: ApprovalCustomerOriginTDecorationServiceImpl.java
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

import com.fanglin.approval.dao.ApprovalCustomerOriginTDecorationDao;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCustomerOriginTDecorationService;
import com.fanglin.approval.vo.ApprovalCustomerOriginTDecorationVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerOriginDao;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.customer.vo.CustomerOriginVO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.impl.DecorationServiceImpl;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.BeanUtil;

@Service("approvalCustomerOriginTDecorationService")
@Transactional(readOnly = true)
public class ApprovalCustomerOriginTDecorationServiceImpl implements ApprovalCustomerOriginTDecorationService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalCustomerOriginTDecorationDao approvalCustomerOriginTDecorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CustomerOriginDao customerOriginDao;

	@Autowired
	private DecorationServiceImpl decorationService;

	@Autowired
	private MessageService messageService;

	@Override
	public ApprovalCustomerOriginTDecorationVO queryApprovalCustomerOriginTDecoration(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = approvalCustomerOriginTDecorationDao.queryCustomerOriginTDecorationByAid(approvalPO.getAid());

		if (approvalCustomerOriginTDecorationPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		ApprovalCustomerOriginTDecorationVO approvalCustomerOriginTDecorationVO = new ApprovalCustomerOriginTDecorationVO();

		CustomerOriginVO customerOriginVO = new CustomerOriginVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new CustomerVO(), new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())));
		CustomerOriginPO customerOriginPO = approvalCustomerOriginTDecorationPO.getCustomerOrigin();

		BeanUtil.copyProperties(customerOriginPO, customerOriginVO, Arrays.asList("village", "creater", "belonger", "department", "region", "customer", "house", "designer"));

		BeanUtil.copyProperties(customerOriginPO.getCustomer(), customerOriginVO.getCustomer());
		BeanUtil.copyProperties(customerOriginPO.getHouse(), customerOriginVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(customerOriginPO.getDesigner(), customerOriginVO.getDesigner(), Arrays.asList("dept", "duty"));

		BeanUtil.copyProperties(customerOriginPO.getHouse().getVillage(), customerOriginVO.getHouse().getVillage(), Arrays.asList("cityProper"));
		BeanUtil.copyProperties(customerOriginPO.getHouse().getVillage().getCityProper(), customerOriginVO.getHouse().getVillage().getCityProper(), Arrays.asList("city"));
		BeanUtil.copyProperties(customerOriginPO.getHouse().getVillage().getCityProper().getCity(), customerOriginVO.getHouse().getVillage().getCityProper().getCity(), Arrays.asList("region"));

		if (customerOriginPO.getDesigner() != null) {
			BeanUtil.copyProperties(customerOriginPO.getDesigner().getDept(), customerOriginVO.getDesigner().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(customerOriginPO.getDesigner().getDept().getFatherDept(), customerOriginVO.getDesigner().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		approvalCustomerOriginTDecorationVO.setSalesman(new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO())));
		approvalCustomerOriginTDecorationVO.setCustomerOrigin(customerOriginVO);

		BeanUtil.copyProperties(approvalCustomerOriginTDecorationPO.getSalesman(), approvalCustomerOriginTDecorationVO.getSalesman(), Arrays.asList("dept", "duty"));

		if (customerOriginPO.getDesigner() != null) {
			BeanUtil.copyProperties(approvalCustomerOriginTDecorationPO.getSalesman().getDept(), approvalCustomerOriginTDecorationVO.getSalesman().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(approvalCustomerOriginTDecorationPO.getSalesman().getDept().getFatherDept(), approvalCustomerOriginTDecorationVO.getSalesman().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		BeanUtil.copyPropertie(approvalCustomerOriginTDecorationPO, approvalCustomerOriginTDecorationVO, Arrays.asList("customerOrigin", "salesman"));

		return approvalCustomerOriginTDecorationVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForCustomerOriginTDecoration(ApprovalVO approvalVO, ApprovalCustomerOriginTDecorationVO approvalCustomerOriginTDecorationVO, String userId, int company) throws FLException {

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT);

		Long csid = approvalCustomerOriginTDecorationVO.getCustomerOrigin().getCsid();

		CustomerOriginPO customerOriginPO = customerOriginDao.get(csid);

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT, String.valueOf(csid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		DecorationPO decorationPO = decorationService.checkOverDecoration(customerOriginPO.getHouse().getHid(), company);

		if (decorationPO != null) {
			throw new FLException(140063, String.format("装修单存在,装修单号:%s,设计师:%s", decorationPO.getOrderId(), decorationPO.getDesigner().getCurrentName()));
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		approvalPO = new ApprovalPO().init(sender, receiver, String.valueOf(csid), ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT, "", company);

		approvalDao.save(approvalPO);

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = new ApprovalCustomerOriginTDecorationPO();

		BeanUtil.copyPropertie(approvalCustomerOriginTDecorationVO, approvalCustomerOriginTDecorationPO, Arrays.asList("customerOrigin", "salesman"));

		approvalCustomerOriginTDecorationPO.setAid(approvalPO.getAid());
		approvalCustomerOriginTDecorationPO.setCustomerOrigin(new CustomerOriginPO(csid));

		UserPO salesman = userDao.queryUserByUserId(approvalCustomerOriginTDecorationVO.getSalesman().getUserId());

		approvalCustomerOriginTDecorationPO.setSalesman(salesman);

		approvalCustomerOriginTDecorationDao.save(approvalCustomerOriginTDecorationPO);

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_APPROVE_INT);

		customerOriginDao.update(customerOriginPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approvalForApprovalForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = approvalCustomerOriginTDecorationDao.queryCustomerOriginTDecorationByAid(approvalPO.getAid());

		if (approvalCustomerOriginTDecorationPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = approvalCustomerOriginTDecorationPO.getCustomerOrigin();

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		DecorationVO decorationVO = new DecorationVO();

		BeanUtil.copyPropertie(approvalCustomerOriginTDecorationPO, decorationVO, Arrays.asList("customerOrigin", "salesman"));

		decorationVO.setHouse(new HouseVO(customerOriginPO.getHouse().getHid()));
		decorationVO.setCustomer(new CustomerVO(customerOriginPO.getCustomer().getCid()));
		decorationVO.setDesigner(new UserBaseVO(customerOriginPO.getDesigner().getUserId()));
		decorationVO.setSalesman(new UserBaseVO(approvalCustomerOriginTDecorationPO.getSalesman().getUserId()));
		decorationVO.setGrade("B");

		decorationService.tranDecorationFromCustomerOrigin(decorationVO, customerOriginPO.getCsid(), approvalPO.getReceiver().getCompany());

		String content = String.format("客源转装修单成功,客户名:%s,楼盘:%s,电话:%s,装修单号:%s", customerOriginPO.getName(), customerOriginPO.getHouse().getVillage().getName(), customerOriginPO.getPhone(), customerOriginPO.getOrderId());

		UserPO designer = customerOriginPO.getDesigner();

		messageService.sendMessage(designer.getUserId(), null, content, MessagePO.TYPE_SEND_APPROVAL_INT, designer.getCompany());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForApprovalForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = approvalCustomerOriginTDecorationDao.queryCustomerOriginTDecorationByAid(approvalPO.getAid());

		if (approvalCustomerOriginTDecorationPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = approvalCustomerOriginTDecorationPO.getCustomerOrigin();

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_REFUSE_INT);

		customerOriginDao.update(customerOriginPO);

		return 0;
	}

}
