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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.fanglin.decoration.dao.DecorationActivityRecordDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationActivityRecordPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationActivityCostService;
import com.fanglin.decoration.vo.ActivityCostVO;
import com.fanglin.information.dao.ActivityItemDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.ActivityItemPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
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
	private DecorationActivityRecordDao decorationActivityRecordDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private DecorationActivityDao decorationActivityDao;

	@Autowired
	private ActivityItemDao activityItemDao;

	@Autowired
	private DecorationActivityCostService decorationActivityCostService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForDecorationActivity(ApprovalVO approvalVO, ApprovalDecorationActivityVO approvalDecorationActivityVO, List<ApprovalDecorationActivityItemVO> approvalDecorationActivityItemVOs, String userId, int company) throws FLException {

		String orderId = approvalDecorationActivityVO.getOrderId();

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_DECORATION_ACTIVITY_INT, orderId);

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT);

		if (!statuses.contains(decorationPO.getStatus())) {
			throw new FLException(140003, "装修单已签约");
		}

		if (decorationActivityDao.countDecorationActivity(orderId, DecorationActivityPO.STATUS_LOCK_INT) > 0) {
			throw new FLException(140061, "已参加活动");
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		String content = String.format("装修单号:%s,参与活动:%s", approvalDecorationActivityVO.getOrderId(), approvalDecorationActivityVO.getActivityName());

		approvalPO = new ApprovalPO().init(sender, receiver, orderId, orderId, ApprovalPO.APPROVAL_TYPE_DECORATION_ACTIVITY_INT, content, approvalVO.getComment(), company);

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
	public int approveForDecorationActivity(ApprovalPO approvalPO) throws FLException {

		ApprovalDecorationActivityPO approvalDecorationActivityPO = approvalDecorationActivityDao.queryApprovalDecorationActivityByAId(approvalPO.getAid());

		if (approvalDecorationActivityPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(approvalDecorationActivityPO.getOrderId());

		long couponCut = decorationPO.getCouponCut();
		long thingCut = decorationPO.getThingCut();

		List<ApprovalDecorationActivityItemPO> approvalDecorationActivityItemPOs = approvalDecorationActivityItemDao.queryApprovalDecorationActivityItemByAaId(approvalDecorationActivityPO.getAdaId());

		// 额度类明细识别与合并校验: 同单同员工多明细合并金额一次校验(N 次现算 → 1 次)
		Map<Long, ActivityItemPO> costItemMap = new HashMap<Long, ActivityItemPO>();

		long costAmountSum = 0;

		for (ApprovalDecorationActivityItemPO approvalDecorationActivityItemPO : approvalDecorationActivityItemPOs) {

			List<ActivityItemPO> activityItemPOs = activityItemDao.queryActivityItemByAsid(approvalDecorationActivityItemPO.getAsid());

			ActivityItemPO activityItemPO = activityItemPOs != null && activityItemPOs.size() > 0 ? activityItemPOs.get(0) : null;

			if (decorationActivityCostService.isCostItem(activityItemPO)) {
				costItemMap.put(approvalDecorationActivityItemPO.getAsid(), activityItemPO);
				costAmountSum = Arith.add(costAmountSum, Arith.mul((long) approvalDecorationActivityItemPO.getMoney(), approvalDecorationActivityItemPO.getNum()));
			}
		}

		ActivityCostVO costSnapshot = costItemMap.size() > 0 ? decorationActivityCostService.queryActivityCost(decorationPO.getOrderId(), approvalPO.getSender().getUserId(), Arith.div(costAmountSum, 1000000L)) : null;

		for (ApprovalDecorationActivityItemPO approvalDecorationActivityItemPO : approvalDecorationActivityItemPOs) {

			AwardStockPO awardStockPO = awardStockDao.get(approvalDecorationActivityItemPO.getAsid());

			if (awardStockPO == null) {
				throw new FLException(240075, "奖品不存在");
			}

			DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();
			BeanUtil.copyProperties(approvalDecorationActivityItemPO, decorationActivityItemPO, "receiver");

			decorationActivityItemPO.setAid(approvalDecorationActivityPO.getActivityId());
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_INIT_INT);
			decorationActivityItemPO.setAsid(awardStockPO.getAsId());
			decorationActivityItemPO.setIsPrefor(awardStockPO.getIsPrefor());
			decorationActivityItemPO.setIsStock(awardStockPO.getIsStock());
			decorationActivityItemPO.setIsPayment(awardStockPO.getIsPayment());
			decorationActivityItemPO.setReceiveTime(approvalPO.getApprovalTime());

			// 额度类 type 服务端按配置覆盖(不信前端), type∈{10,11,12} 天然不进 couponCut/thingCut 金额口径(校验跳过时同样覆盖)
			ActivityItemPO activityItemPO = costItemMap.get(approvalDecorationActivityItemPO.getAsid());

			if (activityItemPO != null) {
				decorationActivityItemPO.setType(activityItemPO.getType());
			}

			if (costSnapshot != null && activityItemPO != null) {
				decorationActivityItemPO.setContent(costSnapshot.getSummary());
			}

			if (Arrays.asList(DecorationActivityItemPO.TYPE_COUPON_INT).contains(decorationActivityItemPO.getType()) && decorationActivityItemPO.getIsPayment() == DecorationActivityItemPO.ISPAYMENT_CAL_INT) {
				couponCut = Arith.add(couponCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
			} else if (Arrays.asList(DecorationActivityItemPO.TYPE_THING_INT).contains(decorationActivityItemPO.getType()) && decorationActivityItemPO.getIsPayment() == DecorationActivityItemPO.ISPAYMENT_CAL_INT) {
				thingCut = Arith.add(thingCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
			}

			decorationActivityItemPO.setCreater(approvalPO.getSender());
			decorationActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationActivityItemDao.save(decorationActivityItemPO);

			DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_INIT_INT, approvalPO.getSender(), "");

			decorationActivityRecordDao.save(decorationActivityRecordPO);

			// 校验结果缓存档(只写档: 不展示/不参与校验/系统逻辑不读; 仅实际校验通过时落行)
			if (costSnapshot != null && activityItemPO != null) {
				decorationActivityCostService.addActivityCost(decorationPO.getOrderId(), decorationActivityItemPO.getDaiId(), decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum(), costSnapshot, Integer.valueOf(decorationPO.getCompany()));
			}
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
