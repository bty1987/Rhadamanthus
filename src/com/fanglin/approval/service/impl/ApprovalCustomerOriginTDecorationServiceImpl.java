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

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalCustomerOriginTDecorationBelongDao;
import com.fanglin.approval.dao.ApprovalCustomerOriginTDecorationDao;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationBelongPO;
import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCustomerOriginTDecorationService;
import com.fanglin.approval.vo.ApprovalCustomerOriginTDecorationVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerOriginDao;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.dingding.service.ApprovalService;
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
	private ApprovalCustomerOriginTDecorationBelongDao approvalCustomerOriginTDecorationBelongDao;

	@Autowired
	private ApprovalService approvalDDService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CustomerOriginDao customerOriginDao;

	@Autowired
	private DecorationService decorationService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForCustomerOriginTDecoration(String userId, String code, String forms, String approver, ApprovalCustomerOriginTDecorationVO approvalCustomerOriginTDecorationVO, int company) throws FLException {

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT);

		Long csid = approvalCustomerOriginTDecorationVO.getCsid();
		
		CustomerOriginPO customerOriginPO = customerOriginDao.get(csid);
		
		if(customerOriginPO == null){
			throw new FLException(330001, "客源不存在");
		}
		
		ApprovalPO approval = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT, String.valueOf(csid));

		if (approval != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		JSONArray form = JSONArray.parseArray(forms);

		UserPO userPO = userDao.queryUserByUserId(userId);

		String processinstanceid = approvalDDService.initiateApproval(code, userId, approver, null, null, form, company);

		ApprovalPO approvalPO = new ApprovalPO();

		approvalPO.setSender(userPO);
		approvalPO.setIdent(String.valueOf(approvalCustomerOriginTDecorationVO.getCsid()));
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_APPROVE_INT);
		approvalPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		approvalPO.setProcessinstanceid(processinstanceid);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = new ApprovalCustomerOriginTDecorationPO();

		BeanUtil.copyPropertie(approvalCustomerOriginTDecorationVO, approvalCustomerOriginTDecorationPO);

		approvalCustomerOriginTDecorationPO.setAid(approvalPO.getAid());
		approvalCustomerOriginTDecorationPO.setCode(code);
		approvalCustomerOriginTDecorationPO.setForms(forms);

		approvalCustomerOriginTDecorationDao.save(approvalCustomerOriginTDecorationPO);
		
		customerOriginPO.setStatus(CustomerOriginPO.STATUS_APPROVE_INT);
		
		customerOriginDao.update(customerOriginPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approvalForApprovalForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = approvalCustomerOriginTDecorationDao.queryCustomerOriginTDecorationByAid(approvalPO.getAid());

		if(approvalCustomerOriginTDecorationPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.get(approvalCustomerOriginTDecorationPO.getCsid());

		if(customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}
		
		UserBaseVO UserDesinger = new UserBaseVO();
		UserDesinger.setUserId(customerOriginPO.getDesigner().getUserId());

		UserBaseVO UserSalesman = new UserBaseVO();
		UserSalesman.setUserId(customerOriginPO.getBelonger().getUserId());

		CustomerVO customerVO = new CustomerVO();
		customerVO.setCid(customerOriginPO.getCid());

		HouseVO houseVO = new HouseVO();
		houseVO.setHid(customerOriginPO.getHid());

		DecorationVO decorationVO = new DecorationVO();

		BeanUtil.copyPropertie(approvalCustomerOriginTDecorationPO, decorationVO);

		decorationVO.setHouse(new HouseVO(customerOriginPO.getHid()));
		decorationVO.setCustomer(new CustomerVO(customerOriginPO.getCid()));
		decorationVO.setDesigner(new UserBaseVO(customerOriginPO.getDesigner().getUserId()));
		decorationVO.setSalesman(new UserBaseVO(customerOriginPO.getBelonger().getUserId()));
		decorationVO.setGrade("B");

		String approver = decorationService.tranDecorationFromCustomerOrigin(decorationVO, customerOriginPO.getCsid(), approvalPO.getReceiver().getCompany());

		UserPO receiver = approvalPO.getReceiver();

		if (approver != null && !"".equals(approver)) {

			String code = approvalCustomerOriginTDecorationPO.getCode();
			JSONArray forms = JSONArray.parseArray(approvalCustomerOriginTDecorationPO.getForms());

			String processinstanceid = approvalDDService.initiateApproval(code, receiver.getUserId(), approver, null, null, forms, receiver.getCompany());

			ApprovalPO _approvalPO = new ApprovalPO();

			_approvalPO.setSender(receiver);
			_approvalPO.setIdent(String.valueOf(approvalCustomerOriginTDecorationPO.getCsid()));
			_approvalPO.setType(ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_BELONG_INT);
			_approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_APPROVE_INT);
			_approvalPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			_approvalPO.setProcessinstanceid(processinstanceid);
			_approvalPO.setCompany(receiver.getCompany());
			
			approvalDao.save(_approvalPO);

			ApprovalCustomerOriginTDecorationBelongPO approvalCustomerOriginTDecorationBelongPO = new ApprovalCustomerOriginTDecorationBelongPO();

			approvalCustomerOriginTDecorationBelongPO.setAid(_approvalPO.getAid());
			approvalCustomerOriginTDecorationBelongPO.setCsid(approvalCustomerOriginTDecorationPO.getCsid());

			approvalCustomerOriginTDecorationBelongDao.save(approvalCustomerOriginTDecorationBelongPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForApprovalForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException {
		
		ApprovalCustomerOriginTDecorationPO approvalCustomerOriginTDecorationPO = approvalCustomerOriginTDecorationDao.queryCustomerOriginTDecorationByAid(approvalPO.getAid());

		if(approvalCustomerOriginTDecorationPO == null){
			throw new FLException(240001, "审批信息不存在");
		}
		
		CustomerOriginPO customerOriginPO = customerOriginDao.get(approvalCustomerOriginTDecorationPO.getCsid());

		if(customerOriginPO == null){
			throw new FLException(330001, "客源不存在");
		}
		
		customerOriginPO.setStatus(CustomerOriginPO.STATUS_INVALID_INT);
		
		customerOriginDao.update(customerOriginPO);

		return 0;
	}

}
