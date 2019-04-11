/**
 * @File Name		: ApprovalDecorationActivityServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalDecorationActivityDao;
import com.fanglin.approval.dao.ApprovalDecorationActivityItemDao;
import com.fanglin.approval.po.ApprovalDecorationActivityItemPO;
import com.fanglin.approval.po.ApprovalDecorationActivityPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalDecorationActivityService;
import com.fanglin.approval.vo.ApprovalDecorationActivityItemVO;
import com.fanglin.approval.vo.ApprovalDecorationActivityVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.dingding.service.ApprovalService;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalDecorationActivityService")
@Transactional(readOnly = true)
public class ApprovalDecorationActivityServiceImpl implements ApprovalDecorationActivityService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalDecorationActivityDao approvalDecorationActivityDao;

	@Autowired
	private ApprovalDecorationActivityItemDao approvalDecorationActivityItemDao;

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private ApprovalService approvalDDService;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private DecorationActivityDao decorationActivityDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForDecorationActivity(ApprovalVO approvalVO, ApprovalDecorationActivityVO approvalDecorationActivityVO, List<ApprovalDecorationActivityItemVO> approvalDecorationActivityItemVOs, String userId, int company)
			throws FLException {

		String orderId = approvalDecorationActivityVO.getOrderId();

		ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_TYPE_DECORATION_ACTIVITY_INT, orderId);

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT);

		if (!statuses.contains(decorationPO.getStatus())) {
			throw new FLException(140003, "装修单已签约");
		}

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}


		approvalPO = new ApprovalPO();

		BeanUtil.copyProperties(approvalVO, approvalPO, Arrays.asList("receiver", "sender"));

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(ApprovalPO.APPROVAL_SYSTEMCONFIG_DECORATIONACTIVITY_STR, company);

		if (systemConfigPO == null) {
			approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		} else {
			approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_APPROVE_INT);
			JSONArray formComponentValues = approvalDDService.getForms("说明", String.format(ApprovalPO.APPROVAL_CONTENTS_DECORATION_ACTIVITY_STR, approvalDecorationActivityVO.getOrderId(), approvalDecorationActivityVO.getActivityName()));
			String processinstanceid = approvalDDService.initiateApproval(systemConfigPO.getValue(), userId, approvalVO.getReceiver().getUserId(), null, null, formComponentValues, company);
			approvalPO.setProcessinstanceid(processinstanceid);
		}

		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_DECORATION_ACTIVITY_INT);
		approvalPO.setIdent(orderId);
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_DECORATION_ACTIVITY_STR, approvalDecorationActivityVO.getOrderId(), approvalDecorationActivityVO.getActivityName()));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);

		approvalDao.save(approvalPO);

		ApprovalDecorationActivityPO approvalDecorationActivityPO = new ApprovalDecorationActivityPO();
		BeanUtil.copyProperties(approvalDecorationActivityVO, approvalDecorationActivityPO);

		approvalDecorationActivityPO.setAid(approvalPO.getAid());

		approvalDecorationActivityDao.save(approvalDecorationActivityPO);

		for (ApprovalDecorationActivityItemVO approvalDecorationActivityItemVO : approvalDecorationActivityItemVOs) {
			ApprovalDecorationActivityItemPO approvalDecorationActivityItemPO = new ApprovalDecorationActivityItemPO();
			BeanUtil.copyProperties(approvalDecorationActivityItemVO, approvalDecorationActivityItemPO);

			approvalDecorationActivityItemPO.setAdaId(approvalDecorationActivityPO.getAdaId());

			approvalDecorationActivityItemDao.save(approvalDecorationActivityItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approvalForDecorationActivity(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationActivityPO approvalDecorationActivityPO = approvalDecorationActivityDao.queryApprovalDecorationActivityByAId(approvalPO.getAid());

		if (approvalDecorationActivityPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(approvalDecorationActivityPO.getOrderId());

		float couponCut = decorationPO.getCouponCut();
		float thingCut = decorationPO.getThingCut();

		List<ApprovalDecorationActivityItemPO> approvalDecorationActivityItemPOs = approvalDecorationActivityItemDao.queryApprovalDecorationActivityItemByAaId(approvalDecorationActivityPO.getAdaId());

		for (ApprovalDecorationActivityItemPO approvalDecorationActivityItemPO : approvalDecorationActivityItemPOs) {

			AwardStockPO awardStockPO = awardStockDao.get(approvalDecorationActivityItemPO.getAsid());

			if (awardStockPO == null) {
				throw new FLException(240003, "奖品不存在");
			}

			DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();
			BeanUtil.copyProperties(approvalDecorationActivityItemPO, decorationActivityItemPO);

			decorationActivityItemPO.setAid(approvalDecorationActivityPO.getActivityId());
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_INIT_INT);
			decorationActivityItemPO.setAsid(awardStockPO.getAsId());
			decorationActivityItemPO.setReceiveUserName("");
			decorationActivityItemPO.setIsPrefor(awardStockPO.getIsPrefor());
			decorationActivityItemPO.setIsStock(awardStockPO.getIsStock());
			decorationActivityItemPO.setIsPayment(awardStockPO.getIsPayment());

			if (Arrays.asList(DecorationActivityItemPO.TYPE_COUPON_INT, DecorationActivityItemPO.TYPE_SPECIALCOUPON_INT).contains(decorationActivityItemPO.getType())
					&& decorationActivityItemPO.getIsPrefor() == DecorationActivityItemPO.ISPREFOR_CAL_INT) {
				couponCut = Arith.add(couponCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
			} else if (Arrays.asList(DecorationActivityItemPO.TYPE_THING_INT, DecorationActivityItemPO.TYPE_SPECIALARTICLE_INT).contains(decorationActivityItemPO.getType())
					&& decorationActivityItemPO.getIsPrefor() == DecorationActivityItemPO.ISPREFOR_CAL_INT) {
				thingCut = Arith.add(thingCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
			}

			decorationActivityItemDao.save(decorationActivityItemPO);
		}

		List<DecorationActivityPO> decorationActivityPOs = decorationActivityDao.queryDecorationActivityByOrderId(decorationPO.getOrderId());

		for (DecorationActivityPO decorationActivityPO : decorationActivityPOs) {

			decorationActivityPO.setStatus(DecorationActivityPO.STATUS_LOCK_INT);

			decorationActivityDao.update(decorationActivityPO);

		}

		decorationPO.setCouponCut(couponCut);
		decorationPO.setThingCut(thingCut);

		decorationDao.update(decorationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<ApprovalDecorationActivityItemVO> queryApprovalDecorationActivity(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		ApprovalDecorationActivityPO approvalDecorationActivityPO = approvalDecorationActivityDao.queryApprovalDecorationActivityByAId(approvalPO.getAid());

		if (approvalDecorationActivityPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		List<ApprovalDecorationActivityItemPO> approvalDecorationActivityItemPOs = approvalDecorationActivityItemDao.queryApprovalDecorationActivityItemByAaId(approvalDecorationActivityPO.getAdaId());
		List<ApprovalDecorationActivityItemVO> approvalDecorationActivityItemVOs = new ArrayList<ApprovalDecorationActivityItemVO>();

		ApprovalDecorationActivityItemVO approvalDecorationActivityItemVO;

		for (ApprovalDecorationActivityItemPO approvalDecorationActivityItemPO : approvalDecorationActivityItemPOs) {

			approvalDecorationActivityItemVO = new ApprovalDecorationActivityItemVO();

			BeanUtil.copyProperties(approvalDecorationActivityItemPO, approvalDecorationActivityItemVO);

			approvalDecorationActivityItemVOs.add(approvalDecorationActivityItemVO);
		}
		return approvalDecorationActivityItemVOs;
	}

}
