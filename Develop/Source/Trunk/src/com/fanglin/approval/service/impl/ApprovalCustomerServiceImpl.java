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
import com.fanglin.information.service.AssassinService;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalCustomerService")
@Transactional(readOnly=true)
public class ApprovalCustomerServiceImpl implements ApprovalCustomerService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalCustomerDao approvalCustomerDao;
	
	@Autowired
	private AssassinService assassinService;
	
	@Autowired
	private CustomerDao customerDao;
	
	@Autowired
	private MessageService messageService;

	@Autowired
	private UserDao userDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForCustomer(ApprovalVO approvalVO, ApprovalCustomerVO approvalCustomerVO, String userId, int company) throws FLException {
		
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
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiverId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_CUSTOMER_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(String.valueOf(customerId));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_CUSTOMER_STR, customerName, phone, approvalCustomerVO.getNewCustomerName(), approvalCustomerVO.getNewCustomerPhone()));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);
		
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
		
		String api = "updateCustomer.do";
		String params = String.format("customer.id=%s&customer.customerName=%s&customer.phone=%s", approvalCustomerPO.getCustomerId(), customerName, approvalCustomerPO.getNewCustomerPhone());
		String content = String.format("客户编号:%s,新客户名称:%s,新客户电话:%s",approvalCustomerPO.getCustomerId(),customerName,approvalCustomerPO.getNewCustomerPhone());
		
		assassinService.proxy("communion", api, params, content, approvalPO.getSender());
		
		return 0;
	}

}
