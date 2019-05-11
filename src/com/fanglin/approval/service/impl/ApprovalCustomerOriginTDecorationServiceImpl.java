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
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerOriginDao;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
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
	private DecorationService decorationService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForCustomerOriginTDecoration(ApprovalVO approvalVO, ApprovalCustomerOriginTDecorationVO approvalCustomerOriginTDecorationVO, String userId, int company) throws FLException {


		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT);

		Long csid = approvalCustomerOriginTDecorationVO.getCsid();

		CustomerOriginPO customerOriginPO = customerOriginDao.get(csid);

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT, String.valueOf(csid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		approvalPO = new ApprovalPO().init(sender, receiver, String.valueOf(approvalCustomerOriginTDecorationVO.getCsid()), ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT, "", company);

		approvalDao.save(approvalPO);

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = new ApprovalCustomerOriginTDecorationPO();

		BeanUtil.copyPropertie(approvalCustomerOriginTDecorationVO, approvalCustomerOriginTDecorationPO);
		
		approvalCustomerOriginTDecorationPO.setAid(approvalPO.getAid());

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

		CustomerOriginPO customerOriginPO = customerOriginDao.get(approvalCustomerOriginTDecorationPO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		DecorationVO decorationVO = new DecorationVO();

		BeanUtil.copyPropertie(approvalCustomerOriginTDecorationPO, decorationVO);

		decorationVO.setHouse(new HouseVO(customerOriginPO.getHid()));
		decorationVO.setCustomer(new CustomerVO(customerOriginPO.getCid()));
		decorationVO.setDesigner(new UserBaseVO(customerOriginPO.getDesigner().getUserId()));
		decorationVO.setSalesman(new UserBaseVO(customerOriginPO.getBelonger().getUserId()));
		decorationVO.setGrade("B");

		String orderId = decorationService.tranDecorationFromCustomerOrigin(decorationVO, customerOriginPO.getCsid(), approvalPO.getReceiver().getCompany());
		
		if(orderId != null){
			approvalPO.setContents(String.format("装修单(%s)已存在", orderId));
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForApprovalForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = approvalCustomerOriginTDecorationDao.queryCustomerOriginTDecorationByAid(approvalPO.getAid());

		if (approvalCustomerOriginTDecorationPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.get(approvalCustomerOriginTDecorationPO.getCsid());

		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		customerOriginPO.setStatus(CustomerOriginPO.STATUS_INVALID_INT);

		customerOriginDao.update(customerOriginPO);

		return 0;
	}

}
