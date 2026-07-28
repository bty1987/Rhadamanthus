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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationActivityRecordDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityRecordPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationActivityItemService;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
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

		decorationActivityItemPO.setCreater(creater);
		decorationActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemDao.save(decorationActivityItemPO);

		BeanUtil.copyProperties(decorationActivityItemPO, decorationActivityItemVO, Arrays.asList("creater", "receiver", "refunder"));

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO().init(decorationActivityItemPO.getAid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_INIT_INT, creater, "");

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

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

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deliveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

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

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int expendDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140101, "装修活动物品不存在");
		}

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

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
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
		messageQueuingDao.save(new MessageCueuingPO().init(decorationActivityItemPO.getOrderId(), "consumeDecorationActivityItem", "{\"orderId\":\"" + decorationActivityItemPO.getOrderId() + "\",\"daiId\":\"" + decorationActivityItemPO.getDaiId() + "\",\"status\":\"" + DecorationActivityItemPO.STATUS_VERIFY_INT + "\",\"userId\":\"" + userId + "\",\"event\":\"ACTIVITY_ITEM_VERIFIED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));

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

	private void subDecorationForCut(DecorationPO decorationPO, DecorationActivityItemPO decorationActivityItemPO) {

		long couponCut = decorationActivityItemDao.amountDecorationActivityItem(decorationPO.getOrderId(), DecorationActivityItemPO.TYPE_COUPON_INT, null, DecorationActivityItemPO.ISPAYMENT_CAL_INT);
		long thingCut = decorationActivityItemDao.amountDecorationActivityItem(decorationPO.getOrderId(), DecorationActivityItemPO.TYPE_THING_INT, null, DecorationActivityItemPO.ISPAYMENT_CAL_INT);

		decorationPO.setCouponCut(couponCut);
		decorationPO.setThingCut(thingCut);
		decorationPO.setFactPrice(Arith.sub(decorationPO.getOrderTotalPrice(), couponCut));

		decorationDao.update(decorationPO);
	}
}
