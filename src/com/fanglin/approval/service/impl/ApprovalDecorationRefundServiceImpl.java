/**
 * @File Name		: ApprovalDecorationRefundServiceImpl.java
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

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalDecorationRefundDao;
import com.fanglin.approval.po.ApprovalDecorationRefundPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalDecorationRefundService;
import com.fanglin.approval.vo.ApprovalDecorationRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.PaymentTypeDao;
import com.fanglin.data.po.PaymentTypePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.dingding.service.DingTalkApprovalService;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalDecorationRefundService")
@Transactional(readOnly = true)
public class ApprovalDecorationRefundServiceImpl implements ApprovalDecorationRefundService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalDecorationRefundDao approvalDecorationRefundDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private AddReduceDao addReduceDao;

	@Autowired
	private DingTalkApprovalService approvalService;

	@Autowired
	private PaymentTypeDao paymentTypeDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForDecorationRefund(ApprovalVO approvalVO, ApprovalDecorationRefundVO approvalDecorationRefundVO, String userId, int company, String code, String forms) throws FLException {

		long paymentId = approvalDecorationRefundVO.getPaymentId();

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_DECORATION_REFUND_INT, String.valueOf(paymentId));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(approvalDecorationRefundVO.getPaymentId());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		DecorationPO decorationPO = decorationPaymentPO.getDecoration();

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_APPLYING_INT);

		decorationPaymentDao.update(decorationPaymentPO);

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		String content = String.format("装修单号:%s,退款类型:%s,金额:%.3f", decorationPaymentPO.getDecoration().getOrderId(), decorationPaymentPO.getPaymentType(), Arith.div(decorationPaymentPO.getReferMoney(), 1000.0));

		approvalPO = new ApprovalPO().init(sender, receiver, decorationPO.getOrderId(), String.valueOf(paymentId), ApprovalPO.APPROVAL_TYPE_DECORATION_REFUND_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalDecorationRefundPO approvalDecorationRefundPO = new ApprovalDecorationRefundPO();
		approvalDecorationRefundPO.setAid(approvalPO.getAid());
		approvalDecorationRefundPO.setPaymentId(paymentId);

		approvalDecorationRefundDao.save(approvalDecorationRefundPO);

		messageService.sendMessage(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), approvalPO.getContents(), MessagePO.TYPE_SEND_APPROVAL_INT, company);

		if (code != null && !"".equals(code)) {
			String piid = approvalService.initiateApproval(code, userId, null, null, null, JSONArray.parseArray(forms), company);

			approvalPO.setPiid(piid);

			approvalDao.update(approvalPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForDecorationRefund(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationRefundPO approvalDecorationRefundPO = approvalDecorationRefundDao.queryApprovalDecorationRefundByAId(approvalPO.getAid());

		if (approvalDecorationRefundPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(approvalDecorationRefundPO.getPaymentId());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		DecorationPO decorationPO = decorationPaymentPO.getDecoration();

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		PaymentTypePO refundPaymentType = paymentTypeDao.queryPaymentTypeByName(decorationPaymentPO.getPaymentType() + DecorationPaymentPO.PAYMENTTYPE_REFUND_STR, decorationPO.getCompany());

		if (refundPaymentType == null) {
			throw new FLException(130091, "款项类型不存在");
		}

		DecorationPaymentPO decorationRefundPO = new DecorationPaymentPO();
		decorationRefundPO.setDecoration(decorationPaymentPO.getDecoration());
		decorationRefundPO.setPaymentType(decorationPaymentPO.getPaymentType() + DecorationPaymentPO.PAYMENTTYPE_REFUND_STR);
		decorationRefundPO.setPtid(refundPaymentType.getPtid());
		decorationRefundPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
		decorationRefundPO.setTwoType(decorationPaymentPO.getTwoType());
		decorationRefundPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
		decorationRefundPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationRefundPO.setCreater(approvalPO.getSender());
		decorationRefundPO.setReferMoney(decorationPaymentPO.getReferMoney());
		decorationRefundPO.setCompany(decorationPO.getCompany());

		decorationPaymentDao.save(decorationRefundPO);

		if (decorationPaymentPO.getOneType() == DecorationPaymentPO.ONETYPE_ADD_INT && (decorationPaymentPO.getTwoType() == DecorationPaymentPO.TWOTYPE_DEAL_INT || decorationPaymentPO.getTwoType() == DecorationPaymentPO.TWOTYPE_ADD_REDUCE_INT)) {

			PaymentTypePO paymentType = paymentTypeDao.queryPaymentTypeByName(decorationPaymentPO.getPaymentType(), decorationPO.getCompany());

			if (paymentType == null) {
				throw new FLException(130091, "款项类型不存在");
			}

			DecorationPaymentPO initialDecorationPaymentPO = new DecorationPaymentPO();
			BeanUtil.copyProperties(decorationRefundPO, initialDecorationPaymentPO);

			initialDecorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
			initialDecorationPaymentPO.setTwoType(decorationPaymentPO.getTwoType());
			initialDecorationPaymentPO.setPaymentType(decorationPaymentPO.getPaymentType());
			initialDecorationPaymentPO.setPtid(paymentType.getPtid());
			initialDecorationPaymentPO.setCompany(decorationPO.getCompany());

			if (decorationPaymentPO.getTwoType() == DecorationPaymentPO.TWOTYPE_DEAL_INT) {
				initialDecorationPaymentPO.setSort(decorationPaymentPO.getSort());
			}

			decorationPaymentDao.save(initialDecorationPaymentPO);

			if (decorationPaymentPO.getTwoType() == DecorationPaymentPO.TWOTYPE_ADD_REDUCE_INT) {

				List<AddReducePO> addReducePOs = addReduceDao.queryAddReduce(approvalDecorationRefundPO.getPaymentId());

				for (AddReducePO addReducePO : addReducePOs) {
					addReducePO.setDpId(initialDecorationPaymentPO.getDpid());
					addReduceDao.update(addReducePO);
				}

			}
		}

		decorationPaymentPO.setPaymentType(decorationPaymentPO.getPaymentType() + DecorationPaymentPO.PAYMENTTYPE_HISTORY_STR);
		decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_HISTORY_INT);
		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_HISTORY_INT);

		decorationPaymentDao.update(decorationPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForDecorationRefund(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationRefundPO approvalDecorationRefundPO = approvalDecorationRefundDao.queryApprovalDecorationRefundByAId(approvalPO.getAid());

		if (approvalDecorationRefundPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(approvalDecorationRefundPO.getPaymentId());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT);

		decorationPaymentDao.update(decorationPaymentPO);

		return 0;
	}

}
