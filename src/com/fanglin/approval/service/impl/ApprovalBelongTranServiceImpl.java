/**
 * @File Name		: ApprovalBelongTranServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 人员离职归属移交审批(一人一组一张审批; 通过=整批单事务逐单物化)
 */

package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalBelongTranDao;
import com.fanglin.approval.dao.ApprovalBelongTranItemDao;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalBelongTranItemPO;
import com.fanglin.approval.po.ApprovalBelongTranPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalBelongTranService;
import com.fanglin.approval.service.ApprovalDecorationBelongService;
import com.fanglin.approval.vo.ApprovalBelongTranItemVO;
import com.fanglin.approval.vo.ApprovalBelongTranVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Service("approvalBelongTranService")
@Transactional(readOnly = true)
public class ApprovalBelongTranServiceImpl implements ApprovalBelongTranService {

	// 可移交装修单状态: 0初始/1定金/2预签/3签约/4重签 (废单5/终止6/决算7/完工8/待审20排除)
	private static final List<Short> TRAN_DECORATION_STATUS = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_RESIGNED_INT });

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalBelongTranDao approvalBelongTranDao;

	@Autowired
	private ApprovalBelongTranItemDao approvalBelongTranItemDao;

	@Autowired
	private ApprovalDecorationBelongService approvalDecorationBelongService;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationBelongDao decorationBelongDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private MessageService messageService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForBelongTran(ApprovalVO approvalVO, ApprovalBelongTranVO approvalBelongTranVO, List<ApprovalBelongTranItemVO> approvalBelongTranItemVOs, String userId, int company) throws FLException {

		if (approvalBelongTranItemVOs == null || approvalBelongTranItemVOs.isEmpty()) {
			throw new FLException(240086, "移交明细为空或单据归属与移交人不符");
		}

		UserPO quitUser = userDao.queryUserByUserId(approvalBelongTranVO.getUserId());

		if (quitUser == null) {
			throw new FLException(190005, "人员不存在");
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());

		if (receiver == null) {
			throw new FLException(190005, "人员不存在");
		}

		UserPO sender = userDao.queryUserByUserId(userId);

		if (sender == null) {
			throw new FLException(190005, "人员不存在");
		}

		short tranType = approvalBelongTranVO.getTranType() != null ? approvalBelongTranVO.getTranType().shortValue() : ApprovalBelongTranPO.TRANTYPE_ALL_INT;

		// 每组(orderId|belongType)默认人合计计数=保留行默认+明细默认, 终校必须恰一(240091)
		Map<String, Integer> defaultGroup = new HashMap<String, Integer>();
		Set<String> pairKeys = new HashSet<String>();
		Set<String> orderIds = new HashSet<String>();

		for (ApprovalBelongTranItemVO approvalBelongTranItemVO : approvalBelongTranItemVOs) {

			String orderId = approvalBelongTranItemVO.getOrderId();
			Short belongType = approvalBelongTranItemVO.getBelongType();

			if (orderId == null || orderId.length() == 0 || belongType == null) {
				throw new FLException(110040, "请求参数格式不正确");
			}

			if (belongType.shortValue() != DecorationBelongPO.BELONGTYPE_DESIGN_INT && belongType.shortValue() != DecorationBelongPO.BELONGTYPE_SALESMAN_INT) {
				throw new FLException(140014, "订单归属类型错误");
			}

			if (tranType != ApprovalBelongTranPO.TRANTYPE_ALL_INT && tranType != belongType.shortValue()) {
				throw new FLException(110040, "请求参数格式不正确");
			}

			String pairKey = orderId + "|" + belongType;

			if (!pairKeys.add(pairKey)) {
				throw new FLException(240086, "移交明细为空或单据归属与移交人不符");
			}

			orderIds.add(orderId);

			if (approvalBelongTranItemVO.getRate() == null || approvalBelongTranItemVO.getRate().intValue() < 0 || approvalBelongTranItemVO.getRate().intValue() > 1000 || approvalBelongTranItemVO.getDefaultFlag() == null) {
				throw new FLException(110040, "请求参数格式不正确");
			}

			// 状态复验: 防前端草稿陈旧(物化时刻还会复验一次)
			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

			if (decorationPO == null) {
				throw new FLException(140013, "装修单不存在");
			}

			if (!TRAN_DECORATION_STATUS.contains(decorationPO.getStatus())) {
				throw new FLException(240088, "装修单状态已变化不可移交");
			}

			// 该单该类型在途冲突复验: 单票归属审批待审(0/5/6) 或 移交审批待审(同单同类型), 精确到类型防止同单双类型分批互挡
			if (approvalDao.queryApprovalByChange(Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT), ApprovalPO.APPROVAL_TYPE_DECORATION_BELONG_INT, orderId) != null || approvalBelongTranItemDao.countApprovalBelongTranItemForInit(orderId, belongType.shortValue()) > 0) {
				throw new FLException(240089, "该装修单已有在途审批不可移交");
			}

			// 原移交人该类型现生效行复验 + 保留行默认计数
			List<DecorationBelongPO> belongPOs = decorationBelongDao.queryDecorationBelong(orderId, belongType, DecorationBelongPO.STATUS_INVALID_INT);

			boolean quitRow = false;
			int groupDefault = defaultGroup.containsKey(pairKey) ? defaultGroup.get(pairKey).intValue() : 0;

			for (DecorationBelongPO decorationBelongPO : belongPOs) {

				if (decorationBelongPO.getBelonger().getUid() == quitUser.getUid()) quitRow = true;
				else if (DecorationBelongPO.DEFAULTFLAG_TRUE_INT == decorationBelongPO.getDefaultFlag()) groupDefault++;
			}

			if (!quitRow) {
				throw new FLException(240086, "移交明细为空或单据归属与移交人不符");
			}

			UserPO newBelonger = userDao.queryUserByUserId(approvalBelongTranItemVO.getUserId());

			if (newBelonger == null) {
				throw new FLException(190005, "人员不存在");
			}

			if (newBelonger.getStatus() != UserPO.STATUS_ONJOB_INT) {
				throw new FLException(240087, "接手人非在职");
			}

			if (DecorationBelongPO.DEFAULTFLAG_TRUE_INT == approvalBelongTranItemVO.getDefaultFlag().shortValue()) groupDefault++;

			defaultGroup.put(pairKey, Integer.valueOf(groupDefault));
		}

		for (Map.Entry<String, Integer> entry : defaultGroup.entrySet()) {

			if (entry.getValue().intValue() != 1) {
				throw new FLException(240091, "移交单据默认人设置不正确");
			}
		}

		String firstOrderId = approvalBelongTranItemVOs.get(0).getOrderId();
		String tranTypeText = tranType == ApprovalBelongTranPO.TRANTYPE_DESIGN_INT ? "设计" : (tranType == ApprovalBelongTranPO.TRANTYPE_SALESMAN_INT ? "业务" : "设计+业务");

		String contents = String.format("人员:%s(%s)离职移交%d单,原因:%s", quitUser.getCurrentName(), tranTypeText, Integer.valueOf(orderIds.size()), approvalBelongTranVO.getReason() != null ? approvalBelongTranVO.getReason() : "");

		ApprovalPO approvalPO = new ApprovalPO().init(sender, receiver, firstOrderId, String.valueOf(quitUser.getUid()), ApprovalPO.APPROVAL_TYPE_BELONG_TRAN_INT, contents, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalBelongTranPO approvalBelongTranPO = new ApprovalBelongTranPO();

		approvalBelongTranPO.setAid(approvalPO.getAid());
		approvalBelongTranPO.setOuid(quitUser.getUid());
		approvalBelongTranPO.setTranType(tranType);
		approvalBelongTranPO.setReason(approvalBelongTranVO.getReason());
		approvalBelongTranPO.setCompany(company);
		approvalBelongTranPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		approvalBelongTranDao.save(approvalBelongTranPO);

		for (ApprovalBelongTranItemVO approvalBelongTranItemVO : approvalBelongTranItemVOs) {

			UserPO newBelonger = userDao.queryUserByUserId(approvalBelongTranItemVO.getUserId());

			ApprovalBelongTranItemPO approvalBelongTranItemPO = new ApprovalBelongTranItemPO();

			approvalBelongTranItemPO.setAbtId(approvalBelongTranPO.getAbtId());
			approvalBelongTranItemPO.setOrderId(approvalBelongTranItemVO.getOrderId());
			approvalBelongTranItemPO.setBelongType(approvalBelongTranItemVO.getBelongType().shortValue());
			approvalBelongTranItemPO.setBuid(newBelonger.getUid());

			// 部门/大区快照按提交时实时部门记录(物化时刻会再次以实时部门为准)
			DepartmentPO dept = newBelonger.getDept();
			DepartmentPO regn = dept != null ? dept.getFatherDept() : null;

			if (dept == null || regn == null) {
				throw new FLException(240090, "接手人部门未关联大区不可移交");
			}

			approvalBelongTranItemPO.setBdid(dept.getDid());
			approvalBelongTranItemPO.setBrid(regn.getDid());
			approvalBelongTranItemPO.setRate(approvalBelongTranItemVO.getRate().intValue());
			approvalBelongTranItemPO.setDefaultFlag(approvalBelongTranItemVO.getDefaultFlag().shortValue());

			approvalBelongTranItemDao.save(approvalBelongTranItemPO);
		}

		messageService.sendMessage(receiver.getUserId(), sender.getUserId(), contents, MessagePO.TYPE_SEND_APPROVAL_INT, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForBelongTran(ApprovalPO approvalPO) throws FLException {

		ApprovalBelongTranPO approvalBelongTranPO = approvalBelongTranDao.queryApprovalBelongTranByAId(approvalPO.getAid());

		if (approvalBelongTranPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		List<ApprovalBelongTranItemPO> itemPOs = approvalBelongTranItemDao.queryApprovalBelongTranItemByAbtId(approvalBelongTranPO.getAbtId());

		if (itemPOs == null || itemPOs.isEmpty()) {
			throw new FLException(240086, "移交明细为空或单据归属与移交人不符");
		}

		// 按(orderId|belongType)分组逐组物化; 与外层同一事务(REQUIRED参与), 任一组失败整批回滚
		Map<String, List<ApprovalBelongTranItemPO>> groups = new LinkedHashMap<String, List<ApprovalBelongTranItemPO>>();

		for (ApprovalBelongTranItemPO approvalBelongTranItemPO : itemPOs) {

			String key = approvalBelongTranItemPO.getOrderId() + "|" + approvalBelongTranItemPO.getBelongType();

			if (!groups.containsKey(key)) groups.put(key, new ArrayList<ApprovalBelongTranItemPO>());

			groups.get(key).add(approvalBelongTranItemPO);
		}

		for (Map.Entry<String, List<ApprovalBelongTranItemPO>> entry : groups.entrySet()) {

			ApprovalBelongTranItemPO first = entry.getValue().get(0);

			approvalDecorationBelongService.tranDecorationBelongForQuit(first.getOrderId(), Short.valueOf(first.getBelongType()), approvalBelongTranPO.getOuid(), entry.getValue(), approvalPO.getReceiver());
		}

		return 0;
	}

	@Override
	public ApprovalBelongTranVO queryApprovalBelongTranByAId(long aId) throws FLException {

		ApprovalBelongTranPO approvalBelongTranPO = approvalBelongTranDao.queryApprovalBelongTranByAId(aId);

		if (approvalBelongTranPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		ApprovalBelongTranVO approvalBelongTranVO = new ApprovalBelongTranVO();

		approvalBelongTranVO.setAbtId(Integer.valueOf(approvalBelongTranPO.getAbtId()));
		approvalBelongTranVO.setAid(Long.valueOf(approvalBelongTranPO.getAid()));
		approvalBelongTranVO.setTranType(Short.valueOf(approvalBelongTranPO.getTranType()));
		approvalBelongTranVO.setReason(approvalBelongTranPO.getReason());
		approvalBelongTranVO.setCcid(Long.valueOf(approvalBelongTranPO.getCcid()));
		approvalBelongTranVO.setCompany(Integer.valueOf(approvalBelongTranPO.getCompany()));
		approvalBelongTranVO.setCreateTime(approvalBelongTranPO.getCreateTime());

		UserPO quitUser = userDao.get(Integer.valueOf(approvalBelongTranPO.getOuid()));

		if (quitUser != null) {

			approvalBelongTranVO.setUserId(quitUser.getUserId());
			approvalBelongTranVO.setUserName(quitUser.getCurrentName());

			if (quitUser.getDept() != null) approvalBelongTranVO.setDeptName(quitUser.getDept().getName());
		}

		return approvalBelongTranVO;
	}

	@Override
	public List<ApprovalBelongTranItemVO> queryApprovalBelongTranItemByAId(long aId) throws FLException {

		ApprovalBelongTranPO approvalBelongTranPO = approvalBelongTranDao.queryApprovalBelongTranByAId(aId);

		if (approvalBelongTranPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		List<ApprovalBelongTranItemPO> itemPOs = approvalBelongTranItemDao.queryApprovalBelongTranItemByAbtId(approvalBelongTranPO.getAbtId());

		List<ApprovalBelongTranItemVO> itemVOs = new ArrayList<ApprovalBelongTranItemVO>();
		Map<String, DecorationPO> decorationCache = new HashMap<String, DecorationPO>();

		for (ApprovalBelongTranItemPO approvalBelongTranItemPO : itemPOs) {

			ApprovalBelongTranItemVO approvalBelongTranItemVO = new ApprovalBelongTranItemVO();

			approvalBelongTranItemVO.setAbtiId(Integer.valueOf(approvalBelongTranItemPO.getAbtiId()));
			approvalBelongTranItemVO.setAbtId(Integer.valueOf(approvalBelongTranItemPO.getAbtId()));
			approvalBelongTranItemVO.setOrderId(approvalBelongTranItemPO.getOrderId());
			approvalBelongTranItemVO.setBelongType(Short.valueOf(approvalBelongTranItemPO.getBelongType()));
			approvalBelongTranItemVO.setRate(Integer.valueOf(approvalBelongTranItemPO.getRate()));
			approvalBelongTranItemVO.setDefaultFlag(Short.valueOf(approvalBelongTranItemPO.getDefaultFlag()));
			approvalBelongTranItemVO.setBelongTypeName(approvalBelongTranItemPO.getBelongType() == DecorationBelongPO.BELONGTYPE_DESIGN_INT ? "设计" : "业务");
			approvalBelongTranItemVO.setDefaultFlagName(DecorationBelongPO.DEFAULTFLAG_TRUE_INT == approvalBelongTranItemPO.getDefaultFlag() ? "默认" : "否");

			double ratePercent = approvalBelongTranItemPO.getRate() / 10.0;

			approvalBelongTranItemVO.setRateText((ratePercent == Math.floor(ratePercent) ? String.valueOf((int) ratePercent) : String.valueOf(ratePercent)) + "%");

			UserPO newBelonger = userDao.get(Integer.valueOf(approvalBelongTranItemPO.getBuid()));

			if (newBelonger != null) {

				approvalBelongTranItemVO.setUserId(newBelonger.getUserId());
				approvalBelongTranItemVO.setUserName(newBelonger.getCurrentName());

				DepartmentPO dept = newBelonger.getDept();

				if (dept != null) {

					approvalBelongTranItemVO.setDeptName(dept.getName());

					if (dept.getFatherDept() != null) approvalBelongTranItemVO.setRegionName(dept.getFatherDept().getName());
				}
			}

			DecorationPO decorationPO = decorationCache.get(approvalBelongTranItemPO.getOrderId());

			if (decorationPO == null) {

				decorationPO = decorationDao.queryDecorationByOrderId(approvalBelongTranItemPO.getOrderId());

				if (decorationPO != null) decorationCache.put(approvalBelongTranItemPO.getOrderId(), decorationPO);
			}

			if (decorationPO != null) {

				approvalBelongTranItemVO.setStatus(decorationPO.getStatus());

				if (decorationPO.getCustomer() != null) approvalBelongTranItemVO.setCustomerName(decorationPO.getCustomer().getName());
			}

			itemVOs.add(approvalBelongTranItemVO);
		}

		return itemVOs;
	}

}
