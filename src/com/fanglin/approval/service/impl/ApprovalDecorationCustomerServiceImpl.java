/**
 * @File Name		: ApprovalDecorationCustomerServiceImpl.java
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
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalDecorationCustomerDao;
import com.fanglin.approval.po.ApprovalDecorationCustomerPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalDecorationCustomerService;
import com.fanglin.approval.vo.ApprovalDecorationCustomerVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.AssassinService;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("approvalDecorationCustomerService")
@Transactional(readOnly = true)
public class ApprovalDecorationCustomerServiceImpl implements ApprovalDecorationCustomerService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalDecorationCustomerDao approvalDecorationCustomerDao;

	@Autowired
	private AssassinService assassinService;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private UserDao userDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForCustomer(ApprovalVO approvalVO, ApprovalDecorationCustomerVO approvalDecorationCustomerVO, String userId, int company) throws FLException {

		int customerId = approvalDecorationCustomerVO.getCustomerId();

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_CUSTOMER_INT, String.valueOf(customerId));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		CustomerPO customerPO = customerDao.get(customerId);

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		String content = String.format("客户名:%s,修改为客户名:%s,新增电话:%s", customerPO.getName(), approvalDecorationCustomerVO.getNewCustomerName(), approvalDecorationCustomerVO.getNewCustomerPhone());

		approvalPO = new ApprovalPO().init(sender, receiver, String.valueOf(customerId), ApprovalPO.APPROVAL_TYPE_CUSTOMER_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalDecorationCustomerPO approvalDecorationCustomerPO = new ApprovalDecorationCustomerPO();
		BeanUtil.copyProperties(approvalDecorationCustomerVO, approvalDecorationCustomerPO);

		approvalDecorationCustomerPO.setAid(approvalPO.getAid());

		approvalDecorationCustomerDao.save(approvalDecorationCustomerPO);

		messageService.sendMessage(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), approvalPO.getContents(), MessagePO.TYPE_SEND_APPROVAL_INT, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForCustomer(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationCustomerPO approvalDecorationCustomerPO = approvalDecorationCustomerDao.queryApprovalDecorationCustomerByAId(approvalPO.getAid());

		if (approvalDecorationCustomerPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		CustomerPO customerPO = customerDao.get(approvalDecorationCustomerPO.getCustomerId());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		String customerName = approvalDecorationCustomerPO.getNewCustomerName();

		String api = "updateCustomerNameAPhone.do";// 接口暂定
		String params = String.format("customer.cid=%s&customer.name=%s&customer.phone=%s", approvalDecorationCustomerPO.getCustomerId(), customerName, approvalDecorationCustomerPO.getNewCustomerPhone());
		String content = String.format("客户编号:%s,新客户名称:%s,新客户电话:%s", approvalDecorationCustomerPO.getCustomerId(), customerName, approvalDecorationCustomerPO.getNewCustomerPhone());

		assassinService.proxy("communion", api, params, content, approvalPO.getSender());
		return 0;
	}

}
