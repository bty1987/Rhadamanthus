/**
 * @File Name		: ApprovalCustomerOriginTDecorationBelongServiceImpl.java
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
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalCustomerOriginTDecorationBelongDao;
import com.fanglin.approval.po.ApprovalCustomerOriginTDecorationBelongPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCustomerOriginTDecorationBelongService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerOriginDao;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Service("approvalCustomerOriginTDecorationBelongService")
@Transactional(readOnly = true)
public class ApprovalCustomerOriginTDecorationBelongServiceImpl implements ApprovalCustomerOriginTDecorationBelongService {

	@Autowired
	private ApprovalCustomerOriginTDecorationBelongDao approvalCustomerOriginTDecorationBelongDao;

	@Autowired
	private CustomerOriginDao customerOriginDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationBelongDao decorationBelongDao;
	
	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approvalForApprovalForCustomerOriginTDecorationBelong(ApprovalPO approvalPO) throws FLException {

		ApprovalCustomerOriginTDecorationBelongPO approvalCustomerOriginTDecorationBelongPO = approvalCustomerOriginTDecorationBelongDao.queryApprovalCustomerOriginTDecorationBelongByAid(approvalPO.getAid());

		if(approvalCustomerOriginTDecorationBelongPO == null){
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.get(approvalCustomerOriginTDecorationBelongPO.getCsid());

		if(customerOriginPO == null){
			throw new FLException(330001, "客源不存在");
		}

		String orderId = customerOriginPO.getOrderId();

		UserPO operater = approvalPO.getReceiver();
		UserPO designer = customerOriginPO.getDesigner();
		UserPO salesman = customerOriginPO.getBelonger();

		// 更新装修单设计/业务 , 更新量尺时间
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		List<Short> status = Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT);
		
		if(!status.contains(decorationPO.getStatus())){
			throw new FLException(140004, "装修单状态不可操作");
		}
		
		decorationPO.setDesigner(designer);
		decorationPO.setSalesman(salesman);
		decorationPO.setMeasureTime(DateUtil.getDateToTimestamp(new Date()));

		decorationDao.update(decorationPO);

		// 更改装修单归属信息
		decorationBelongDao.updateDecorationBelongStatusByOrderId(customerOriginPO.getOrderId(), DecorationBelongPO.STATUS_EFFCTIVE_INT);

		decorationBelongDao.save(new DecorationBelongPO().designer(orderId, designer, operater));
		decorationBelongDao.save(new DecorationBelongPO().salesman(orderId, salesman, operater));

		// 更新装修单附加信息
		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(decorationPO.getOrderId());

		decorationAdditionPO.setSales(salesman.getCurrentName(), salesman.getDept().getName(), salesman.getDept().getFatherDept().getName());
		decorationAdditionPO.setDesign(designer.getCurrentName(), designer.getDept().getName(), designer.getDept().getFatherDept().getName());

		decorationAdditionDao.update(decorationAdditionPO);
		
		// 更新客源状态
		customerOriginPO.setStatus(CustomerOriginPO.STATUS_CREATE_INT);

		customerOriginDao.update(customerOriginPO);

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForApprovalForCustomerOriginTDecorationBelong(ApprovalPO approvalPO) throws FLException {
		
		ApprovalCustomerOriginTDecorationBelongPO approvalCustomerOriginTDecorationBelongPO = approvalCustomerOriginTDecorationBelongDao.queryApprovalCustomerOriginTDecorationBelongByAid(approvalPO.getAid());

		if(approvalCustomerOriginTDecorationBelongPO == null){
			throw new FLException(240001, "审批信息不存在");
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.get(approvalCustomerOriginTDecorationBelongPO.getCsid());

		if(customerOriginPO == null){
			throw new FLException(330001, "客源不存在");
		}
		
		customerOriginPO.setStatus(CustomerOriginPO.STATUS_INVALID_INT);
		
		customerOriginDao.update(customerOriginPO);
		
		return 0;
	}

}
