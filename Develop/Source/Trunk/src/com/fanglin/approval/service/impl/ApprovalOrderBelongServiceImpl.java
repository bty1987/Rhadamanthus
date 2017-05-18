/**
 * @File Name		: ApprovalOrderBelongServiceImpl.java
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
import com.fanglin.approval.dao.ApprovalOrderBelongDao;
import com.fanglin.approval.dao.ApprovalOrderBelongItemDao;
import com.fanglin.approval.po.ApprovalOrderBelongItemPO;
import com.fanglin.approval.po.ApprovalOrderBelongPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalOrderBelongService;
import com.fanglin.approval.vo.ApprovalOrderBelongItemVO;
import com.fanglin.approval.vo.ApprovalOrderBelongVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.po.DecorationBelongInfoPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalOrderBelongService")
@Transactional(readOnly=true)
public class ApprovalOrderBelongServiceImpl implements ApprovalOrderBelongService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalOrderBelongDao approvalOrderBelongDao;
	
	@Autowired
	private ApprovalOrderBelongItemDao approvalOrderBelongItemDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
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
	public int submitApprovalForOrderBelong(ApprovalVO approvalVO, ApprovalOrderBelongVO approvalOrderBelongVO, List<ApprovalOrderBelongItemVO> approvalOrderBelongItemVOs, String userId) throws FLException {
		
		StringBuffer oldBelongUserName = new StringBuffer();
		StringBuffer oldBelongRate = new StringBuffer();
		StringBuffer newBelongUserName = new StringBuffer();
		StringBuffer newBelongRate = new StringBuffer();
		
		Float rateCount = 0f;
		int defaultCount = 0;
		
		String orderId = approvalOrderBelongVO.getOrderId();
		String belongType = approvalOrderBelongVO.getBelongType();
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_ORDER_BELONG_INT, orderId);
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		List<String> unstatus = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_QUOTATION_STR, DecorationOrderPO.STATUS_DEPOSIT_STR, DecorationOrderPO.STATUS_RESIGNED_STR});
		List<String> belongTypes = Arrays.asList(new String[]{DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR, DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR});
		
		if(!unstatus.contains(decorationOrderPO.getStatus())){
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
		
		for(ApprovalOrderBelongItemVO approvalOrderBelongItemVO: approvalOrderBelongItemVOs){
			UserPO userPO = userDao.get(approvalOrderBelongItemVO.getBelongUserId());
			
			if(userPO == null){
				throw new FLException(220005, "员工不存在");
			}
			
			if(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(belongType) && !userPO.getDuty().contains("设计师")){
				throw new FLException(140015, "订单设计归属人员职位需为设计师");
			}
			
			newBelongUserName.append(userPO.getCurrentName());
			newBelongUserName.append(",");
			
			newBelongRate.append(approvalOrderBelongItemVO.getBelongRate());
			newBelongRate.append(",");

			rateCount = Arith.add(rateCount, approvalOrderBelongItemVO.getBelongRate());
			
			if(DecorationBelongInfoPO.DEFAULTFLAG_TRUE_STR.equals(approvalOrderBelongItemVO.getDefaultFlag())){
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
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_ORDER_BELONG_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(orderId);
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_ORDER_BELONG_STR, orderId, approvalOrderBelongVO.getBelongType(), oldBelongUserName.toString(), oldBelongRate.toString(), newBelongUserName.toString(), newBelongRate.toString()));
		approvalPO.setSender(new UserPO(userId));
		approvalPO.setReceiver(new UserPO(approvalVO.getReceiverId()));
		
		approvalDao.save(approvalPO);
		
		ApprovalOrderBelongPO approvalOrderBelongPO = new ApprovalOrderBelongPO();
		BeanUtil.copyProperties(approvalOrderBelongVO, approvalOrderBelongPO);
		approvalOrderBelongPO.setAid(approvalPO.getAid());
		
		approvalOrderBelongDao.save(approvalOrderBelongPO);
		
		for(ApprovalOrderBelongItemVO approvalOrderBelongItemVO: approvalOrderBelongItemVOs){
			ApprovalOrderBelongItemPO approvalOrderBelongItemPO = new ApprovalOrderBelongItemPO();
			BeanUtil.copyProperties(approvalOrderBelongItemVO, approvalOrderBelongItemPO);
			
			approvalOrderBelongItemPO.setAobId(approvalOrderBelongPO.getAobId());
			
			approvalOrderBelongItemDao.save(approvalOrderBelongItemPO);
		}
		
		MessageVO messageVO = new MessageVO(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), MessagePO.MESSAGE_TYPE_APPROVAL_STR, "新增一条审批信息,请查收.");
		
		messageService.sendMessage(messageVO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForOrderBelong(ApprovalPO approvalPO) throws FLException {
		
		ApprovalOrderBelongPO approvalOrderBelongPO = approvalOrderBelongDao.queryApprovalOrderBelongByAId(approvalPO.getAid());
		
		if(approvalOrderBelongPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		String defaultUser = "";
		String orderId = approvalOrderBelongPO.getOrderId();
		String belongType = approvalOrderBelongPO.getBelongType();
		String reverseType = DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(belongType) ? DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR : DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR;
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		List<DecorationBelongInfoPO> orderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(orderId, belongType);
		List<DecorationBelongInfoPO> reverseBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(orderId, reverseType);
		
		for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
			orderBelongInfoPO.setStatus(DecorationBelongInfoPO.STATUS_REPLACE_STR);
			orderBelongInfoDao.update(orderBelongInfoPO);
			
			for(DecorationBelongInfoPO reverseBelongInfoPO: reverseBelongInfoPOs){
				
				DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
				
				decorationOperatePO.setDecorationOrder(decorationOrderPO);
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
		
		List<ApprovalOrderBelongItemPO> approvalOrderBelongItemPOs = approvalOrderBelongItemDao.queryApprovalOrderBelongItemByAobId(approvalOrderBelongPO.getAobId());
		for(ApprovalOrderBelongItemPO approvalOrderBelongItemPO: approvalOrderBelongItemPOs){
			UserPO userPO = userDao.get(approvalOrderBelongItemPO.getBelongUserId());
			
			if(userPO == null){
				throw new FLException(220005, "员工不存在");
			}
			
			DecorationBelongInfoPO orderBelongInfoPO = new DecorationBelongInfoPO();
			orderBelongInfoPO.setBelongDeptPO(userPO.getDept());
			if(userPO.getDept().getFatherDept() != null){
				orderBelongInfoPO.setBelongRegionPO(userPO.getDept().getFatherDept());
			}
			
			if(DecorationBelongInfoPO.DEFAULTFLAG_TRUE_STR.equals(approvalOrderBelongItemPO.getDefaultFlag())){
				defaultUser = approvalOrderBelongItemPO.getBelongUserId();
			}
			
			orderBelongInfoPO.setBelongUserPO(userPO);
			orderBelongInfoPO.setBelongRate(approvalOrderBelongItemPO.getBelongRate());
			orderBelongInfoPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			orderBelongInfoPO.setOperateUserPO(approvalPO.getReceiver());
			orderBelongInfoPO.setChangeReason(orderBelongInfoPO.getChangeReason());
			orderBelongInfoPO.setDecorationOrderPO(decorationOrderPO);
			orderBelongInfoPO.setDefaultFlag(approvalOrderBelongItemPO.getDefaultFlag());
			
			orderBelongInfoPO.setBelongType(approvalOrderBelongPO.getBelongType());
			orderBelongInfoPO.setStatus(DecorationBelongInfoPO.STATUS_PASS_STR);
			orderBelongInfoDao.save(orderBelongInfoPO);
			
			for(DecorationBelongInfoPO reverseBelongInfoPO: reverseBelongInfoPOs){
				
				DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
				
				decorationOperatePO.setDecorationOrder(decorationOrderPO);
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
		
		if(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(belongType)){
			decorationOrderPO.setDesignerPO(new UserPO(defaultUser));
		}else{
			decorationOrderPO.setSalesmanPO(new UserPO(defaultUser));
		}
		
		decorationOrderPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		decorationOrderDao.update(decorationOrderPO);
		
		return 0;
	}

}
