/**
 * @File Name		: AprovalDecorationHouseServiceImpl.java
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
import com.fanglin.approval.dao.ApprovalDecorationHouseDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalDecorationHousePO;
import com.fanglin.approval.service.ApprovalDecorationHouseService;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.approval.vo.ApprovalDecorationHouseVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.HouseDao;
import com.fanglin.data.po.HousePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalDecorationHouseService")
@Transactional(readOnly=true)
public class ApprovalDecorationHouseServiceImpl implements ApprovalDecorationHouseService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalDecorationHouseDao approvalDecorationHouseDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private HouseDao houseDao;
	
	@Autowired
	private MessageService messageService;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalDecorationHouse(ApprovalVO approvalVO, ApprovalDecorationHouseVO aprovalDecorationHouseVO, String userId, int company) throws FLException {
		
		String orderId = aprovalDecorationHouseVO.getOrderId();
		long oldHouseId = aprovalDecorationHouseVO.getShid();
		long newHouseId = aprovalDecorationHouseVO.getThid();
		
		ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT,ApprovalPO.APPROVAL_TYPE_VILLAGE_INT, String.valueOf(aprovalDecorationHouseVO.getOrderId()));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
	
		HousePO oldhousePO = houseDao.get(oldHouseId);
		HousePO newhousePO = houseDao.get(newHouseId);
		
		if(oldhousePO == null && newhousePO == null){
			throw new FLException(320005, "房源不存在");
		}

		DecorationPO decorationPOs = decorationDao.queryDecorationByHid(newHouseId, company);
		if(decorationPOs != null){
			throw new FLException(320004, "房源已存在");//130019 房产已存在
		}
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiverId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_VILLAGE_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(orderId);
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_VILLAGE_STR, orderId, oldhousePO.getVillage().getName(), oldhousePO.getHouseNumber(), newhousePO.getVillage().getName(), newhousePO.getHouseNumber()));
		approvalPO.setSender(sender);
		approvalPO.setReceiver(receiver);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);
		
		ApprovalDecorationHousePO aprovalDecorationHousePO = new ApprovalDecorationHousePO();
		BeanUtil.copyProperties(aprovalDecorationHouseVO, aprovalDecorationHousePO);
		
		aprovalDecorationHousePO.setAid(approvalPO.getAid());
		
		approvalDecorationHouseDao.save(aprovalDecorationHousePO);
		
		messageService.sendMessage(approvalPO.getReceiver().getUserId(),approvalPO.getSender().getUserId(),approvalPO.getContents(), MessagePO.MESSAGE_TYPE_SEND_APPROVAL_STR,company);	
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalDecorationHouse(ApprovalPO approvalPO) throws FLException {
		
		ApprovalDecorationHousePO aprovalDecorationHousePO = approvalDecorationHouseDao.queryApprovalDecorationHouseByAId(approvalPO.getAid());
		
		if(aprovalDecorationHousePO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(aprovalDecorationHousePO.getOrderId());
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		long newHouseId = aprovalDecorationHousePO.getThid();
		HousePO newhousePO = houseDao.get(newHouseId);
		
		if(newhousePO == null){
			throw new FLException(320005, "房源不存在");
		}
		DecorationPO decorationPOs = decorationDao.queryDecorationByHid(newHouseId, approvalPO.getCompany());
		if(decorationPOs != null){
			throw new FLException(320004, "房源已存在");//130019 房产已存在
		}
		decorationPO.setHouse(newhousePO);
		
		decorationDao.update(decorationPO);
		
		return 0;
	}

}
