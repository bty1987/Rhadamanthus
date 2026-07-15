package com.fanglin.approval.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalDecorationContractDao;
import com.fanglin.approval.po.ApprovalDecorationContractPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalDecorationContractService;
import com.fanglin.approval.service.ApprovalFlowEngineService;
import com.fanglin.approval.vo.ApprovalDecorationContractVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ContractDao;
import com.fanglin.data.po.ContractPO;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.dingding.service.DingTalkApprovalService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalDecorationContractService")
@Transactional(readOnly = true)
public class ApprovalDecorationContractServiceImpl implements ApprovalDecorationContractService {

	@Autowired
	private ApprovalDecorationContractDao approvalDecorationContractDao;

	@Autowired
	private DecorationContractDao decorationContractDao;

	@Autowired
	private ContractDao contractDao;

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DingTalkApprovalService approvalService;

	@Autowired(required = false)
	private ApprovalFlowEngineService approvalFlowEngineService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForDecorationContract(ApprovalVO approvalVO, ApprovalDecorationContractVO approvalDecorationContractVO, String userId, int company, String code, String forms) throws FLException {

		ContractPO contractPO = contractDao.get(approvalDecorationContractVO.getCid());

		if (contractPO == null) {
			throw new FLException(130044, "合同模版不存在");
		}

		String orderId = approvalDecorationContractVO.getOrderId();

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_DECORATION_CONTRACT_INT, orderId);

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());

		UserPO sender = userDao.queryUserByUserId(userId);

		String content = String.format("装修单号:%s, 合同名:%s", decorationPO.getOrderId(), contractPO.getName());

		approvalPO = new ApprovalPO().init(sender, receiver, orderId, String.valueOf(approvalDecorationContractVO.getCid()), ApprovalPO.APPROVAL_TYPE_DECORATION_CONTRACT_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalDecorationContractPO approvalDecorationContractPO = new ApprovalDecorationContractPO();

		BeanUtil.copyProperties(approvalDecorationContractVO, approvalDecorationContractPO);

		approvalDecorationContractPO.setAid(approvalPO.getAid());

		approvalDecorationContractDao.save(approvalDecorationContractPO);

		// 审批渠道互斥:配了本地流程定义走新引擎(纯本地流转),未配置则走钉钉(保持原行为)。
		// 二者不可并行,避免同一单据在钉钉端和本地引擎同时流转产生状态混乱。
		if (approvalFlowEngineService != null
			&& approvalFlowEngineService.hasFlow(ApprovalPO.APPROVAL_TYPE_DECORATION_CONTRACT_INT, company)) {
			approvalFlowEngineService.startFlow(approvalPO);
		} else if (code != null && !"".equals(code)) {
			String piid = approvalService.initiateApproval(code, userId, null, null, null, JSONArray.parseArray(forms), company);

			approvalPO.setPiid(piid);

			approvalDao.update(approvalPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForDecorationContract(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationContractPO approvalDecorationContractPO = approvalDecorationContractDao.queryApprovalDecorationContractByAid(approvalPO.getAid());

		if (approvalDecorationContractPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		ContractPO contractPO = contractDao.get(approvalDecorationContractPO.getCid());

		if (contractPO == null) {
			throw new FLException(130044, "合同模版不存在");
		}

		DecorationContractPO decorationContractPO = new DecorationContractPO(new UserPO());

		BeanUtil.copyProperties(approvalDecorationContractPO, decorationContractPO, Arrays.asList("creater"));

		decorationContractPO.setCid(contractPO.getCid());
		decorationContractPO.setNo(contractPO.getNo());
		decorationContractPO.setName(contractPO.getName());
		decorationContractPO.setTitle(contractPO.getTitle());
		decorationContractPO.setCreater(approvalPO.getSender());
		decorationContractPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationContractPO.setStatus(DecorationContractPO.STATUS_UNMAKE_INT);

		decorationContractDao.save(decorationContractPO);

		return 0;
	}

}
