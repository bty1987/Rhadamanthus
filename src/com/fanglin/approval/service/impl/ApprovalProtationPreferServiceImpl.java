/**
 * @File Name		: ApprovalProtationPreferServiceImpl.java
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

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalProtationPreferDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalProtationPreferPO;
import com.fanglin.approval.service.ApprovalProtationPreferService;
import com.fanglin.approval.vo.ApprovalProtationPreferVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.dingding.service.DingTalkApprovalService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.ProtationDao;
import com.fanglin.quotation.po.ProtationPO;
import com.fanglin.quotation.vo.ProtationVO;
import com.fanglin.utils.BeanUtil;

@Service("approvalProtationPreferService")
@Transactional(readOnly = true)
public class ApprovalProtationPreferServiceImpl implements ApprovalProtationPreferService {

	@Autowired
	private ApprovalProtationPreferDao approvalProtationPreferDao;

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ProtationDao protationDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DingTalkApprovalService approvalService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForProtationPrefer(ApprovalVO approvalVO, ApprovalProtationPreferVO approvalProtationPreferVO, ProtationVO protationVO, String userId, int company, String code, String forms) throws FLException {

		ProtationPO protationPO = protationDao.get(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		if (protationPO.getStatus() != ProtationPO.STATUS_INIT_INT) {
			throw new FLException(200047, "预签状态不可操作");
		}

		String orderId = protationPO.getOrderId();
		String pid = String.valueOf(protationPO.getPid());

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_PROTATION_PREFER_INT, pid);

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT).contains(decorationPO.getStatus())) {
			throw new FLException(200047, "预签状态不可操作");
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		String content;
		if (approvalProtationPreferVO.getType() == 1) { // type=1: 活动优惠审批
			content = String.format("装修单号:%s,活动优惠额:%s,总价:%s", orderId, approvalProtationPreferVO.getActivityPrice() / 1000, approvalProtationPreferVO.getTotalPrice() / 1000);
		} else { // type=0: 特批优惠审批（默认）
			content = String.format("装修单号:%s,优惠额:%s,管理优惠额:%s,特批优惠额:%s", orderId, approvalProtationPreferVO.getPreferPrice() / 1000, approvalProtationPreferVO.getManagePrefer() / 1000, approvalProtationPreferVO.getAdvancePrefer() / 1000);
		}

		approvalPO = new ApprovalPO().init(sender, receiver, orderId, pid, ApprovalPO.APPROVAL_TYPE_PROTATION_PREFER_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalProtationPreferPO approvalProtationPreferPO = new ApprovalProtationPreferPO();

		BeanUtil.copyProperties(approvalProtationPreferVO, approvalProtationPreferPO);
		approvalProtationPreferPO.setAid(approvalPO.getAid());

		approvalProtationPreferDao.save(approvalProtationPreferPO);

		protationPO.convert(protationVO);

		protationPO.setStatus(ProtationPO.STATUS_APPROVE_INT);

		protationDao.update(protationPO);

		if (code != null && !"".equals(code)) {
			String piid = approvalService.initiateApproval(code, userId, null, null, null, JSONArray.parseArray(forms), company);

			approvalPO.setPiid(piid);

			approvalDao.update(approvalPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForProtationPrefer(ApprovalPO approvalPO) throws FLException {

		ApprovalProtationPreferPO approvalProtationPreferPO = approvalProtationPreferDao.queryApprovalProtationPreferByAId(approvalPO.getAid());

		if (approvalProtationPreferPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		ProtationPO protationPO = protationDao.get(approvalProtationPreferPO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		if (protationPO.getStatus() != ProtationPO.STATUS_APPROVE_INT) {
			throw new FLException(200047, "预签状态不可操作");
		}

		String orderId = protationPO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT).contains(decorationPO.getStatus())) {
			throw new FLException(200047, "预签状态不可操作");
		}

		if (approvalProtationPreferPO.getType() == 1) {
			// type=1: 活动优惠审批
			if (approvalProtationPreferPO.getActivityPrice() > protationPO.getActivityProfit()) {
				throw new FLException(240005, "活动额不能大于活动利润");
			}
			// 直接使用前端传入的 activityPrice 和 totalPrice
			// 前端已重新计算 totalPrice，确保数据准确性
			protationPO.setActivityPrice(approvalProtationPreferPO.getActivityPrice());
			protationPO.setTotalPrice(approvalProtationPreferPO.getTotalPrice());
		} else {
			// type=0: 管理优惠审批
			protationPO.setPreferPrice(approvalProtationPreferPO.getPreferPrice());
			protationPO.setManageProfit(approvalProtationPreferPO.getManagePrefer());
			protationPO.setAdvanceProfit(approvalProtationPreferPO.getAdvancePrefer());
			protationPO.setTotalPrice(approvalProtationPreferPO.getTotalPrice());
		}

		protationPO.setStatus(ProtationPO.STATUS_INIT_INT);

		if (protationPO.getDefaults() == ProtationPO.DEFAULT_DEFAULT_INT) {
			decorationPO.setPrecontractPrice(protationPO.getTotalPrice());
			decorationDao.update(decorationPO);
		}

		protationDao.update(protationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForProtationPrefer(ApprovalPO approvalPO) throws FLException {

		ApprovalProtationPreferPO approvalProtationPreferPO = approvalProtationPreferDao.queryApprovalProtationPreferByAId(approvalPO.getAid());

		if (approvalProtationPreferPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		ProtationPO protationPO = protationDao.get(approvalProtationPreferPO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		if (protationPO.getStatus() != ProtationPO.STATUS_APPROVE_INT) {
			throw new FLException(200047, "预签状态不可操作");
		}

		protationPO.setStatus(ProtationPO.STATUS_INIT_INT);

		protationDao.update(protationPO);

		return 0;
	}

}
