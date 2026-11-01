/**
 * @File Name		: ActivityServiceImpl.java
 * @Package   	: com.fanglin.information.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationActivityRecordDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityRecordPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.dao.ActivityRuleDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.po.ActivityRulePO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.information.service.ActivityService;
import com.fanglin.information.vo.ActivityVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("activityService")
@Transactional(readOnly = true)
public class ActivityServiceImpl implements ActivityService {

	@Autowired
	private ActivityDao activityDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ActivityRuleDao activityRuleDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Autowired
	private DecorationActivityRecordDao decorationActivityRecordDao;

	@Autowired
	private PaymentDao paymentDao;

	@Override
	public void pageActivity(Paging paging, List<Filter> filters, String userId, int company) {

		List<ActivityPO> activityPOs = activityDao.pageActivity(paging, filters, company);
		List<ActivityVO> activityVOs = new ArrayList<ActivityVO>();

		for (ActivityPO activityPO : activityPOs) {
			activityVOs.add(activityPO.ptv(new ActivityVO(new UserBaseVO())));
		}

		paging.setData(activityVOs);
	}

	@Override
	public List<ActivityVO> queryActivityForValid(ActivityVO activityVO, int company) {

		List<ActivityPO> activityPOs = activityDao.queryActivityForValid(company, activityVO.getType());
		List<ActivityVO> activityVOs = new ArrayList<ActivityVO>();

		for (ActivityPO activityPO : activityPOs) {
			activityVOs.add(activityPO.ptv(new ActivityVO(new UserBaseVO())));
		}

		return activityVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addActivity(ActivityVO activityVO, String userId, int company) {

		UserPO creater = userDao.queryUserByUserId(userId);

		ActivityPO activityPO = new ActivityPO();

		BeanUtil.copyProperties(activityVO, activityPO, Arrays.asList("creater"));

		activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		activityPO.setCreater(creater);

		activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);// 普通状态

		activityPO.setCompany(company);

		// 同公司同奖励类型窗口重叠唯一性闸(防两个抽奖活动叠加发双券); 新建活动 rewardType 恒为普通, 防御性校验
		if (activityPO.getRewardType() == ActivityPO.REWARDTYPE_LOTTERY_INT) {
			checkLotteryActivityUnique(activityPO);
		}

		activityDao.save(activityPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateActivity(ActivityVO activityVO) throws FLException {

		ActivityPO activityPO = activityDao.get(activityVO.getAid());

		if (activityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		activityPO.setName(activityVO.getName());
		activityPO.setEndTime(activityVO.getEndTime());
		activityPO.setContent(activityVO.getContent());
		activityPO.setValidays(activityVO.getValidays());
		activityPO.setExchange(activityVO.getExchange());
		activityPO.setAtttype(activityVO.getAtttype());

		if (activityVO.getPaytype() != null) activityPO.setPaytype(activityVO.getPaytype());

		activityDao.update(activityPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateActivityForStatus(ActivityVO activityVO) throws FLException {

		ActivityPO activityPO = activityDao.get(activityVO.getAid());

		if (activityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		if (activityPO.getDefaults() == ActivityPO.DEFAULTS_DEFAULT_INT) {
			throw new FLException(160047, "默认活动不可操作");
		}

		// 启用动作: 同公司同奖励类型窗口重叠唯一性闸(防两个抽奖活动叠加发双券)
		if (activityVO.getStatus() != null && activityVO.getStatus() == ActivityPO.STATUS_VALID_INT && activityPO.getRewardType() == ActivityPO.REWARDTYPE_LOTTERY_INT) {
			checkLotteryActivityUnique(activityPO);
		}

		activityPO.setStatus(activityVO.getStatus());

		activityDao.update(activityPO);
	}

	/**
	 * 抽奖活动唯一性闸: 同公司 + rewardType=抽奖券 + status=有效 + 时间窗重叠 (MySQL 5.6 无部分唯一索引, 应用层管)
	 */
	private void checkLotteryActivityUnique(ActivityPO activityPO) {

		List<ActivityPO> activityPOs = activityDao.queryActivityForLottery(activityPO.getCompany());

		long selfStart = activityPO.getStartTime() == null ? Long.MIN_VALUE : activityPO.getStartTime().getTime();
		long selfEnd = activityPO.getEndTime() == null ? Long.MAX_VALUE : activityPO.getEndTime().getTime();

		for (ActivityPO other : activityPOs) {
			if (other.getAid() == activityPO.getAid()) continue;

			long otherStart = other.getStartTime() == null ? Long.MIN_VALUE : other.getStartTime().getTime();
			long otherEnd = other.getEndTime() == null ? Long.MAX_VALUE : other.getEndTime().getTime();

			if (selfStart < otherEnd && selfEnd > otherStart) {
				throw new FLException(160063, String.format("该公司已存在窗口重叠的抽奖券活动[%s], 不可同时启用", other.getName()));
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateActivityForDefault(ActivityVO activityVO) throws FLException {

		ActivityPO activityPO = activityDao.get(activityVO.getAid());

		if (activityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		if (activityPO.getStatus() == ActivityPO.STATUS_UNVALID_INT) {// ==无有效的
			throw new FLException(160012, "活动当前状态不能修改");
		}

		activityDao.resetActivityForDefault(activityPO.getType(), activityPO.getCompany());

		activityPO.setDefaults(ActivityPO.DEFAULTS_DEFAULT_INT); // 更新为0(默认)

		activityDao.update(activityPO);
	}



	// ==================== 抽奖券发放引擎(收款/提现链插桩驱动 + 补发入口) ====================
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int issueActivityForLotteryByOrderId(String orderId, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) return 0;

		ActivityPO activityPO = queryLotteryActivity(decorationPO.getCompany());

		if (activityPO == null) return 0;

		List<ActivityRulePO> rules = activityRuleDao.queryActivityRuleForEnabled(activityPO.getAid());

		if (rules.isEmpty()) return 0;

		// 应得券数 = Σ(各启用规则行)
		long net = amountMaterialAdvance(activityPO, orderId);
		boolean signed = isSignedInWindow(decorationPO, activityPO);
		int entitlement = countEntitlement(rules, signed, net);

		// 已发有效券数(规则指向的奖品券行, 排除失效/退货)
		Set<Long> asids = collectAsids(rules);
		List<DecorationActivityItemPO> issuedItems = queryIssuedTickets(orderId, asids);
		int issued = issuedItems.size();

		int diff = entitlement - issued;

		if (diff > 0) {
			issueTickets(activityPO, rules, decorationPO, diff, userId);
		} else if (diff < 0) {
			abateTickets(orderId, asids, -diff, userId);
		}

		return diff;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int issueActivityForLottery(long aid, String userId) throws FLException {

		ActivityPO activityPO = activityDao.get(aid);

		if (activityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		if (activityPO.getStartTime() == null || activityPO.getEndTime() == null) {
			throw new FLException(160064, "活动窗口未配置, 无法执行抽奖券补发");
		}

		// 前置识别: 规则行奖品存在性一次校验, 配置错误直接抛出(240075), 不留到循环内单单失败
		List<ActivityRulePO> rules = activityRuleDao.queryActivityRuleForEnabled(activityPO.getAid());

		if (rules.isEmpty()) {
			throw new FLException(160064, "活动未配置奖励规则, 无法执行抽奖券补发");
		}

		for (ActivityRulePO rule : rules) {
			if (awardStockDao.get(rule.getAsid()) == null) {
				throw new FLException(240075, "奖品不存在");
			}
		}

		int count = 0;

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationForLottery(activityPO.getCompany(), activityPO.getStartTime(), activityPO.getEndTime());

		for (DecorationPO decorationPO : decorationPOs) {
			int diff = issueActivityForLotteryByOrderId(decorationPO.getOrderId(), userId);
			if (diff > 0) count += diff;
		}

		return count;
	}

	/**
	 * 定位公司当前有效的抽奖券活动(唯一性闸保证至多一条窗口重叠, 防御性取第一条命中窗口的)
	 */
	private ActivityPO queryLotteryActivity(int company) {

		Timestamp now = DateUtil.getDateToTimestamp(new Date());

		for (ActivityPO activityPO : activityDao.queryActivityForLottery(company)) {
			if (inWindow(activityPO.getStartTime(), activityPO.getEndTime(), now)) {
				return activityPO;
			}
		}

		return null;
	}

	/**
	 * 预存主材净额 = 活动窗口内 Σ(收款 recharge) − Σ(提现 recharge), 仅有效流水
	 */
	private long amountMaterialAdvance(ActivityPO activityPO, String orderId) {

		long net = 0;

		for (PaymentPO paymentPO : paymentDao.queryPaymentByOrderId(orderId)) {

			if (paymentPO.getPaymentType() != PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT) continue;
			if (paymentPO.getStatus() != PaymentPO.PAYMENT_STATUS_PAID_INT && paymentPO.getStatus() != PaymentPO.PAYMENT_STATUS_CONFIRMED_INT) continue;
			if (!inWindow(activityPO.getStartTime(), activityPO.getEndTime(), paymentPO.getCreateTime())) continue;

			if (paymentPO.getType() == PaymentPO.PAYMENT_TYPE_COLLECTION_INT) {
				net += paymentPO.getRecharge();
			} else if (paymentPO.getType() == PaymentPO.PAYMENT_TYPE_EXTRACT_INT) {
				net -= paymentPO.getRecharge();
			}
		}

		return net;
	}

	/**
	 * 签约判定: 合同签约时间落在活动窗口内(重签单 contractTime 为原签约时间, 同样命中)
	 */
	private boolean isSignedInWindow(DecorationPO decorationPO, ActivityPO activityPO) {
		return decorationPO.getContractTime() != null && inWindow(activityPO.getStartTime(), activityPO.getEndTime(), decorationPO.getContractTime());
	}

	/**
	 * Σ 规则行应得: 1=签约赠 2=预存每满(可封顶) 3=预存阶梯(同类型多行累加)
	 */
	private int countEntitlement(List<ActivityRulePO> rules, boolean signed, long net) {

		int entitlement = 0;

		for (ActivityRulePO rule : rules) {

			if (rule.getRuleType() == ActivityRulePO.RULETYPE_SIGN_INT) {
				if (signed) entitlement += rule.getTickets();

			} else if (rule.getRuleType() == ActivityRulePO.RULETYPE_EVERY_INT) {
				if (rule.getPerAmount() == null || rule.getPerAmount() <= 0) continue;
				if (net < rule.getPerAmount()) continue;
				long times = net / rule.getPerAmount();
				long count = times * rule.getTickets();
				if (rule.getMaxTickets() > 0 && count > rule.getMaxTickets()) count = rule.getMaxTickets();
				entitlement += (int) count;

			} else if (rule.getRuleType() == ActivityRulePO.RULETYPE_LADDER_INT) {
				if (net >= rule.getThreshold()) entitlement += rule.getTickets();
			}
		}

		return entitlement;
	}

	/**
	 * 补发: 一券一行, no = LT + 8位流水(daiId), 记轨迹; 不进 couponCut/thingCut 金额口径
	 */
	private void issueTickets(ActivityPO activityPO, List<ActivityRulePO> rules, DecorationPO decorationPO, int count, String userId) {

		UserPO creater = userDao.queryUserByUserId(userId);

		ActivityRulePO rule = pickTicketRule(rules);

		AwardStockPO awardStockPO = awardStockDao.get(rule.getAsid());

		if (awardStockPO == null) {
			throw new FLException(240075, "奖品不存在");
		}

		for (int i = 0; i < count; i++) {

			DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();

			decorationActivityItemPO.setAid(activityPO.getAid());
			decorationActivityItemPO.setAsid(awardStockPO.getAsId());
			decorationActivityItemPO.setOrderId(decorationPO.getOrderId());
			decorationActivityItemPO.setActivityName(activityPO.getName());
			decorationActivityItemPO.setActivityItemName(awardStockPO.getName());
			decorationActivityItemPO.setType(DecorationActivityItemPO.TYPE_COUPON_INT);
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_INIT_INT);
			decorationActivityItemPO.setAtttype(DecorationActivityItemPO.ATTTYPE_ONLINE_INT);
			decorationActivityItemPO.setNum(1);
			decorationActivityItemPO.setMoney(0);
			decorationActivityItemPO.setExpendPrice(0);
			decorationActivityItemPO.setDiscountPrice(0);
			decorationActivityItemPO.setIsPrefor(DecorationActivityItemPO.ISPREFOR_UNCAL_INT);
			decorationActivityItemPO.setIsStock(awardStockPO.getIsStock());
			decorationActivityItemPO.setIsPayment(DecorationActivityItemPO.ISPAYMENT_UNCAL_INT);
			decorationActivityItemPO.setCreater(creater);
			decorationActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationActivityItemDao.save(decorationActivityItemPO);

			decorationActivityItemPO.setNo(buildTicketNo(decorationActivityItemPO.getDaiId()));

			decorationActivityItemDao.update(decorationActivityItemPO);

			decorationActivityRecordDao.save(new DecorationActivityRecordPO().init(activityPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_INIT_INT, creater, "抽奖券自动发放"));
		}
	}

	/**
	 * 回收多余未中奖券: 仅 state=初始 且 awardName 为空(未中奖), daiId 逆序(后发的先收), 记轨迹
	 * 注: 不走 abateDecorationActivityItem——其拒绝签约单(140096), 且会触发金额重算
	 */
	private void abateTickets(String orderId, Set<Long> asids, int count, String userId) {

		UserPO operater = userDao.queryUserByUserId(userId);

		List<DecorationActivityItemPO> candidates = decorationActivityItemDao.queryDecorationActivityItemForLottery(orderId, new ArrayList<Long>(asids));

		int abated = 0;

		for (DecorationActivityItemPO decorationActivityItemPO : candidates) {
			if (abated >= count) break;

			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

			decorationActivityItemDao.update(decorationActivityItemPO);

			decorationActivityRecordDao.save(new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_UNVALID_INT, operater, "抽奖券自动回收(应得数下降)"));

			abated++;
		}
	}

	private List<DecorationActivityItemPO> queryIssuedTickets(String orderId, Set<Long> asids) {

		List<DecorationActivityItemPO> issuedItems = new ArrayList<DecorationActivityItemPO>();

		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemDao.queryDecorationActivityItemByOrderId(orderId)) {

			if (decorationActivityItemPO.getType() != DecorationActivityItemPO.TYPE_COUPON_INT) continue;
			if (!asids.contains(decorationActivityItemPO.getAsid())) continue;
			if (decorationActivityItemPO.getState() == DecorationActivityItemPO.STATUS_UNVALID_INT) continue;
			if (decorationActivityItemPO.getState() == DecorationActivityItemPO.STATUS_RETREAT_INT) continue;

			issuedItems.add(decorationActivityItemPO);
		}

		return issuedItems;
	}

	private Set<Long> collectAsids(List<ActivityRulePO> rules) {

		Set<Long> asids = new HashSet<Long>();

		for (ActivityRulePO rule : rules) {
			asids.add(rule.getAsid());
		}

		return asids;
	}

	/**
	 * 券品规则行: 优先每满/阶梯行, 兜底第一行
	 */
	private ActivityRulePO pickTicketRule(List<ActivityRulePO> rules) {

		for (ActivityRulePO rule : rules) {
			if (rule.getRuleType() != ActivityRulePO.RULETYPE_SIGN_INT) return rule;
		}

		return rules.get(0);
	}

	private String buildTicketNo(long daiId) {
		return String.format("LT%08d", daiId);
	}

	private boolean inWindow(Timestamp start, Timestamp end, Timestamp target) {

		if (target == null) return false;
		if (start != null && target.before(start)) return false;
		if (end != null && target.after(end)) return false;

		return true;
	}
}
