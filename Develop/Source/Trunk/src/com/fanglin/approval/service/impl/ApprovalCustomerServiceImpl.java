/**
 * @File Name		: ApprovalCustomerServiceImpl.java
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

import com.fanglin.approval.dao.ApprovalCustomerDao;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalCustomerPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCustomerService;
import com.fanglin.approval.vo.ApprovalCustomerVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.PinYin4Util;

@Service("approvalCustomerService")
@Transactional(readOnly=true)
public class ApprovalCustomerServiceImpl implements ApprovalCustomerService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalCustomerDao approvalCustomerDao;
	
	@Autowired
	private CustomerDao customerDao;
	
	@Autowired
	private MessageService messageService;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForCustomer(ApprovalVO approvalVO, ApprovalCustomerVO approvalCustomerVO, String userId) throws FLException {
		
		int customerId = approvalCustomerVO.getCustomerId();
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_CUSTOMER_INT, String.valueOf(customerId));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		CustomerPO customerPO = customerDao.get(customerId);
		
		if(customerPO == null){
			throw new FLException(130002, "客户信息不存在");
		}
		
		String customerName = customerPO.getCustomerName();
		String phone = customerPO.getPhone();
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_CUSTOMER_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(String.valueOf(customerId));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_CUSTOMER_STR, customerName, phone, approvalCustomerVO.getNewCustomerName(), approvalCustomerVO.getNewCustomerPhone()));
		approvalPO.setReceiver(new UserPO(approvalVO.getReceiverId()));
		approvalPO.setSender(new UserPO(userId));
		
		approvalDao.save(approvalPO);
		
		customerPO.setEmail("test");
		customerDao.merge(customerPO);
		
		ApprovalCustomerPO approvalCustomerPO = new ApprovalCustomerPO();
		BeanUtil.copyProperties(approvalCustomerVO, approvalCustomerPO);
		approvalCustomerPO.setAid(approvalPO.getAid());
		approvalCustomerPO.setOldCustomerName(customerName);
		approvalCustomerPO.setOldCustomerPhone(phone);
		
		approvalCustomerDao.save(approvalCustomerPO);
		
		MessageVO messageVO = new MessageVO(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), MessagePO.MESSAGE_TYPE_APPROVAL_STR, "新增一条审批信息,请查收.");
		
		messageService.sendMessage(messageVO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForCustomer(ApprovalPO approvalPO) throws FLException {
		
		ApprovalCustomerPO approvalCustomerPO = approvalCustomerDao.queryApprovalCustomerByAId(approvalPO.getAid());
		
		if(approvalCustomerPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		CustomerPO customerPO = customerDao.get(approvalCustomerPO.getCustomerId());
		
		if(customerPO == null){
			throw new FLException(130002, "客户信息不存在");
		}
		
		String customerName = approvalCustomerPO.getNewCustomerName();
		
		List<String> pinyinABs = PinYin4Util.getPinYinHeadChar(customerName);
		List<String> pinyinAlls = PinYin4Util.getPinyin(customerName);
		
		customerPO.setCustomerNamePYAB(pinyinABs.subList(0, pinyinABs.size() >= 2 ? 2 : pinyinABs.size()).toString());
		customerPO.setCustomerNamePYAll(pinyinAlls.subList(0, pinyinAlls.size() >= 2 ? 2 : pinyinAlls.size()).toString());
		
		customerPO.setCustomerName(approvalCustomerPO.getNewCustomerName());
		customerPO.setPhone(approvalCustomerPO.getNewCustomerPhone());
		
		customerDao.merge(customerPO);
		
		return 0;
	}

}
