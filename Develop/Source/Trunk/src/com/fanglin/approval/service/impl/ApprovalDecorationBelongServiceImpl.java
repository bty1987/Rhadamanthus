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
import com.fanglin.decoration.po.DecorationBelongInfoPO;
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
	private DecorationBelongDao orderBelongInfoDao;
	
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
		String belongType = approvalDecorationBelongVO.getBelongType();
		
		ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT,ApprovalPO.APPROVAL_TYPE_ORDER_BELONG_INT, orderId);
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		List<String> unstatus = Arrays.asList(new String[]{DecorationPO.STATUS_INIT_STR, DecorationPO.STATUS_QUOTATION_STR, DecorationPO.STATUS_DEPOSIT_STR, DecorationPO.STATUS_RESIGNED_STR});
		List<String> belongTypes = Arrays.asList(new String[]{DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR, DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR});
		
		if(!unstatus.contains(decorationPO.getStatus())){
			throw new FLException(140011, "订单已签订不可修改归属信息");
		}
		
		if(!belongTypes.contains(belongType)){
			throw new FLException(140014, "订单归属类型错误");
		}
		
		List<DecorationBelongInfoPO> orderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(orderId, belongType);
		
		for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
			UserPO belongUserPO = orderBelongInfoPO.getBelongUserPO();
			
			oldBelongUserName.append(belongUserPO.getCurrentName());
			oldBelongUserName.append(",");
			
			oldBelongRate.append(orderBelongInfoPO.getBelongRate());
			oldBelongRate.append(",");
		}
		
		for(ApprovalDecorationBelongItemVO approvalDecorationBelongItemVO: approvalDecorationBelongItemVOs){
			UserPO userPO = userDao.queryUserByUserId(approvalDecorationBelongItemVO.getBelongUserId());
			
			if(userPO == null){
				throw new FLException(190005 , "人员不存在");
			}
			
			newBelongUserName.append(userPO.getCurrentName());
			newBelongUserName.append(",");
			
			newBelongRate.append(approvalDecorationBelongItemVO.getBelongRate());
			newBelongRate.append(",");
			
			rateCount = Arith.add(rateCount, approvalDecorationBelongItemVO.getBelongRate());
			
			if(DecorationBelongInfoPO.DEFAULTFLAG_TRUE_STR.equals(approvalDecorationBelongItemVO.getDefaultFlag())){
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
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiverId());
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
		
		String defaultUser = "";
		String orderId = approvalDecorationBelongPO.getOrderId();
		String belongType = approvalDecorationBelongPO.getBelongType();
		String reverseType = DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(belongType) ? DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR : DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR;
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		List<DecorationBelongInfoPO> orderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(orderId, belongType);
		List<DecorationBelongInfoPO> reverseBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(orderId, reverseType);
		
		for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
			orderBelongInfoPO.setStatus(DecorationBelongInfoPO.STATUS_REPLACE_STR);
			orderBelongInfoDao.update(orderBelongInfoPO);
			
			for(DecorationBelongInfoPO reverseBelongInfoPO: reverseBelongInfoPOs){
				
				DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
				
				decorationOperatePO.setDecoration(decorationPO);
				decorationOperatePO.setSourcer(reverseBelongInfoPO.getBelongUserPO());
				decorationOperatePO.setTarger(orderBelongInfoPO.getBelongUserPO());
				decorationOperatePO.setOperater(approvalPO.getReceiver());
				decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
				decorationOperatePO.setType(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(belongType) ? DecorationOperatePO.TYPE_DESIGNER_DECORATION_ORDER_INT : DecorationOperatePO.TYPE_SALESMAN_DECORATION_ORDER_INT);
				decorationOperatePO.setValue(Arith.mul(reverseBelongInfoPO.getBelongRate(), Arith.sub(0f, orderBelongInfoPO.getBelongRate())));
				decorationOperatePO.setStatus(DecorationOperatePO.STATUS_DISABLED_INT);
				decorationOperatePO.setDes("订单归属");
				
				decorationOperateDao.save(decorationOperatePO);
			}
		}
		
		List<ApprovalDecorationBelongItemPO> approvalDecorationBelongItemPOs = approvalDecorationBelongItemDao.queryApprovalDecorationBelongItemByAobId(approvalDecorationBelongPO.getAdbId());
		for(ApprovalDecorationBelongItemPO approvalDecorationBelongItemPO: approvalDecorationBelongItemPOs){
			UserPO userPO = userDao.queryUserByUserId(approvalDecorationBelongItemPO.getBelongUserId());
			
			if(userPO == null){
				throw new FLException(190005 , "人员不存在");
			}
			
			DecorationBelongInfoPO orderBelongInfoPO = new DecorationBelongInfoPO();
			orderBelongInfoPO.setBelongDeptPO(userPO.getDept());
			if(userPO.getDept().getFatherDept() != null){
				orderBelongInfoPO.setBelongRegionPO(userPO.getDept().getFatherDept());
			}
			
			if(DecorationBelongInfoPO.DEFAULTFLAG_TRUE_STR.equals(approvalDecorationBelongItemPO.getDefaultFlag())){
				defaultUser = approvalDecorationBelongItemPO.getBelongUserId();
				
			}
			
			orderBelongInfoPO.setBelongUserPO(userPO);
			orderBelongInfoPO.setBelongRate(approvalDecorationBelongItemPO.getBelongRate());
			orderBelongInfoPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			orderBelongInfoPO.setOperateUserPO(approvalPO.getReceiver());
			orderBelongInfoPO.setChangeReason(orderBelongInfoPO.getChangeReason());
			orderBelongInfoPO.setDecorationPO(decorationPO);
			orderBelongInfoPO.setDefaultFlag(approvalDecorationBelongItemPO.getDefaultFlag());
			
			orderBelongInfoPO.setBelongType(approvalDecorationBelongPO.getBelongType());
			orderBelongInfoPO.setStatus(DecorationBelongInfoPO.STATUS_PASS_STR);
			orderBelongInfoDao.save(orderBelongInfoPO);
			
			for(DecorationBelongInfoPO reverseBelongInfoPO: reverseBelongInfoPOs){
				
				DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
				
				decorationOperatePO.setDecoration(decorationPO);
				decorationOperatePO.setSourcer(reverseBelongInfoPO.getBelongUserPO());
				decorationOperatePO.setTarger(orderBelongInfoPO.getBelongUserPO());
				decorationOperatePO.setOperater(approvalPO.getReceiver());
				decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
				decorationOperatePO.setType(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(belongType) ? DecorationOperatePO.TYPE_DESIGNER_DECORATION_ORDER_INT : DecorationOperatePO.TYPE_SALESMAN_DECORATION_ORDER_INT);
				decorationOperatePO.setValue(Arith.mul(reverseBelongInfoPO.getBelongRate(), orderBelongInfoPO.getBelongRate()));
				decorationOperatePO.setStatus(DecorationOperatePO.STATUS_DISABLED_INT);
				decorationOperatePO.setDes("订单归属");
				
				decorationOperateDao.save(decorationOperatePO);
			}
		}
		 UserPO attribution = userDao.queryUserByUserId(defaultUser);
		if(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(belongType)){
			decorationPO.setDesigner(attribution);
			
		}else{
			decorationPO.setSalesman(attribution);
		}
		
		decorationPO.setMeasureTime(DateUtil.getDateToTimestamp(new Date()));
		
		decorationDao.update(decorationPO);
		
		return 0;
	}

}
