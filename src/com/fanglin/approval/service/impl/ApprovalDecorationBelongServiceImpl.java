/**
 * @File Name		: ApprovalDecorationBelongServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-13
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

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalDecorationBelongDao;
import com.fanglin.approval.dao.ApprovalDecorationBelongItemDao;
import com.fanglin.approval.po.ApprovalDecorationBelongItemPO;
import com.fanglin.approval.po.ApprovalDecorationBelongPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalDecorationBelongService;
import com.fanglin.approval.vo.ApprovalDecorationBelongItemVO;
import com.fanglin.approval.vo.ApprovalDecorationBelongVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalDecorationBelongService")
@Transactional(readOnly=true)
public class ApprovalDecorationBelongServiceImpl implements ApprovalDecorationBelongService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalDecorationBelongDao approvalDecorationBelongDao;
	
	@Autowired
	private ApprovalDecorationBelongItemDao approvalDecorationBelongItemDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private DecorationBelongDao decorationBelongDao;
	
	@Autowired
	private DecorationOperateDao decorationOperateDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private MessageService messageService;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForDecorationBelong(ApprovalVO approvalVO, ApprovalDecorationBelongVO approvalDecorationBelongVO, List<ApprovalDecorationBelongItemVO> approvalDecorationBelongItemVOs, String userId, int company) throws FLException {
		
		StringBuffer oldBelongUserName = new StringBuffer();
		StringBuffer oldBelongRate = new StringBuffer();
		StringBuffer newBelongUserName = new StringBuffer();
		StringBuffer newBelongRate = new StringBuffer();
		
		float rateCount = 0f;
		int defaultCount = 0;
		
		String orderId = approvalDecorationBelongVO.getOrderId();
		Short belongType = approvalDecorationBelongVO.getBelongType();
		
		ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT,ApprovalPO.APPROVAL_TYPE_ORDER_BELONG_INT, orderId);
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
 		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		List<Short> unstatus = Arrays.asList(new Short[]{DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_RESIGNED_INT});
		List<Short> belongTypes = Arrays.asList(new Short[]{DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.BELONGTYPE_SALESMAN_INT});
		
		if(!unstatus.contains(decorationPO.getStatus())){
			throw new FLException(140011, "订单已签订不可修改归属信息");
		}
		
		if(!belongTypes.contains(belongType)){
			throw new FLException(140014, "订单归属类型错误");
		}
		
		List<DecorationBelongPO> decorationBelongPOs = decorationBelongDao.queryOrderBelongInfoByOrderIdAType(orderId, belongType);
		
		for(DecorationBelongPO decorationBelongPO: decorationBelongPOs){
			UserPO belongUserPO = decorationBelongPO.getBelonger();
			
			oldBelongUserName.append(belongUserPO.getCurrentName());
			oldBelongUserName.append(",");
			
			oldBelongRate.append(decorationBelongPO.getRate());
			oldBelongRate.append(",");
		}
		
		for(ApprovalDecorationBelongItemVO approvalDecorationBelongItemVO: approvalDecorationBelongItemVOs){
			
			UserPO userPO = userDao.queryUserByUserId(approvalDecorationBelongItemVO.getUserId());
			
			if(userPO == null){
				throw new FLException(190005 , "人员不存在");
			}
			
			newBelongUserName.append(userPO.getCurrentName());
			newBelongUserName.append(",");
			
			newBelongRate.append(approvalDecorationBelongItemVO.getRate());
			newBelongRate.append(",");
			
			rateCount = Arith.add(rateCount, approvalDecorationBelongItemVO.getRate());
			
			if(DecorationBelongPO.DEFAULTFLAG_TRUE_INT == approvalDecorationBelongItemVO.getDefaultFlag()){
				defaultCount++;
			}
		}
		
		if(rateCount != 1f){
			throw new FLException(140016, "订单归属人员比例和不为1");
		}
		
		if(defaultCount != 1){
			throw new FLException(140017, "订单归属需一个默认人员");
		}
		
		approvalPO = new ApprovalPO();
		
		BeanUtil.copyProperties(approvalVO, approvalPO,Arrays.asList("receiver","sender"));
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_ORDER_BELONG_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(orderId);
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_ORDER_BELONG_STR, orderId, approvalDecorationBelongVO.getBelongType(), oldBelongUserName.toString(), oldBelongRate.toString(), newBelongUserName.toString(), newBelongRate.toString()));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);
		
		ApprovalDecorationBelongPO approvalDecorationBelongPO = new ApprovalDecorationBelongPO();
		BeanUtil.copyProperties(approvalDecorationBelongVO, approvalDecorationBelongPO);
		approvalDecorationBelongPO.setAid(approvalPO.getAid());
		
		approvalDecorationBelongDao.save(approvalDecorationBelongPO);
		
		for(ApprovalDecorationBelongItemVO approvalDecorationBelongItemVO: approvalDecorationBelongItemVOs){
			
			ApprovalDecorationBelongItemPO approvalDecorationBelongItemPO = new ApprovalDecorationBelongItemPO();
			
			BeanUtil.copyProperties(approvalDecorationBelongItemVO, approvalDecorationBelongItemPO);
			
			approvalDecorationBelongItemPO.setBuid(userDao.queryUserByUserId(approvalDecorationBelongItemVO.getUserId()).getUid());
			approvalDecorationBelongItemPO.setAdbId(approvalDecorationBelongPO.getAdbId());
			
			approvalDecorationBelongItemDao.save(approvalDecorationBelongItemPO);
		}

		messageService.sendMessage(approvalPO.getReceiver().getUserId(),approvalPO.getSender().getUserId(),approvalPO.getContents(), MessagePO.MESSAGE_TYPE_SEND_APPROVAL_STR,company);	

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForDecorationBelong(ApprovalPO approvalPO) throws FLException {
		
		ApprovalDecorationBelongPO approvalDecorationBelongPO = approvalDecorationBelongDao.queryApprovalDecorationBelongByAId(approvalPO.getAid());
		
		if(approvalDecorationBelongPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		String orderId = approvalDecorationBelongPO.getOrderId();
		Short belongType = approvalDecorationBelongPO.getBelongType();
		Short reverseType = DecorationBelongPO.BELONGTYPE_DESIGN_INT == belongType ? DecorationBelongPO.BELONGTYPE_SALESMAN_INT : DecorationBelongPO.BELONGTYPE_DESIGN_INT;
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		List<DecorationBelongPO> orderBelongInfoPOs = decorationBelongDao.queryOrderBelongInfoForCurrentByOrderIdAType(orderId, belongType);
		List<DecorationBelongPO> reverseBelongInfoPOs = decorationBelongDao.queryOrderBelongInfoForCurrentByOrderIdAType(orderId, reverseType);
		
		for(DecorationBelongPO orderBelongInfoPO: orderBelongInfoPOs){
			orderBelongInfoPO.setStatus(DecorationBelongPO.STATUS_EFFCTIVE_INT);
			decorationBelongDao.update(orderBelongInfoPO);
			
			for(DecorationBelongPO reverseBelongInfoPO: reverseBelongInfoPOs){
				
				DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
				
				decorationOperatePO.setOrderId(decorationPO.getOrderId());
				decorationOperatePO.setDsuid(reverseBelongInfoPO.getBelonger().getUid());
				decorationOperatePO.setDsrid(orderBelongInfoPO.getBelonger().getUid());
				
				decorationOperatePO.setOperater(approvalPO.getReceiver());
				decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
				decorationOperatePO.setType(DecorationBelongPO.BELONGTYPE_DESIGN_INT == belongType ? DecorationOperatePO.TYPE_DESIGNER_DECORATION_ORDER_INT : DecorationOperatePO.TYPE_SALESMAN_DECORATION_ORDER_INT);
				decorationOperatePO.setValue(Arith.mul(reverseBelongInfoPO.getRate(), Arith.sub(0f, orderBelongInfoPO.getRate())));
				decorationOperatePO.setStatus(DecorationOperatePO.STATUS_DISABLED_INT);
				decorationOperatePO.setComment("订单归属");
				decorationOperateDao.save(decorationOperatePO);
			}
		}
		
		List<ApprovalDecorationBelongItemPO> approvalDecorationBelongItemPOs = approvalDecorationBelongItemDao.queryApprovalDecorationBelongItemByAobId(approvalDecorationBelongPO.getAdbId());
		for(ApprovalDecorationBelongItemPO approvalDecorationBelongItemPO: approvalDecorationBelongItemPOs){
			
			UserPO userPO = userDao.get(approvalDecorationBelongItemPO.getbuid());
			
			if(userPO == null){
				throw new FLException(190005 , "人员不存在");
			}
			
			DecorationBelongPO decorationBelongPO = new DecorationBelongPO();
			decorationBelongPO.setDepartment(userPO.getDept());
			if(userPO.getDept().getFatherDept() != null){
				decorationBelongPO.setRegion(userPO.getDept().getFatherDept());
			}
			
			if(DecorationBelongPO.DEFAULTFLAG_TRUE_INT.equals(approvalDecorationBelongItemPO.getDefaultFlag())){
				if(DecorationBelongPO.BELONGTYPE_DESIGN_INT == belongType){
					decorationPO.setDesigner(userPO);
				}else if(DecorationBelongPO.BELONGTYPE_SALESMAN_INT == belongType){
					decorationPO.setSalesman(userPO);
				}
			}
			decorationBelongPO.setOrderId(decorationPO.getOrderId());
			decorationBelongPO.setBelonger(userPO);
			decorationBelongPO.setRate(approvalDecorationBelongItemPO.getRate());
			decorationBelongPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			decorationBelongPO.setOperater(approvalPO.getReceiver());
			decorationBelongPO.setDefaultFlag(approvalDecorationBelongItemPO.getDefaultFlag());
			
			decorationBelongPO.setType(approvalDecorationBelongPO.getBelongType());
			decorationBelongPO.setStatus(DecorationBelongPO.STATUS_INVALID_INT);
			
			decorationBelongDao.save(decorationBelongPO);
			
			for(DecorationBelongPO reverseBelongInfoPO: reverseBelongInfoPOs){
				
				DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
				
				decorationOperatePO.setOrderId(decorationPO.getOrderId());
				decorationOperatePO.setOperater(approvalPO.getReceiver());
				decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
				decorationOperatePO.setType(DecorationBelongPO.BELONGTYPE_DESIGN_INT == belongType ? DecorationOperatePO.TYPE_DESIGNER_DECORATION_ORDER_INT : DecorationOperatePO.TYPE_SALESMAN_DECORATION_ORDER_INT);
				decorationOperatePO.setValue(Arith.mul(reverseBelongInfoPO.getRate(), decorationBelongPO.getRate()));
				decorationOperatePO.setStatus(DecorationOperatePO.STATUS_DISABLED_INT);
				decorationOperatePO.setComment("订单归属");
				decorationOperateDao.save(decorationOperatePO);
			}
		}
		
		decorationPO.setMeasureTime(DateUtil.getDateToTimestamp(new Date()));
		
		decorationDao.update(decorationPO);
		
		return 0;
	}

}
