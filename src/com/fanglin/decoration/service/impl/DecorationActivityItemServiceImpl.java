/**
 * @File Name		: DecorationActivityItemServiceImpl.java
 * @Package   	: com.fanglin.decoration.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationActivityRecordDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityRecordPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationActivityCostService;
import com.fanglin.decoration.service.DecorationActivityItemService;
import com.fanglin.decoration.vo.ActivityCostVO;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.dao.ActivityItemDao;
import com.fanglin.information.dao.ActivityRuleDao;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.ActivityItemPO;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.po.ActivityRulePO;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.payment.dao.OalesPaymentDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("decorationActivityItemService")
@Transactional(readOnly = true)
public class DecorationActivityItemServiceImpl implements DecorationActivityItemService {

	private static final Logger log = LoggerFactory.getLogger(DecorationActivityItemServiceImpl.class);

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Autowired
	private DecorationActivityRecordDao decorationActivityRecordDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private AwardRecordDao awardRecordDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private ServiceRecordDao serviceRecordDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private WeChatAppService weChatAppService;

	@Autowired
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

	@Autowired
	private ActivityItemDao activityItemDao;

	@Autowired
	private DecorationActivityCostService decorationActivityCostService;

	@Autowired
	private ActivityDao activityDao;

	@Autowired
	private ActivityRuleDao activityRuleDao;

	@Autowired
	private PaymentDao paymentDao;

	@Autowired
	private OalesPaymentDao oalesPaymentDao;

	@Override
	public List<DecorationActivityItemVO> queryDecorationActivityItemByOrderId(DecorationVO decorationVO) {

		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItemByOrderId(decorationVO.getOrderId());
		List<DecorationActivityItemVO> decorationActivityItemVOs = new ArrayList<DecorationActivityItemVO>();

		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemPOs) {

			DecorationActivityItemVO decorationActivityItemVO = new DecorationActivityItemVO();

			BeanUtil.copyProperties(decorationActivityItemPO, decorationActivityItemVO, Arrays.asList("creater", "receiver", "refunder"));

			decorationActivityItemVO.setReceiver(new UserBaseVO());
			BeanUtil.copyProperties(decorationActivityItemPO.getReceiver(), decorationActivityItemVO.getReceiver(), Arrays.asList("dept", "duty"));

			decorationActivityItemVOs.add(decorationActivityItemVO);
		}

		return decorationActivityItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		// 额度类物品识别: aiid 优先(新前端必传), 兼容存量前端按 asid 反查; 反查不到配置视为非额度类走原逻辑
		ActivityItemPO activityItemPO = null;

		if (decorationActivityItemVO.getAiid() != null) {
			activityItemPO = activityItemDao.get(decorationActivityItemVO.getAiid());
		} else {
			List<ActivityItemPO> activityItemPOs = activityItemDao.queryActivityItemByAsid(decorationActivityItemVO.getAsid());
			activityItemPO = activityItemPOs != null && activityItemPOs.size() > 0 ? activityItemPOs.get(0) : null;
		}

		// 阶梯奖品物品(type=30): 添加即参与预占(每单一张, 窗口/清零守卫在 settle 内); 真实档位由签约/领取结算按库存定, 选中的 aiid 仅作活动锚点
		if (activityItemPO != null && activityItemPO.getType() == ActivityItemPO.TYPE_LADDER_LOTTERY_INT) {

			List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT);
			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemVO.getOrderId());

			if (decorationPO == null) {
				throw new FLException(140013, "装修单不存在");
			}

			if (!statuses.contains(decorationPO.getStatus())) {
				throw new FLException(140003, "装修单已签约");
			}

			if (settleLadderActivityItemForJoin(decorationActivityItemVO.getOrderId(), decorationActivityItemVO.getAid(), userId) == 0) {
				return 0;
			}

			// 回填预占券行 VO 供前端渲染(该单该活动 type=30 预占行)
			for (DecorationActivityItemPO ladderPreItem : decorationActivityItemDao.queryDecorationActivityItemByOrderId(decorationActivityItemVO.getOrderId())) {
				if (ladderPreItem.getType() == DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM && ladderPreItem.getState() == DecorationActivityItemPO.STATUS_INIT_INT && ladderPreItem.getAid() == decorationActivityItemVO.getAid()) {
					BeanUtil.copyProperties(ladderPreItem, decorationActivityItemVO, Arrays.asList("creater", "receiver", "refunder"));
					break;
				}
			}

			return 0;
		}

		// 签约/决算装修单额度类奖品锁死(140111): 按配置 type 判定, 配置查不到视为非额度放行
		ensureDecorationActivityItemOperable(decorationActivityItemVO.getOrderId(), activityItemPO == null ? (short) 0 : activityItemPO.getType());

		int money = decorationActivityItemVO.getMoney() == null ? 0 : decorationActivityItemVO.getMoney();
		int num = decorationActivityItemVO.getNum() == null ? 0 : decorationActivityItemVO.getNum();

		// 额度类物品(type>=10)创建前调 fl-yy validate 校验资格(现算, 身份=装修单设计师), 非额度类返回 null 走原逻辑
		ActivityCostVO costSnapshot = decorationActivityCostService.queryActivityCost(decorationActivityItemVO.getOrderId(), activityItemPO, money, num);

		AwardStockPO awardStockPO = awardStockDao.get(decorationActivityItemVO.getAsid());

		if (awardStockPO == null) {
			throw new FLException(240075, "奖品不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();

		BeanUtil.copyProperties(decorationActivityItemVO, decorationActivityItemPO, Arrays.asList("creater", "receiver", "refunder"));

		decorationActivityItemPO.setAid(decorationActivityItemVO.getAid());
		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_INIT_INT);
		decorationActivityItemPO.setAsid(awardStockPO.getAsId());
		decorationActivityItemPO.setIsPrefor(DecorationActivityItemPO.ISPREFOR_UNCAL_INT);
		decorationActivityItemPO.setIsStock(awardStockPO.getIsStock());
		decorationActivityItemPO.setIsPayment(DecorationActivityItemPO.ISPAYMENT_UNCAL_INT);

		// 额度类 type 服务端按配置覆盖(不信前端); 券族口径: 10额度券随券族计入 couponCut 金额, 11/12(额度-物品/红包)不进 couponCut/thingCut 金额口径
		if (decorationActivityCostService.isCostItem(activityItemPO)) {
			decorationActivityItemPO.setType(activityItemPO.getType());
		}

		if (costSnapshot != null) {
			decorationActivityItemPO.setContent(costSnapshot.getSummary());
		}

		decorationActivityItemPO.setCreater(creater);
		decorationActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemDao.save(decorationActivityItemPO);

		BeanUtil.copyProperties(decorationActivityItemPO, decorationActivityItemVO, Arrays.asList("creater", "receiver", "refunder"));

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_INIT_INT, creater, "");

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemVO.getOrderId());

		// 校验结果缓存档(只写档: 不展示/不参与校验/系统逻辑不读)
		if (costSnapshot != null) {
			decorationActivityCostService.addActivityCost(decorationActivityItemVO.getOrderId(), decorationActivityItemPO.getDaiId(), money, num, costSnapshot, decorationPO == null ? null : Integer.valueOf(decorationPO.getCompany()));
		}

		// 添加类操作同步 messagecueuing: args=orderId/daiId/designerId(装修单设计师, 空则缺省)
		messageQueuingDao.save(new MessageCueuingPO().init(decorationActivityItemVO.getOrderId(), "addDecorationActivityItem", "{\"orderId\":\"" + decorationActivityItemVO.getOrderId() + "\",\"daiId\":\"" + decorationActivityItemPO.getDaiId() + "\"" + (decorationPO != null && decorationPO.getDesigner() != null ? ",\"designerId\":\"" + decorationPO.getDesigner().getUserId() + "\"" : "") + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

		// 阶梯抽奖券: 领取走结算决策(实时判断剩余数量是否变化——有货发放已领/降级换行, 无货拒绝; 签约后领取闭环)
		if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM) {
			return settleLadderActivityItem(null, null, Long.valueOf(decorationActivityItemVO.getDaiId()), LADDER_SCENE_RECEIVE, userId);
		}

		// 签约/决算装修单额度类奖品锁死(140111)
		ensureDecorationActivityItemOperable(decorationActivityItemPO.getOrderId(), decorationActivityItemPO.getType());

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140102, "装修活动奖品不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_RECEIVE_INT);

		decorationActivityItemPO.setReceiver(operater);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemPO.setContent(decorationActivityItemVO.getContent());

		decorationActivityItemDao.update(decorationActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(decorationActivityItemPO.getAsid());

		if (decorationActivityItemPO.getIsStock() == DecorationActivityItemPO.ISSTOCK_CAL_INT) {

			int num = Arith.sub(awardStockPO.getNum(), decorationActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "库存不足");
			}

			awardStockPO.setNum(num);

			awardStockDao.update(awardStockPO);
		}

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, operater, decorationActivityItemPO.getOrderId(), AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_RECEIVE_INT, AwardRecordPO.ONETYPE_DECORATION_INT, decorationActivityItemPO.getIsStock(), decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum(), decorationActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_RECEIVE_INT, operater, decorationActivityItemVO.getContent());

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int abateDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140102, "装修活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT);

		if (!statuses.contains(decorationPO.getStatus())) {
			throw new FLException(140096, "装修单已签约");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setReceiver(operater);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));
		decorationActivityItemPO.setContent(decorationActivityItemVO.getContent());
		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

		decorationActivityItemDao.update(decorationActivityItemPO);
		decorationActivityItemDao.flush();

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_UNVALID_INT, operater, decorationActivityItemVO.getContent());

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		// 删除类(作废)操作同步 messagecueuing: args=orderId/daiId/designerId
		messageQueuingDao.save(new MessageCueuingPO().init(decorationActivityItemPO.getOrderId(), "abateDecorationActivityItem", "{\"orderId\":\"" + decorationActivityItemPO.getOrderId() + "\",\"daiId\":\"" + decorationActivityItemPO.getDaiId() + "\"" + (decorationPO.getDesigner() != null ? ",\"designerId\":\"" + decorationPO.getDesigner().getUserId() + "\"" : "") + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deliveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

		// 阶梯抽奖券: 领取走结算决策(实时判断剩余数量是否变化——有货发放已领/降级换行, 无货拒绝; 签约后领取闭环)
		if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM) {
			return settleLadderActivityItem(null, null, Long.valueOf(decorationActivityItemVO.getDaiId()), LADDER_SCENE_RECEIVE, userId);
		}

		// 签约/决算装修单额度类奖品锁死(140111)
		ensureDecorationActivityItemOperable(decorationActivityItemPO.getOrderId(), decorationActivityItemPO.getType());

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140102, "装修活动奖品不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_DELIVERY_INT);

		decorationActivityItemPO.setReceiver(operater);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemPO.setContent(decorationActivityItemVO.getContent());

		decorationActivityItemDao.update(decorationActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(decorationActivityItemPO.getAsid());

		if (decorationActivityItemPO.getIsStock() == DecorationActivityItemPO.ISSTOCK_CAL_INT) {

			int num = Arith.sub(awardStockPO.getNum(), decorationActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "库存不足");
			}

			awardStockPO.setNum(num);

			awardStockDao.update(awardStockPO);
		}

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_DELIVERY_INT, operater, decorationActivityItemVO.getContent());

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, operater, decorationActivityItemPO.getOrderId(), AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_DELIVERY_INT, AwardRecordPO.ONETYPE_DECORATION_INT, decorationActivityItemPO.getIsStock(), decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum(), decorationActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unrefundDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

		// 阶梯抽奖券: 领取走结算决策(实时判断剩余数量是否变化——有货发放已领/降级换行, 无货拒绝; 签约后领取闭环)
		if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM) {
			return settleLadderActivityItem(null, null, Long.valueOf(decorationActivityItemVO.getDaiId()), LADDER_SCENE_RECEIVE, userId);
		}

		// 签约/决算装修单额度类奖品锁死(140111)
		ensureDecorationActivityItemOperable(decorationActivityItemPO.getOrderId(), decorationActivityItemPO.getType());

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_RECEIVE_INT) {
			throw new FLException(140102, "装修活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_WAIT_INT);

		decorationActivityItemPO.setRefunder(operater);
		decorationActivityItemPO.setRefundTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemDao.update(decorationActivityItemPO);
		decorationActivityItemDao.flush();

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_WAIT_INT, operater, decorationActivityItemVO.getComment());

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

		// 阶梯抽奖券: 领取走结算决策(实时判断剩余数量是否变化——有货发放已领/降级换行, 无货拒绝; 签约后领取闭环)
		if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM) {
			return settleLadderActivityItem(null, null, Long.valueOf(decorationActivityItemVO.getDaiId()), LADDER_SCENE_RECEIVE, userId);
		}

		// 签约/决算装修单额度类奖品锁死(140111)
		ensureDecorationActivityItemOperable(decorationActivityItemPO.getOrderId(), decorationActivityItemPO.getType());

		List<Short> status = Arrays.asList(new Short[] { DecorationActivityItemPO.STATUS_RECEIVE_INT, DecorationActivityItemPO.STATUS_DELIVERY_INT, DecorationActivityItemPO.STATUS_WAIT_INT });

		if (!status.contains(decorationActivityItemPO.getState())) {
			throw new FLException(140102, "装修活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_RETREAT_INT);

		decorationActivityItemPO.setRefunder(operater);
		decorationActivityItemPO.setRefundTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemPO.setComment(decorationActivityItemVO.getComment());

		decorationActivityItemDao.update(decorationActivityItemPO);
		decorationActivityItemDao.flush();

		AwardStockPO awardStockPO = awardStockDao.get(decorationActivityItemPO.getAsid());

		if (decorationActivityItemPO.getIsStock() == DecorationActivityItemPO.ISSTOCK_CAL_INT) {

			int num = Arith.add(awardStockPO.getNum(), decorationActivityItemPO.getNum());

			awardStockPO.setNum(num);

			awardStockDao.update(awardStockPO);
		}

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_RETREAT_INT, operater, decorationActivityItemVO.getComment());

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, operater, decorationActivityItemPO.getOrderId(), AwardRecordPO.TYPE_CG_INT, AwardRecordPO.SUBTYPE_REFUND_INT, AwardRecordPO.ONETYPE_DECORATION_INT, decorationActivityItemPO.getIsStock(), decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum(), decorationActivityItemVO.getComment());

		awardRecordDao.save(awardRecordPO);

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		// 删除类(退款)操作同步 messagecueuing: args=orderId/daiId/designerId
		messageQueuingDao.save(new MessageCueuingPO().init(decorationActivityItemPO.getOrderId(), "refundDecorationActivityItem", "{\"orderId\":\"" + decorationActivityItemPO.getOrderId() + "\",\"daiId\":\"" + decorationActivityItemPO.getDaiId() + "\"" + (decorationPO.getDesigner() != null ? ",\"designerId\":\"" + decorationPO.getDesigner().getUserId() + "\"" : "") + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int expendDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

		// 阶梯抽奖券: 领取走结算决策(实时判断剩余数量是否变化——有货发放已领/降级换行, 无货拒绝; 签约后领取闭环)
		if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM) {
			return settleLadderActivityItem(null, null, Long.valueOf(decorationActivityItemVO.getDaiId()), LADDER_SCENE_RECEIVE, userId);
		}

		// 签约/决算装修单额度类奖品锁死(140111)
		ensureDecorationActivityItemOperable(decorationActivityItemPO.getOrderId(), decorationActivityItemPO.getType());

		List<Short> status = Arrays.asList(new Short[] { DecorationActivityItemPO.STATUS_RECEIVE_INT, DecorationActivityItemPO.STATUS_DELIVERY_INT, DecorationActivityItemPO.STATUS_DISCOUNT_INT });

		if (!status.contains(decorationActivityItemPO.getState())) {
			throw new FLException(140102, "装修活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_CONSUME_INT);

		decorationActivityItemPO.setRefunder(operater);
		decorationActivityItemPO.setRefundTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemPO.setComment(decorationActivityItemVO.getComment());

		decorationActivityItemDao.update(decorationActivityItemPO);
		decorationActivityItemDao.flush();

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_CONSUME_INT, operater, decorationActivityItemVO.getComment());

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int discountDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

		// 阶梯抽奖券: 领取走结算决策(实时判断剩余数量是否变化——有货发放已领/降级换行, 无货拒绝; 签约后领取闭环)
		if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM) {
			return settleLadderActivityItem(null, null, Long.valueOf(decorationActivityItemVO.getDaiId()), LADDER_SCENE_RECEIVE, userId);
		}

		// 签约/决算装修单额度类奖品锁死(140111)
		ensureDecorationActivityItemOperable(decorationActivityItemPO.getOrderId(), decorationActivityItemPO.getType());

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140102, "装修活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_DISCOUNT_INT);

		decorationActivityItemPO.setReceiver(operater);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemPO.setContent(decorationActivityItemVO.getContent());

		decorationActivityItemDao.update(decorationActivityItemPO);
		decorationActivityItemDao.flush();

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_DISCOUNT_INT, operater, decorationActivityItemVO.getContent());

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int consumeDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

		// 阶梯抽奖券: 领取走结算决策(实时判断剩余数量是否变化——有货发放已领/降级换行, 无货拒绝; 签约后领取闭环)
		if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM) {
			return settleLadderActivityItem(null, null, Long.valueOf(decorationActivityItemVO.getDaiId()), LADDER_SCENE_RECEIVE, userId);
		}

		// 签约/决算装修单额度类奖品锁死(140111)
		ensureDecorationActivityItemOperable(decorationActivityItemPO.getOrderId(), decorationActivityItemPO.getType());

		// 会员/线上物品(atttype=1)由积分商城同步产生, 初始即已领(STATUS_RECEIVE_INT); 装修/线下物品仅初始可核销
		if (decorationActivityItemPO.getAtttype() == DecorationActivityItemPO.ATTTYPE_ONLINE_INT) {
			if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT && decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_RECEIVE_INT) {
				throw new FLException(140102, "装修活动奖品不可操作");
			}
		} else if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140102, "装修活动奖品不可操作");
		}

		// 校验有效期：如果已过有效期则不允许核销
		if (decorationActivityItemPO.getExpireTime() != null && decorationActivityItemPO.getExpireTime().before(new Date())) {
			throw new FLException(140058, "活动奖品已过期, 无法核销");
		}

		// 校验是否重复核销：同一装修单orderId下不允许重复核销
		if (decorationActivityItemDao.countDecorationActivityItem(decorationActivityItemPO.getOrderId(), null, Arrays.asList(DecorationActivityItemPO.STATUS_VERIFY_INT), null, null) > 0) {
			throw new FLException(140094, "当前装修单已核销过活动奖品, 不可重复核销");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_VERIFY_INT);

		decorationActivityItemPO.setReceiver(operater);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemPO.setContent(decorationActivityItemVO.getContent());

		decorationActivityItemDao.update(decorationActivityItemPO);
		decorationActivityItemDao.flush();

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_VERIFY_INT, operater, decorationActivityItemVO.getContent());

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		// 生成消息队列数据
		messageQueuingDao.save(new MessageCueuingPO().init(decorationActivityItemPO.getOrderId(), "consumeDecorationActivityItem", "{\"orderId\":\"" + decorationActivityItemPO.getOrderId() + "\",\"daiId\":\"" + decorationActivityItemPO.getDaiId() + "\",\"status\":\"" + DecorationActivityItemPO.STATUS_VERIFY_INT + "\",\"userId\":\"" + userId + "\",\"event\":\"ACTIVITY_ITEM_VERIFIED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + buildCcidArgs(decorationActivityItemPO.getOrderId()) + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int amountDecorationActivityItem(DecorationVO decorationVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (!Arrays.asList(DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_FINAL_INT).contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		long couponCut = decorationActivityItemDao.amountDecorationActivityItem(orderId, DecorationActivityItemPO.TYPE_COUPON_INT, null, DecorationActivityItemPO.ISPAYMENT_CAL_INT);
		long thingCut = decorationActivityItemDao.amountDecorationActivityItem(orderId, DecorationActivityItemPO.TYPE_THING_INT, null, DecorationActivityItemPO.ISPAYMENT_CAL_INT);

		decorationPO.setCouponCut(couponCut);
		decorationPO.setThingCut(thingCut);
		decorationPO.setFactPrice(Arith.sub(decorationPO.getOrderTotalPrice(), couponCut));

		decorationDao.update(decorationPO);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, orderId, String.format("统计装修活动项,装修单:%s", orderId)));

		return 0;
	}

	@Override
	public long pointDecorationActivityItem(DecorationVO decorationVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		return decorationActivityItemDao.pointDecorationActivityItem(orderId);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		String orderId = decorationActivityItemVO.getOrderId();

		UserPO creater = userDao.queryUserByUserId(userId);

		log.info(String.format("pages/decoration/activityItem/activityItem?orderId=%s&daiIds=%s", orderId, decorationActivityItemVO.getContent()));

		decorationService.sendMessage(orderId, "装修单", "请您及时查收点确认礼品领取信息.", String.format("pages/decoration/activityItem/activityItem?orderId=%s&daiIds=%s", orderId, decorationActivityItemVO.getContent()), creater);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirmDecorationActivityItem(DecorationVO decorationVO, List<DecorationActivityItemVO> decorationActivityItems, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (decorationVO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			decorationVO.getCustomer().setPhone(weChatPhoneInfoVO.getPhoneNumber());
		}

		if (decorationVO.getCustomer().getPhone() != null && !SensitiveDataHelper.decrypt(decorationPO.getCustomer().getPhone()).equals(decorationVO.getCustomer().getPhone())) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cusDecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cusDecorationVO.setOrderId(orderId);
		cusDecorationVO.setUnionId(decorationVO.getCustomer().getNo());

		if (decorationVO.getCustomer().getNo() != null && decorationService.queryDecoration(cusDecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

		for (DecorationActivityItemVO decorationActivityItem : decorationActivityItems) {

			DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItem.getDaiId());

			if (decorationActivityItemPO == null) continue;

			if (decorationActivityItemPO.getIsAffirm() == DecorationActivityItemPO.ISAFFIRM_INIT_INT && decorationActivityItemPO.getState() == DecorationActivityItemPO.STATUS_INIT_INT) {

				decorationActivityItemPO.setIsAffirm(DecorationActivityItemPO.ISAFFIRM_CONFIRMED_INT);
				decorationActivityItemPO.setAffirmTime(DateUtil.getDateToTimestamp(new Date()));
			}

			if (decorationActivityItemPO.getIsAffirm() == DecorationActivityItemPO.ISAFFIRM_CONFIRMED_INT && !Arrays.asList(DecorationActivityItemPO.STATUS_INIT_INT, DecorationActivityItemPO.STATUS_RETREAT_INT, DecorationActivityItemPO.STATUS_CONSUME_INT).contains(decorationActivityItemPO.getState())) {

				decorationActivityItemPO.setIsAffirm(DecorationActivityItemPO.ISAFFIRM_CHECKED_INT);
				decorationActivityItemPO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));
			}

			decorationActivityItemDao.update(decorationActivityItemPO);
		}

		return 0;
	}

	// 签约/决算装修单额度类奖品锁死守卫(140111): 额度类 type∈{10,11,12} 且装修单状态∈{签约3, 决算7, 签约可终止33} 时拒绝操作
	private void ensureDecorationActivityItemOperable(String orderId, short type) throws FLException {

		if (type < DecorationActivityItemPO.TYPE_COST_COUPON_INT || type > DecorationActivityItemPO.TYPE_COST_REDPACKAGE_INT) {
			return;
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_FINAL_INT, DecorationPO.STATUS_SIGNEDTERMINABLE_INT);

		if (statuses.contains(decorationPO.getStatus())) {
			throw new FLException(140111, "装修单已签约或决算,活动奖品不可操作");
		}
	}

	private void subDecorationForCut(DecorationPO decorationPO, DecorationActivityItemPO decorationActivityItemPO) {

		long couponCut = decorationActivityItemDao.amountDecorationActivityItem(decorationPO.getOrderId(), DecorationActivityItemPO.TYPE_COUPON_INT, null, DecorationActivityItemPO.ISPAYMENT_CAL_INT);
		long thingCut = decorationActivityItemDao.amountDecorationActivityItem(decorationPO.getOrderId(), DecorationActivityItemPO.TYPE_THING_INT, null, DecorationActivityItemPO.ISPAYMENT_CAL_INT);

		decorationPO.setCouponCut(couponCut);
		decorationPO.setThingCut(thingCut);
		decorationPO.setFactPrice(Arith.sub(decorationPO.getOrderTotalPrice(), couponCut));

		decorationDao.update(decorationPO);
	}

	private String buildCcidArgs(String orderId) {

		if (orderId == null) return "";

		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChance(orderId);

		return customerChancePO != null ? ",\"ccid\":" + customerChancePO.getCcid() : "";
	}

	// ==================== 抽奖券发放(收款/提现链插桩驱动 + 补发入口) ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int issueDecorationActivityItemByOrderId(String orderId, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) return 0;

		// 定位公司当前有效窗口内的抽奖活动(type=抽奖券, 窗口条件在DAO)
		ActivityPO activityPO = activityDao.queryActivityForLottery(decorationPO.getCompany(), DateUtil.getDateToTimestamp(new Date()));

		if (activityPO == null) return 0;

		List<ActivityRulePO> rules = activityRuleDao.queryActivityRuleForEnabled(activityPO.getAid());

		if (rules.isEmpty()) return 0;

		// 场外款并入闸门: 仅活动配置了场外规则行(ruleType=4 纯标记行, 有此行的公司才计算场外, 门槛/基数与主材预存共用, 43号SQL)才并入场外款
		boolean oalesEnabled = false;

		for (ActivityRulePO gateRule : rules) {
			if (gateRule.getRuleType() == ActivityRulePO.RULETYPE_OALES_MERGE_INT) {
				oalesEnabled = true;
				break;
			}
		}

		// 预存主材净额 = 活动窗口内收款(type=1) − 提现(type=0) + 外销款净额(收款type=0 − 退款type=1, 同窗同状态口径), 仅有效流水(DAO sum);
		// 外销款在基数源头并入, 与主材预存合并参与每满/阶梯计算(独立基数已被需求否决), 无在窗活动时引擎在上方已返回, 不触达求和;
		// 无场外标记行的公司 oalesNet 恒 0, 连外销款查询都不发生(与公司无在窗活动时跳过主材求和同构)
		long oalesNet = oalesEnabled ? oalesPaymentDao.amountOalesPaymentForLottery(orderId, activityPO.getStartTime(), activityPO.getEndTime()) : 0;

		long net = paymentDao.amountPayment(orderId, PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT, activityPO.getStartTime(), activityPO.getEndTime()) + oalesNet;

		// 签约判定: 合同签约时间落在活动窗口内(重签单 contractTime 为原签约时间, 同样命中);
		// 退单排除: 合同终止(6)/废单(5)/重签(4, 合同作废待重签)视同未签约 → 已发签约赠随应得数下降被自动回收;
		// 重签完成后重新签约回到状态3且contractTime刷新在窗口内 → 再次触发时签约赠重新补发
		boolean retired = Arrays.asList(DecorationPO.STATUS_TERMINATION_INT, DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_RESIGNED_INT).contains(decorationPO.getStatus());

		boolean signed = !retired && decorationPO.getContractTime() != null && (activityPO.getStartTime() == null || !decorationPO.getContractTime().before(activityPO.getStartTime())) && (activityPO.getEndTime() == null || !decorationPO.getContractTime().after(activityPO.getEndTime()));

		// 应得券数 = Σ规则行: 1=签约赠 2=预存每满(可封顶) 3=预存阶梯; 顺手收集发放说明段
		Set<Long> asids = new HashSet<Long>();

		List<String> ruleSegments = new ArrayList<String>();

		int entitlement = 0;

		// 现存有效的规则段(回收时反向匹配: 券行content不含任何现存段=该券的发放依据已消失, 优先回收)
		Set<String> activeSegments = new HashSet<String>();

		for (ActivityRulePO rule : rules) {
			asids.add(rule.getAsid());
			if (rule.getRuleType() == ActivityRulePO.RULETYPE_SIGN_INT) {
				if (signed) {
					entitlement += rule.getTickets();
					ruleSegments.add("签约赠" + rule.getTickets() + "张");
					activeSegments.add("签约赠" + rule.getTickets() + "张");
				}
			} else if (rule.getRuleType() == ActivityRulePO.RULETYPE_EVERY_INT) {
				if (rule.getPerAmount() != null && rule.getPerAmount() > 0 && net >= rule.getPerAmount()) {
					long count = (net / rule.getPerAmount()) * rule.getTickets();
					if (rule.getMaxTickets() > 0 && count > rule.getMaxTickets()) count = rule.getMaxTickets();
					entitlement += (int) count;
					String segment = "预存主材款每满" + (rule.getPerAmount() / 1000) + "元赠" + rule.getTickets() + "张";
					ruleSegments.add(segment);
					activeSegments.add(segment.replace("(封顶" + rule.getMaxTickets() + "张)", ""));
				}
			} else if (rule.getRuleType() == ActivityRulePO.RULETYPE_LADDER_INT) {
				if (net >= rule.getThreshold()) {
					entitlement += rule.getTickets();
					String segment = "预存主材款满" + (rule.getThreshold() / 1000) + "元赠" + rule.getTickets() + "张";
					ruleSegments.add(segment);
					activeSegments.add(segment);
				}
			}
		}

		// 已发有效券数(count): 排除失效/退货; 抽奖(11)/已领(10)等非初始态天然不在补发对齐范围
		int diff = entitlement - decorationActivityItemDao.countDecorationActivityItemForLottery(orderId, new ArrayList<Long>(asids));

		if (diff == 0) return 0;

		UserPO creater = userDao.queryUserByUserId(userId);

		if (diff > 0) {
			// 补发: 券行 state=初始, no=LT+8位流水, 记轨迹; 优先每满/阶梯行奖品
			// 🔴String.join 系 Java 8 API(1.7 JVM 报 NoSuchMethodError, 同EsignClient签名串先例), 改 StringBuilder 逐段拼接(拼接结果一致)
			StringBuilder issueContentBuilder = new StringBuilder(activityPO.getName()).append("：");

			for (int i = 0; i < ruleSegments.size(); i++) {
				if (i > 0) issueContentBuilder.append("；");
				issueContentBuilder.append(ruleSegments.get(i));
			}

			// 尾部摘要(非回收锚, 规则段措辞才是): 外销款参与合并基数时追加读数, 便于事后对账
			issueContentBuilder.append("；活动期内主材预存净额").append(net / 1000).append("元");

			if (oalesNet != 0) {
				issueContentBuilder.append("(含外销款").append(oalesNet / 1000).append("元)");
			}

			String issueContent = issueContentBuilder.toString();

			ActivityRulePO rule = rules.get(0);

			for (ActivityRulePO r : rules) {
				if (r.getRuleType() != ActivityRulePO.RULETYPE_SIGN_INT) {
					rule = r;
					break;
				}
			}

			AwardStockPO awardStockPO = awardStockDao.get(rule.getAsid());

			if (awardStockPO == null) {
				throw new FLException(240075, "奖品不存在");
			}

			for (int i = 0; i < diff; i++) {

				DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();

				decorationActivityItemPO.setAid(activityPO.getAid());
				decorationActivityItemPO.setAsid(awardStockPO.getAsId());
				decorationActivityItemPO.setOrderId(orderId);
				decorationActivityItemPO.setActivityName(activityPO.getName());
				decorationActivityItemPO.setActivityItemName(awardStockPO.getName());
				// 类型: 20=抽奖券(区别于0=活动券, 抽奖券不参与券/物品优惠合计; 引擎发放口径与count/recycle的type过滤三处一致)
				decorationActivityItemPO.setType(DecorationActivityItemPO.TYPE_LOTTERY_ACTIVITY_ITEM);
				decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_INIT_INT);
				// atttype=0(线下): 券行不参与线上物品签约自动核销链(banch 仅按 atttype=1 圈行), 避免签约时被误核销
				decorationActivityItemPO.setAtttype(DecorationActivityItemPO.ATTTYPE_OFFLINE_INT);
				decorationActivityItemPO.setNum(1);
				decorationActivityItemPO.setMoney(0);
				decorationActivityItemPO.setExpendPrice(0);
				decorationActivityItemPO.setDiscountPrice(0);
				decorationActivityItemPO.setIsPrefor(DecorationActivityItemPO.ISPREFOR_UNCAL_INT);
				decorationActivityItemPO.setIsStock(awardStockPO.getIsStock());
				decorationActivityItemPO.setIsPayment(DecorationActivityItemPO.ISPAYMENT_UNCAL_INT);
				decorationActivityItemPO.setCreater(creater);
				decorationActivityItemPO.setContent(issueContent);
				decorationActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

				decorationActivityItemDao.save(decorationActivityItemPO);

				decorationActivityItemPO.setNo(String.format("LT%08d", decorationActivityItemPO.getDaiId()));

				decorationActivityItemDao.update(decorationActivityItemPO);

				decorationActivityRecordDao.save(new DecorationActivityRecordPO().init(activityPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_INIT_INT, creater, "抽奖券自动发放"));
			}
		} else {
			// 回收: 退"发放依据已消失"的券——券行content与现存规则段比对, 不含任何现存段(如签约赠因退单消失/某档每满因提现跌破)的优先收;
			// 同组内 daiId 逆序(后发的先收); 候选=state初始(0), 抽奖(11)/已领(10)等非初始态天然不在候选, 已参与抽奖的券绝不回收
			List<DecorationActivityItemPO> candidates = decorationActivityItemDao.queryDecorationActivityItemForLottery(orderId, new ArrayList<Long>(asids));

			List<DecorationActivityItemPO> candidatesPool = new ArrayList<DecorationActivityItemPO>();

			List<DecorationActivityItemPO> orphanFirst = new ArrayList<DecorationActivityItemPO>();

			for (DecorationActivityItemPO decorationActivityItemPO : candidates) {
				String couponContent = decorationActivityItemPO.getContent() == null ? "" : decorationActivityItemPO.getContent();

				boolean active = false;

				for (String segment : activeSegments) {
					if (couponContent.contains(segment)) {
						active = true;
						break;
					}
				}

				if (!active) orphanFirst.add(decorationActivityItemPO);
				else candidatesPool.add(decorationActivityItemPO);
			}

			orphanFirst.addAll(candidatesPool); // 孤儿券(依据消失)在前, 仍有效依据的在后兜底

			int abated = 0;

			for (DecorationActivityItemPO decorationActivityItemPO : orphanFirst) {
				if (abated >= -diff) break;

				decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

				decorationActivityItemDao.update(decorationActivityItemPO);

				decorationActivityRecordDao.save(new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_UNVALID_INT, creater, "抽奖券自动回收(应得数下降)"));

				abated++;
			}
		}

		return diff;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int issueDecorationActivityItem(long aid, String userId) throws FLException {

		ActivityPO activityPO = activityDao.get(aid);

		if (activityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		if (activityPO.getStartTime() == null || activityPO.getEndTime() == null) {
			throw new FLException(160064, "活动窗口未配置, 无法执行抽奖券补发");
		}

		List<ActivityRulePO> rules = activityRuleDao.queryActivityRuleForEnabled(aid);

		if (rules.isEmpty()) {
			throw new FLException(160064, "活动未配置奖励规则, 无法执行抽奖券补发");
		}

		// 前置识别: 规则行奖品存在性一次校验, 配置错误直接抛出(240075)
		for (ActivityRulePO rule : rules) {
			if (awardStockDao.get(rule.getAsid()) == null) {
				throw new FLException(240075, "奖品不存在");
			}
		}

		int count = 0;

		for (DecorationPO decorationPO : decorationDao.queryDecorationForLottery(activityPO.getCompany(), activityPO.getEndTime())) {
			int diff = issueDecorationActivityItemByOrderId(decorationPO.getOrderId(), userId);
			if (diff > 0) count += diff;
		}

		return count;
	}

	@Override
	@Transactional(readOnly = true)
	public void pageDecorationActivityItem(Paging paging, List<Filter> filters) throws FLException {

		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.pageDecorationActivityItem(paging, filters);

		List<DecorationActivityItemVO> decorationActivityItemVOs = new ArrayList<DecorationActivityItemVO>();

		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemPOs) {

			DecorationActivityItemVO decorationActivityItemVO = new DecorationActivityItemVO();

			BeanUtil.copyProperties(decorationActivityItemPO, decorationActivityItemVO, Arrays.asList("creater", "receiver", "refunder"));

			decorationActivityItemVOs.add(decorationActivityItemVO);
		}

		paging.setData(decorationActivityItemVOs);
	}

	// ==================== 阶梯抽奖活动(等级优先级+剩余量降级发放) ====================

	private static final short LADDER_SCENE_JOIN = 0; // 参与: 预占
	private static final short LADDER_SCENE_CONTRACT = 1; // 签约: 结算
	private static final short LADDER_SCENE_RECEIVE = 2; // 领取: 结算

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int settleLadderActivityItemForJoin(String orderId, long aid, String userId) throws FLException {
		return settleLadderActivityItem(orderId, Long.valueOf(aid), null, LADDER_SCENE_JOIN, userId);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int settleLadderActivityItemForContract(String orderId, String userId) throws FLException {
		return settleLadderActivityItem(orderId, null, null, LADDER_SCENE_CONTRACT, userId);
	}

	/**
	 * 阶梯结算核心: 参与=按水位预占(只读不扣库存); 签约/领取=原子扣减降级循环
	 * (🔴并发安全: UPDATE num-1 WHERE num>0 失败即降下一级, 原先查后扣两单并发抢最后一张会 num=−1 超发;
	 *   活动定位: 参与=前端选定活动; 签约/领取=以预占行 aid 锚定——参与在窗内, 签约/领取可在窗外)
	 */
	private int settleLadderActivityItem(String orderId, Long joinAid, Long receiveDaiId, short scene, String userId) throws FLException {

		DecorationActivityItemPO preItem = null;
		long aid = 0;

		if (scene == LADDER_SCENE_RECEIVE && receiveDaiId != null) {
			// 领取: 按 daiId 直查(领取入口不持 orderId, 走 queryDecorationActivityItemByOrderId(null) 即 eq("orderId", null) 恒空集永不命中);
			// 仅预占行(state=0)可结算, 已发放/已作废幂等返回 0, 防重复扣库存
			preItem = decorationActivityItemDao.get(receiveDaiId.longValue());

			if (preItem == null || preItem.getType() != DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM
					|| preItem.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
				return 0;
			}

			orderId = preItem.getOrderId();
			aid = preItem.getAid();
		} else {

			List<DecorationActivityItemPO> orderItems = decorationActivityItemDao.queryDecorationActivityItemByOrderId(orderId);

			for (DecorationActivityItemPO item : orderItems) {

				if (item.getType() != DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM) {
					continue;
				}

				if (scene == LADDER_SCENE_JOIN) {
					// 参与幂等: 该单已有预占行(state=0) → 跳过(复审拍板按单防重, 防跨活动双预占悬挂)
					if (item.getState() == DecorationActivityItemPO.STATUS_INIT_INT) {
						return 0;
					}
					continue;
				}

				if (scene == LADDER_SCENE_CONTRACT && item.getState() == DecorationActivityItemPO.STATUS_INIT_INT) {
					preItem = item;
					aid = item.getAid();
					break;
				}
			}

			if (scene != LADDER_SCENE_JOIN && preItem == null) {
				return 0; // 无预占(未参与/已发放/已作废) → 无操作
			}
		}

		ActivityPO activityPO = activityDao.get(scene == LADDER_SCENE_JOIN ? joinAid.longValue() : preItem.getAid());

		if (activityPO == null) {
			return 0;
		}

		Timestamp now = DateUtil.getDateToTimestamp(new Date());

		// 参与有效期校验(仅参与; 签约/领取以预占锚定不受窗口限制)
		if (scene == LADDER_SCENE_JOIN) {
			if (activityPO.getStartTime() != null && now.before(activityPO.getStartTime())) {
				throw new FLException(140116, "阶梯活动不在参与有效期");
			}
			if (activityPO.getEndTime() != null && now.after(activityPO.getEndTime())) {
				throw new FLException(140116, "阶梯活动不在参与有效期");
			}
		}

		// 阶梯奖品行: 活动下 type=30 物品(activityitem, 配置页挂 awardstock), 按面值(money)降序分组展平, 同面值随机(面值即奖级)
		List<ActivityItemPO> priorityRules = new ArrayList<ActivityItemPO>();
		Map<Integer, List<ActivityItemPO>> priorityGroups = new TreeMap<Integer, List<ActivityItemPO>>(Collections.reverseOrder());

		for (ActivityItemPO ladderItem : activityItemDao.queryActivityItemForLadder(scene == LADDER_SCENE_JOIN ? joinAid.longValue() : aid)) {
			List<ActivityItemPO> group = priorityGroups.get(ladderItem.getMoney());
			if (group == null) {
				group = new ArrayList<ActivityItemPO>();
				priorityGroups.put(ladderItem.getMoney(), group);
			}
			group.add(ladderItem);
		}

		for (List<ActivityItemPO> group : priorityGroups.values()) {
			if (group.size() > 1) {
				Collections.shuffle(group);
			}
			priorityRules.addAll(group);
		}

		if (priorityRules.isEmpty()) {
			if (scene == LADDER_SCENE_JOIN) {
				throw new FLException(140117, "活动奖品已清零,不可参与");
			}
			return 0;
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		// 参与: 按水位预占(只读不扣库存, 扣减发生在签约/领取结算)
		if (scene == LADDER_SCENE_JOIN) {

			for (ActivityItemPO ladderItem : priorityRules) {

				AwardStockPO awardStockPO = awardStockDao.get(ladderItem.getAsid());

				if (awardStockPO == null || awardStockPO.getNum() <= 0) {
					continue;
				}

				String summary = "阶梯活动预占: " + activityPO.getName() + " " + ladderItem.getName();

				DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();

				decorationActivityItemPO.setAid(activityPO.getAid());
				decorationActivityItemPO.setOrderId(orderId);
				decorationActivityItemPO.setAsid(awardStockPO.getAsId());
				decorationActivityItemPO.setActivityName(activityPO.getName());
				decorationActivityItemPO.setActivityItemName(awardStockPO.getName());
				decorationActivityItemPO.setType(DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM);
				decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_INIT_INT);
				decorationActivityItemPO.setAtttype(DecorationActivityItemPO.ATTTYPE_OFFLINE_INT);
				decorationActivityItemPO.setNum(1);
				decorationActivityItemPO.setMoney(ladderItem.getMoney());
				decorationActivityItemPO.setExpendPrice(0);
				decorationActivityItemPO.setDiscountPrice(0);
				decorationActivityItemPO.setIsPrefor(DecorationActivityItemPO.ISPREFOR_UNCAL_INT);
				decorationActivityItemPO.setIsStock(awardStockPO.getIsStock());
				decorationActivityItemPO.setIsPayment(DecorationActivityItemPO.ISPAYMENT_UNCAL_INT);
				decorationActivityItemPO.setCreater(operater);
				decorationActivityItemPO.setCreateTime(now);
				decorationActivityItemPO.setContent(summary);

				decorationActivityItemDao.save(decorationActivityItemPO);

				decorationActivityItemPO.setNo(String.format("LD%08d", decorationActivityItemPO.getDaiId()));

				decorationActivityItemDao.update(decorationActivityItemPO);

				decorationActivityRecordDao.save(new DecorationActivityRecordPO().init(activityPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_INIT_INT, operater, summary));

				return 1;
			}

			throw new FLException(140117, "活动奖品已清零,不可参与");
		}

		// 签约/领取: 原子扣减降级循环
		for (ActivityItemPO ladderItem : priorityRules) {

			if (awardStockDao.deductAwardStockNum(ladderItem.getAsid()) <= 0) {
				continue; // 该档被并发抢空, 降下一档
			}

			AwardStockPO awardStockPO = awardStockDao.get(ladderItem.getAsid());

			String summary = "阶梯活动发放: " + activityPO.getName() + " " + ladderItem.getName();

			// 原预占行结算(同档直转已领/异档失效换行)
			if (preItem != null && preItem.getState() == DecorationActivityItemPO.STATUS_INIT_INT) {

				if (preItem.getAsid() == ladderItem.getAsid()) {

					preItem.setState(DecorationActivityItemPO.STATUS_RECEIVE_INT);
					preItem.setReceiver(operater);
					preItem.setReceiveTime(now);
					preItem.setContent(summary);

					decorationActivityItemDao.update(preItem);

					saveLadderRecords(preItem, awardStockPO, operater, summary);

					return 1;
				}

				preItem.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);
				preItem.setContent((preItem.getContent() == null ? "" : preItem.getContent()) + "(预占档清零降级)");

				decorationActivityItemDao.update(preItem);

				decorationActivityRecordDao.save(new DecorationActivityRecordPO().init(preItem.getAid(), preItem, DecorationActivityItemPO.STATUS_UNVALID_INT, operater, "预占档清零降级"));
			}

			DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();

			decorationActivityItemPO.setAid(activityPO.getAid());
			decorationActivityItemPO.setOrderId(orderId);
			decorationActivityItemPO.setAsid(awardStockPO.getAsId());
			decorationActivityItemPO.setActivityName(activityPO.getName());
			decorationActivityItemPO.setActivityItemName(awardStockPO.getName());
			decorationActivityItemPO.setType(DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM);
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_RECEIVE_INT);
			decorationActivityItemPO.setAtttype(DecorationActivityItemPO.ATTTYPE_OFFLINE_INT);
			decorationActivityItemPO.setNum(1);
			decorationActivityItemPO.setMoney(ladderItem.getMoney());
			decorationActivityItemPO.setExpendPrice(0);
			decorationActivityItemPO.setDiscountPrice(0);
			decorationActivityItemPO.setIsPrefor(DecorationActivityItemPO.ISPREFOR_UNCAL_INT);
			decorationActivityItemPO.setIsStock(awardStockPO.getIsStock());
			decorationActivityItemPO.setIsPayment(DecorationActivityItemPO.ISPAYMENT_UNCAL_INT);
			decorationActivityItemPO.setReceiver(operater);
			decorationActivityItemPO.setReceiveTime(now);
			decorationActivityItemPO.setCreater(operater);
			decorationActivityItemPO.setCreateTime(now);
			decorationActivityItemPO.setContent(summary);

			decorationActivityItemDao.save(decorationActivityItemPO);

			decorationActivityItemPO.setNo(String.format("LD%08d", decorationActivityItemPO.getDaiId()));

			decorationActivityItemDao.update(decorationActivityItemPO);

			saveLadderRecords(decorationActivityItemPO, awardStockPO, operater, summary);

			return 1;
		}

		// 全清零: 签约=预占行保持 state=0 等待库存变化后领取; 领取=拒绝
		if (scene == LADDER_SCENE_RECEIVE) {
			throw new FLException(160038, "库存不足");
		}

		return 0;
	}

	private void saveLadderRecords(DecorationActivityItemPO item, AwardStockPO awardStockPO, UserPO operater, String summary) {

		awardRecordDao.save(new AwardRecordPO().init(awardStockPO, operater, item.getOrderId(), AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_RECEIVE_INT, AwardRecordPO.ONETYPE_DECORATION_INT, item.getIsStock(), item.getMoney(), item.getNum(), summary));

		decorationActivityRecordDao.save(new DecorationActivityRecordPO().init(item.getAid(), item, item.getState(), operater, summary));
	}

	@Override
	public List<DecorationActivityItemVO> queryDecorationActivityItemForScale(DecorationVO decorationVO) {

		List<DecorationActivityItemVO> decorationActivityItemVOs = new ArrayList<DecorationActivityItemVO>();

		// 阶梯券选券数据源: 本装修单 type=30/state=2 已领(收款抵扣用)
		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemDao.queryDecorationActivityItemByOrderId(decorationVO.getOrderId())) {

			if (decorationActivityItemPO.getType() != DecorationActivityItemPO.TYPE_LADDER_LOTTERY_ACTIVITY_ITEM || decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_RECEIVE_INT) {
				continue;
			}

			DecorationActivityItemVO decorationActivityItemVO = new DecorationActivityItemVO();

			BeanUtil.copyProperties(decorationActivityItemPO, decorationActivityItemVO, Arrays.asList("creater", "receiver", "refunder"));

			decorationActivityItemVOs.add(decorationActivityItemVO);
		}

		return decorationActivityItemVOs;
	}
}