/**
 * @File Name		: ApprovalActivityServiceImpl.java
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
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalActivityDao;
import com.fanglin.approval.dao.ApprovalActivityItemDao;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalActivityItemPO;
import com.fanglin.approval.po.ApprovalActivityPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalActivityService;
import com.fanglin.approval.vo.ApprovalActivityItemVO;
import com.fanglin.approval.vo.ApprovalActivityVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalActivityService")
@Transactional(readOnly=true)
public class ApprovalActivityServiceImpl implements ApprovalActivityService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalActivityDao approvalActivityDao;
	
	@Autowired
	private ApprovalActivityItemDao approvalActivityItemDao;
	
	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForDecorationActivity(ApprovalVO approvalVO, ApprovalActivityVO approvalActivityVO, List<ApprovalActivityItemVO> approvalActivityItemVOs, String userId) throws FLException {
		
		String orderId = approvalActivityVO.getOrderId();
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_DECORATION_ACTIVITY_INT, orderId);
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiverId());
		UserPO sender = userDao.queryUserByUserId(userId);

		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_DECORATION_ACTIVITY_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(orderId);
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_DECORATION_ACTIVITY_STR, approvalActivityVO.getOrderId(), approvalActivityVO.getActivityName()));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		
		approvalDao.save(approvalPO);
		
		ApprovalActivityPO approvalActivityPO = new ApprovalActivityPO();
		BeanUtil.copyProperties(approvalActivityVO, approvalActivityPO);
		
		approvalActivityPO.setAid(approvalPO.getAid());
		
		approvalActivityDao.save(approvalActivityPO);
		
		for(ApprovalActivityItemVO approvalActivityItemVO: approvalActivityItemVOs){
			ApprovalActivityItemPO approvalActivityItemPO = new ApprovalActivityItemPO();
			BeanUtil.copyProperties(approvalActivityItemVO, approvalActivityItemPO);
			
			approvalActivityItemPO.setAaId(approvalActivityPO.getAaId());
			
			approvalActivityItemDao.save(approvalActivityItemPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForDecorationActivity(ApprovalPO approvalPO) throws FLException {
		
		ApprovalActivityPO approvalActivityPO = approvalActivityDao.queryApprovalActivityByAId(approvalPO.getAid());
		
		if(approvalActivityPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		List<ApprovalActivityItemPO> approvalActivityItemPOs = approvalActivityItemDao.queryApprovalActivityItemByAaId(approvalActivityPO.getAaId());
		
		for(ApprovalActivityItemPO approvalActivityItemPO: approvalActivityItemPOs){
			DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();
			BeanUtil.copyProperties(approvalActivityItemPO, decorationActivityItemPO);
			
			decorationActivityItemPO.setAid(approvalActivityPO.getActivityId());
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_VAILD_INT);
			decorationActivityItemPO.setTotal(approvalActivityItemPO.getNum());
			decorationActivityItemPO.setReceiveUserId("");
			decorationActivityItemPO.setReceiveUserName("");
			
			decorationActivityItemDao.save(decorationActivityItemPO);
		}
		
		return 0;
	}

}
