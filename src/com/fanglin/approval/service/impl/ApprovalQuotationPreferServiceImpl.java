package com.fanglin.approval.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalQuotationPreferDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalQuotationPreferPO;
import com.fanglin.approval.service.ApprovalQuotationPreferService;
import com.fanglin.approval.vo.ApprovalQuotationPreferVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.dingding.service.DingTalkApprovalService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationPreferDao;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.QuotationPreferPO;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.utils.BeanUtil;

@Service("approvalQuotationPreferService")
@Transactional(readOnly = true)
public class ApprovalQuotationPreferServiceImpl implements ApprovalQuotationPreferService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private QuotationPreferDao quotationPreferDao;

	@Autowired
	private ApprovalQuotationPreferDao approvalQuotationPreferDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ExtensionDao extensionDao;

	@Autowired
	private DingTalkApprovalService approvalService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForQuotationPrefer(ApprovalVO approvalVO, ApprovalQuotationPreferVO approvalQuotationPreferVO, String userId, int company, String code, String forms) throws FLException {

		QuotationPreferPO quotationPreferPO = quotationPreferDao.get(approvalQuotationPreferVO.getQpid());

		if (quotationPreferPO == null) {
			throw new FLException(200066, "报价优惠不存在");
		}

		QuotationPO quotationPO = quotationDao.get(approvalQuotationPreferVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() != QuotationPO.STATUS_INIT_INT) {
			throw new FLException(200033, "报价已锁定");
		}

		String orderId = quotationPO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT }).contains(decorationPO.getStatus())) {
			throw new FLException(200005, "报价不能修改");
		}

		String qpid = String.valueOf(approvalQuotationPreferVO.getQpid());

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_QUOTATION_PREFER‌_INT, qpid);

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		String content;
		if (approvalQuotationPreferVO.getType() != null && approvalQuotationPreferVO.getType() == 1) {
			content = String.format("装修单号:%s,活动优惠额:%s,总价:%s", orderId, approvalQuotationPreferVO.getActivityProfit() / 1000, approvalQuotationPreferVO.getTotalPrice() / 1000);
		} else {
			content = String.format("装修单号:%s,优惠额:%s,管理优惠额:%s特批优惠额:%s", orderId, approvalQuotationPreferVO.getPreferPrice() / 1000, approvalQuotationPreferVO.getManagePrefer() / 1000, approvalQuotationPreferVO.getAdvancePrefer() / 1000);
		}

		approvalPO = new ApprovalPO().init(sender, receiver, orderId, qpid, ApprovalPO.APPROVAL_TYPE_QUOTATION_PREFER‌_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalQuotationPreferPO approvalQuotationPreferPO = new ApprovalQuotationPreferPO();

		BeanUtil.copyProperties(approvalQuotationPreferVO, approvalQuotationPreferPO);

		approvalQuotationPreferPO.setAid(approvalPO.getAid());

		approvalQuotationPreferDao.save(approvalQuotationPreferPO);

		quotationPO.setStatus(QuotationPO.STATUS_APPROVE_INT);

		quotationDao.update(quotationPO);

		if (code != null && !"".equals(code)) {
			String piid = approvalService.initiateApproval(code, userId, null, null, null, JSONArray.parseArray(forms), company);

			approvalPO.setPiid(piid);

			approvalDao.update(approvalPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForQuotationPrefer(ApprovalPO approvalPO) throws FLException {

		ApprovalQuotationPreferPO approvalQuotationPreferPO = approvalQuotationPreferDao.queryApprovalQuotationPreferByAid(approvalPO.getAid());

		if (approvalQuotationPreferPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		QuotationPreferPO quotationPreferPO = quotationPreferDao.get(approvalQuotationPreferPO.getQpid());

		if (quotationPreferPO == null) {
			throw new FLException(200066, "报价优惠不存在");
		}

		QuotationPO quotationPO = quotationDao.get(approvalQuotationPreferPO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() != QuotationPO.STATUS_APPROVE_INT) {
			throw new FLException(200030, "报价不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT }).contains(decorationPO.getStatus())) {
			throw new FLException(200005, "报价不能修改");
		}

		if (approvalQuotationPreferPO.getType() == 1) {
			// type=1: 活动优惠审批 — 校验 extension 活动类型总额 + 只更新 activityProfit, activityPrice

			// 查询该报价关联的所有 extension，累加活动类型(atttype=4)的 total
			long extensionActivityTotal = 0;
			List<ExtensionPO> extensions = extensionDao.queryExtensionByOrderId(quotationPO.getOrderId());
			for (ExtensionPO extension : extensions) {
				if (extension.getAtttype() == ExtensionPO.ATTTYPE_ACTIVITY_INT) {
					if (extension.getType() == ExtensionPO.TYPE_ADD_INT) {
						extensionActivityTotal += extension.getTotal();
					} else {
						extensionActivityTotal -= extension.getTotal();
					}
				}
			}

			// 校验: 活动优惠额 不能大于 活动类型总额
			if (approvalQuotationPreferPO.getActivityProfit() > extensionActivityTotal) {
				throw new FLException(240005, "活动优惠额不能大于活动类型总额");
			}

			quotationPreferPO.setActivityProfit(approvalQuotationPreferPO.getActivityProfit());
			quotationPreferPO.setActivityPrice(approvalQuotationPreferPO.getActivityPrice());
		} else {
			// type=0 (默认): 特批优惠审批 — 更新 preferPrice, managePrefer, advancePrefer, activityPrice, activityProfit
			quotationPreferPO.setPreferPrice(approvalQuotationPreferPO.getPreferPrice());
			quotationPreferPO.setManagePrefer(approvalQuotationPreferPO.getManagePrefer());
			quotationPreferPO.setAdvancePrefer(approvalQuotationPreferPO.getAdvancePrefer());
			quotationPreferPO.setActivityPrice(approvalQuotationPreferPO.getActivityPrice());
			quotationPreferPO.setActivityProfit(approvalQuotationPreferPO.getActivityProfit());
		}

		quotationPreferDao.save(quotationPreferPO);

		quotationPO.setTotalPrice(approvalQuotationPreferPO.getTotalPrice());
		quotationPO.setTaxPrice(approvalQuotationPreferPO.getTaxPrice());

		quotationPO.setStatus(QuotationPO.STATUS_INIT_INT);

		quotationDao.update(quotationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForQuotationPrefer(ApprovalPO approvalPO) throws FLException {

		ApprovalQuotationPreferPO approvalQuotationPreferPO = approvalQuotationPreferDao.queryApprovalQuotationPreferByAid(approvalPO.getAid());

		if (approvalQuotationPreferPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		QuotationPreferPO quotationPreferPO = quotationPreferDao.get(approvalQuotationPreferPO.getQpid());

		if (quotationPreferPO == null) {
			throw new FLException(200066, "报价优惠不存在");
		}

		QuotationPO quotationPO = quotationDao.get(approvalQuotationPreferPO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() != QuotationPO.STATUS_APPROVE_INT) {
			throw new FLException(200030, "报价不可操作");
		}

		quotationPO.setStatus(QuotationPO.STATUS_INIT_INT);

		quotationDao.update(quotationPO);

		return 0;
	}

}
