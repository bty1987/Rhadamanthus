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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationActivityItemService;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationActivityItemService")
@Transactional(readOnly = true)
public class DecorationActivityItemServiceImpl implements DecorationActivityItemService {

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

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
			throw new FLException(240003, "奖品不存在");
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

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "装修活动物品不存在");
		}

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140057, "装修活动奖品不可操作");
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

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int abateDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "装修活动物品不存在");
		}

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140057, "装修活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT);

		if (!statuses.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单已签约");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setReceiver(operater);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));
		decorationActivityItemPO.setContent(decorationActivityItemVO.getContent());
		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

		decorationActivityItemDao.update(decorationActivityItemPO);
		decorationActivityItemDao.flush();

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deliveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "装修活动物品不存在");
		}

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140057, "装修活动奖品不可操作");
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

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, operater, decorationActivityItemPO.getOrderId(), AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_DELIVERY_INT, AwardRecordPO.ONETYPE_DECORATION_INT, decorationActivityItemPO.getIsStock(), decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum(), decorationActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unrefundDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "装修活动物品不存在");
		}

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_RECEIVE_INT) {
			throw new FLException(140057, "装修活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_WAIT_INT);

		decorationActivityItemPO.setRefunder(operater);
		decorationActivityItemPO.setRefundTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemPO.setComment(decorationActivityItemVO.getComment());

		decorationActivityItemDao.update(decorationActivityItemPO);
		decorationActivityItemDao.flush();

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "装修活动物品不存在");
		}

		List<Short> status = Arrays.asList(new Short[] { DecorationActivityItemPO.STATUS_RECEIVE_INT, DecorationActivityItemPO.STATUS_DELIVERY_INT, DecorationActivityItemPO.STATUS_WAIT_INT });

		if (!status.contains(decorationActivityItemPO.getState())) {
			throw new FLException(140057, "装修活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
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
			throw new FLException(140030, "装修活动物品不存在");
		}

		List<Short> status = Arrays.asList(new Short[] { DecorationActivityItemPO.STATUS_RECEIVE_INT, DecorationActivityItemPO.STATUS_DELIVERY_INT, DecorationActivityItemPO.STATUS_DISCOUNT_INT });

		if (!status.contains(decorationActivityItemPO.getState())) {
			throw new FLException(140057, "装修活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_CONSUME_INT);

		decorationActivityItemPO.setRefunder(operater);
		decorationActivityItemPO.setRefundTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemPO.setComment(decorationActivityItemVO.getComment());

		decorationActivityItemDao.update(decorationActivityItemPO);
		decorationActivityItemDao.flush();

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int discountDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "装修活动物品不存在");
		}

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140057, "装修活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_DISCOUNT_INT);

		decorationActivityItemPO.setReceiver(operater);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemPO.setContent(decorationActivityItemVO.getContent());

		decorationActivityItemDao.update(decorationActivityItemPO);
		decorationActivityItemDao.flush();

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int amountDecorationActivityItem(DecorationVO decorationVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!Arrays.asList(DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_FINAL_INT).contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		List<Short> states = Arrays.asList(DecorationActivityItemPO.STATUS_INIT_INT, DecorationActivityItemPO.STATUS_RECEIVE_INT, DecorationActivityItemPO.STATUS_DELIVERY_INT, DecorationActivityItemPO.STATUS_WAIT_INT, DecorationActivityItemPO.STATUS_UPGRADE_INT);

		long couponCut = decorationActivityItemDao.amountDecorationActivityItemForIsPrefor(orderId, DecorationActivityItemPO.TYPE_COUPON_INT, states, DecorationActivityItemPO.ISPREFOR_CAL_INT);
		long thingCut = decorationActivityItemDao.amountDecorationActivityItemForIsPrefor(orderId, DecorationActivityItemPO.TYPE_THING_INT, states, DecorationActivityItemPO.ISPREFOR_CAL_INT);

		decorationPO.setCouponCut(couponCut);
		decorationPO.setThingCut(thingCut);
		decorationPO.setFactPrice(Arith.sub(decorationPO.getOrderTotalPrice(), couponCut));

		decorationDao.update(decorationPO);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, String.format("统计装修活动项,装修单:%s", orderId)));

		return 0;
	}

	@Override
	public void sendDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO) throws FLException {

		String orderId = decorationActivityItemVO.getOrderId();

		System.out.println(String.format("pages/decoration/activityItem/activityItem?orderId=%s&daiIds=%s", orderId, decorationActivityItemVO.getContent()));

		decorationService.sendMessage(orderId, "装修单", "请您及时查收点确认礼品领取信息.", String.format("pages/decoration/activityItem/activityItem?orderId=%s&daiIds=%s", orderId, decorationActivityItemVO.getContent()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirmDecorationActivityItem(DecorationVO decorationVO, List<DecorationActivityItemVO> decorationActivityItems) throws FLException {

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationVO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		com.fanglin.customer.vo.DecorationVO cusDecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cusDecorationVO.setOrderId(orderId);
		cusDecorationVO.setUnionId(decorationVO.getCustomer().getNo());

		if (decorationService.queryDecoration(cusDecorationVO).getOrderId() == null) {
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

		List<Short> states = Arrays.asList(DecorationActivityItemPO.STATUS_INIT_INT, DecorationActivityItemPO.STATUS_RECEIVE_INT, DecorationActivityItemPO.STATUS_DELIVERY_INT, DecorationActivityItemPO.STATUS_WAIT_INT, DecorationActivityItemPO.STATUS_UPGRADE_INT);

		long couponCut = decorationActivityItemDao.amountDecorationActivityItemForIsPrefor(decorationPO.getOrderId(), DecorationActivityItemPO.TYPE_COUPON_INT, states, DecorationActivityItemPO.ISPREFOR_CAL_INT);
		long thingCut = decorationActivityItemDao.amountDecorationActivityItemForIsPrefor(decorationPO.getOrderId(), DecorationActivityItemPO.TYPE_THING_INT, states, DecorationActivityItemPO.ISPREFOR_CAL_INT);

		decorationPO.setCouponCut(couponCut);
		decorationPO.setThingCut(thingCut);
		decorationPO.setFactPrice(Arith.sub(decorationPO.getOrderTotalPrice(), couponCut));

		decorationDao.update(decorationPO);
	}
}
