/**
 * @File Name		: ApprovalVillageServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalVillageDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalVillagePO;
import com.fanglin.approval.service.ApprovalVillageService;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.approval.vo.ApprovalVillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.VillageDao;
import com.fanglin.data.po.VillagePO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalVillageService")
@Transactional(readOnly=true)
public class ApprovalVillageServiceImpl implements ApprovalVillageService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalVillageDao approvalVillageDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private VillageDao villageDao;
	
	@Autowired
	private MessageService messageService;

	@Autowired
	private UserDao userDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForVillage(ApprovalVO approvalVO, ApprovalVillageVO approvalVillageVO, String userId, int company) throws FLException {
		
		String orderId = approvalVillageVO.getOrderId();
		String villageId = approvalVillageVO.getNewVillageId();
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_VILLAGE_INT, String.valueOf(approvalVillageVO.getOrderId()));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		VillagePO villagePO = villageDao.get(villageId);
		
		if(villagePO == null){
			throw new FLException(130003, "楼盘信息不存在");
		}
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiverId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_VILLAGE_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(orderId);
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_VILLAGE_STR, orderId, decorationOrderPO.getVillagePO().getVillageName(), decorationOrderPO.getHouseNumber(), villagePO.getVillageName(), approvalVillageVO.getNewHouseNumber()));
		approvalPO.setSender(sender);
		approvalPO.setReceiver(receiver);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);
		
		ApprovalVillagePO approvalVillagePO = new ApprovalVillagePO();
		BeanUtil.copyProperties(approvalVillageVO, approvalVillagePO);
		approvalVillagePO.setAid(approvalPO.getAid());
		approvalVillagePO.setOldVillageId(decorationOrderPO.getVillagePO().getVillageId());
		approvalVillagePO.setOldHouseNumber(decorationOrderPO.getHouseNumber());
		
		approvalVillageDao.save(approvalVillagePO);
		
		MessageVO messageVO = new MessageVO(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), MessagePO.MESSAGE_TYPE_APPROVAL_STR, "新增一条审批信息,请查收.");
		
		messageService.sendMessage(messageVO);
		
//		messageDDService.sendMessageForApproval(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserName(), approvalPO.getAid(), "订单楼盘信息修改审批", approvalPO.getContents());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForVillage(ApprovalPO approvalPO) throws FLException {
		
		ApprovalVillagePO approvalVillagePO = approvalVillageDao.queryApprovalVillageByAId(approvalPO.getAid());
		
		if(approvalVillagePO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(approvalVillagePO.getOrderId());
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		decorationOrderPO.setVillagePO(new VillagePO(approvalVillagePO.getNewVillageId()));
		decorationOrderPO.setHouseNumber(approvalVillagePO.getNewHouseNumber());
		
		decorationOrderDao.update(decorationOrderPO);
		
		return 0;
	}

}
