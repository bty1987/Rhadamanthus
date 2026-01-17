package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalDecorationTerminalDao;
import com.fanglin.approval.dao.ApprovalDecorationTerminalItemDao;
import com.fanglin.approval.po.ApprovalDecorationTerminalItemPO;
import com.fanglin.approval.po.ApprovalDecorationTerminalPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalDecorationTerminalService;
import com.fanglin.approval.vo.ApprovalDecorationTerminalItemVO;
import com.fanglin.approval.vo.ApprovalDecorationTerminalVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.dingding.service.DingTalkApprovalService;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.information.service.MessageService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("ApprovalDecorationTerminalService")
@Transactional(readOnly = true)
public class ApprovalDecorationTerminalServiceImpl implements ApprovalDecorationTerminalService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ApprovalDecorationTerminalDao approvalDecorationTerminalDao;

	@Autowired
	private ApprovalDecorationTerminalItemDao approvalDecorationTerminalItemDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private MessageService messageService;

	@Autowired
	private DingTalkApprovalService approvalService;

	@Autowired
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForDecorationTerminal(ApprovalVO approvalVO, ApprovalDecorationTerminalVO approvalDecorationTerminalVO, List<ApprovalDecorationTerminalItemVO> approvalDecorationTerminalItemVOs, String userId, int company, String code, String forms) throws FLException {

		String orderId = approvalDecorationTerminalVO.getOrderId();

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_DECORATION_TERMINAL_INT, orderId);

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		List<Short> unstatus = Arrays.asList(new Short[] { DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_SIGNED_INT });

		if (!unstatus.contains(decorationPO.getStatus())) {
			throw new FLException(140049, "装修单状态, 不可操作");
		}

		StringBuffer content = new StringBuffer(String.format("装修单号:%s", orderId));

		if (approvalDecorationTerminalItemVOs != null) {

			for (ApprovalDecorationTerminalItemVO approvalDecorationTerminalItemVO : approvalDecorationTerminalItemVOs) {
				content.append(String.format(", %s: %s", approvalDecorationTerminalItemVO.getPaymentType(), Arith.div(approvalDecorationTerminalItemVO.getReferMoney(), 1000.0)));
			}
		}

		approvalPO = new ApprovalPO();

		BeanUtil.copyProperties(approvalVO, approvalPO, Arrays.asList("receiver", "sender"));

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		approvalPO = new ApprovalPO().init(sender, receiver, orderId, orderId, ApprovalPO.APPROVAL_TYPE_DECORATION_TERMINAL_INT, content.toString(), approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalDecorationTerminalPO approvalDecorationTerminalPO = new ApprovalDecorationTerminalPO();

		BeanUtil.copyProperties(approvalDecorationTerminalVO, approvalDecorationTerminalPO);

		approvalDecorationTerminalPO.setAid(approvalPO.getAid());

		approvalDecorationTerminalDao.save(approvalDecorationTerminalPO);

		if (approvalDecorationTerminalItemVOs != null) {

			for (ApprovalDecorationTerminalItemVO approvalDecorationTerminalItemVO : approvalDecorationTerminalItemVOs) {

				ApprovalDecorationTerminalItemPO approvalDecorationTerminalItemPO = new ApprovalDecorationTerminalItemPO();

				BeanUtil.copyProperties(approvalDecorationTerminalItemVO, approvalDecorationTerminalItemPO);

				approvalDecorationTerminalItemPO.setAid(approvalPO.getAid());
				approvalDecorationTerminalItemPO.setAdtid(approvalDecorationTerminalPO.getAdtid());
				approvalDecorationTerminalItemPO.setReferMoney(approvalDecorationTerminalItemVO.getReferMoney());
				approvalDecorationTerminalItemPO.setPaymentType(approvalDecorationTerminalItemVO.getPaymentType());

				approvalDecorationTerminalItemDao.save(approvalDecorationTerminalItemPO);
			}

		}

		decorationPO.setStatus((short) (decorationPO.getStatus() + DecorationPO.STATUS_APPROVAL_INT));

		decorationDao.update(decorationPO);

		messageService.sendMessage(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), approvalPO.getContents(), MessagePO.TYPE_SEND_APPROVAL_INT, company);

		if (code != null && !"".equals(code)) {
			String piid = approvalService.initiateApproval(code, userId, null, null, null, JSONArray.parseArray(forms), company);

			approvalPO.setPiid(piid);

			approvalDao.update(approvalPO);
		}

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "submitApprovalForDecorationTerminal", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForDecorationTerminal(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationTerminalPO approvalDecorationTerminalPO = approvalDecorationTerminalDao.queryApprovalDecorationTerminalByAId(approvalPO.getAid());

		if (approvalDecorationTerminalPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		String orderId = approvalDecorationTerminalPO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		DecorationVO decorationVO = new DecorationVO();

		decorationVO.setOrderId(orderId);

		decorationPO.setStatus((short) (decorationPO.getStatus() - DecorationPO.STATUS_APPROVAL_INT + DecorationPO.STATUS_TERMINABLE_INT));

		decorationDao.update(decorationPO);

		List<ApprovalDecorationTerminalItemPO> approvalDecorationTerminalItemPOs = approvalDecorationTerminalItemDao.queryApprovalDecorationTerminalItemByAdtId(approvalDecorationTerminalPO.getAdtid());
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		if (approvalDecorationTerminalItemPOs != null && approvalDecorationTerminalItemPOs.size() != 0) {

			for (ApprovalDecorationTerminalItemPO approvalDecorationTerminalItemPO : approvalDecorationTerminalItemPOs) {

				DecorationPaymentVO decorationPaymentVO = new DecorationPaymentVO();

				decorationPaymentVO.setPaymentType(approvalDecorationTerminalItemPO.getPaymentType());
				decorationPaymentVO.setReferMoney(approvalDecorationTerminalItemPO.getReferMoney());

				decorationPaymentVOs.add(decorationPaymentVO);
			}

			decorationService.terminalDecoration(decorationVO, decorationPaymentVOs, approvalPO.getReceiver().getUserId(), decorationPO.getCompany());
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuse(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationTerminalPO approvalDecorationTerminalPO = approvalDecorationTerminalDao.queryApprovalDecorationTerminalByAId(approvalPO.getAid());

		if (approvalDecorationTerminalPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}
		String orderId = approvalDecorationTerminalPO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		decorationPO.setStatus((short) (decorationPO.getStatus() - DecorationPO.STATUS_APPROVAL_INT));

		decorationDao.update(decorationPO);

		return 0;
	}

}
