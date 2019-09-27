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

	@Override
	public List<DecorationActivityItemVO> queryDecorationActivityItemByOrderId(DecorationVO decorationVO) {

		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItemByOrderId(decorationVO.getOrderId());
		List<DecorationActivityItemVO> decorationActivityItemVOs = new ArrayList<DecorationActivityItemVO>();

		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemPOs) {
			DecorationActivityItemVO decorationActivityItemVO = new DecorationActivityItemVO();
			BeanUtil.copyProperties(decorationActivityItemPO, decorationActivityItemVO, Arrays.asList("receiveUserId"));

			decorationActivityItemVO.setReceiveUserId(new UserBaseVO());
			BeanUtil.copyProperties(decorationActivityItemPO.getReceiveUserId(), decorationActivityItemVO.getReceiveUserId(), Arrays.asList("dept", "duty"));

			decorationActivityItemVOs.add(decorationActivityItemVO);
		}

		return decorationActivityItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int abateDecorationActionItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {
		// 失效状态
		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT);

		if (!statuses.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单已签约");
		}

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

		decorationActivityItemDao.update(decorationActivityItemPO);

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId, String userName) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_RECEIVE_INT);
		decorationActivityItemPO.setReceiveUserId(userDao.queryUserByUserId(userId));
		decorationActivityItemPO.setReceiveUserName(userName);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemDao.update(decorationActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(decorationActivityItemPO.getAsid());

		UserPO creater = userDao.queryUserByUserId(userId);

		if (decorationActivityItemPO.getIsStock() == DecorationActivityItemPO.ISSTOCK_CAL_INT) {

			int num = Arith.sub(awardStockPO.getNum(), decorationActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "库存不足");
			}

			awardStockPO.setNum(num);

			awardStockDao.update(awardStockPO);
		}

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, creater, decorationActivityItemPO.getOrderId(), AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_RECEIVE_INT, AwardRecordPO.ONETYPE_DECORATION_INT, decorationActivityItemPO.getIsStock(), decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum(), decorationActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deliveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_DELIVERY_INT);

		decorationActivityItemDao.update(decorationActivityItemPO);
		
		AwardStockPO awardStockPO = awardStockDao.get(decorationActivityItemPO.getAsid());

		UserPO creater = userDao.queryUserByUserId(userId);

		if (decorationActivityItemPO.getIsStock() == DecorationActivityItemPO.ISSTOCK_CAL_INT) {

			int num = Arith.sub(awardStockPO.getNum(), decorationActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "库存不足");
			}

			awardStockPO.setNum(num);

			awardStockDao.update(awardStockPO);
		}

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, creater, decorationActivityItemPO.getOrderId(), AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_DELIVERY_INT, AwardRecordPO.ONETYPE_DECORATION_INT, decorationActivityItemPO.getIsStock(), decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum(), decorationActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unrefundDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_RECEIVE_INT) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_WAIT_INT);

		decorationActivityItemDao.update(decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		List<Short> status = Arrays.asList(new Short[] { DecorationActivityItemPO.STATUS_RECEIVE_INT, DecorationActivityItemPO.STATUS_DELIVERY_INT, DecorationActivityItemPO.STATUS_WAIT_INT });

		if (!status.contains(decorationActivityItemPO.getState())) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}
		
		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_RETREAT_INT);

		decorationActivityItemDao.update(decorationActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(decorationActivityItemPO.getAsid());

		UserPO creater = userDao.queryUserByUserId(userId);

		if (decorationActivityItemPO.getIsStock() == DecorationActivityItemPO.ISSTOCK_CAL_INT) {

			int num = Arith.add(awardStockPO.getNum(), decorationActivityItemPO.getNum());

			awardStockPO.setNum(num);

			awardStockDao.update(awardStockPO);
		}

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, creater, decorationActivityItemPO.getOrderId(), AwardRecordPO.TYPE_CG_INT, AwardRecordPO.SUBTYPE_REFUND_INT, AwardRecordPO.ONETYPE_DECORATION_INT, decorationActivityItemPO.getIsStock(), decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum(), decorationActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);

		subDecorationForCut(decorationPO, decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int expendDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		List<Short> status = Arrays.asList(new Short[] { DecorationActivityItemPO.STATUS_RECEIVE_INT, DecorationActivityItemPO.STATUS_DELIVERY_INT });
		
		if (!status.contains(decorationActivityItemPO.getState())) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_CONSUME_INT);

		decorationActivityItemDao.update(decorationActivityItemPO);
		
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
		
		if(!Arrays.asList(DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_FINAL_INT).contains(decorationPO.getStatus())){
			throw new FLException(140004, "装修单状态不可操作");
		}
		
		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItemByOrderId(orderId);

		long couponCut = 0;
		long thingCut = 0;

		List<Short> types = Arrays.asList(DecorationActivityItemPO.TYPE_COUPON_INT, DecorationActivityItemPO.TYPE_SPECIALCOUPON_INT);
		List<Short> states = Arrays.asList(DecorationActivityItemPO.STATUS_UNVALID_INT, DecorationActivityItemPO.STATUS_RETREAT_INT, DecorationActivityItemPO.STATUS_CONSUME_INT);

		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemPOs) {

			if (types.contains(decorationActivityItemPO.getType()) && !states.contains(decorationActivityItemPO.getState()) && decorationActivityItemPO.getIsPrefor() == DecorationActivityItemPO.ISPREFOR_CAL_INT) {
				couponCut = Arith.add(couponCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
			} else if (Arrays.asList(DecorationActivityItemPO.TYPE_THING_INT, DecorationActivityItemPO.TYPE_SPECIALARTICLE_INT).contains(decorationActivityItemPO.getType()) && decorationActivityItemPO.getIsPrefor() == DecorationActivityItemPO.ISPREFOR_CAL_INT) {
				thingCut =  Arith.add(thingCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
			}
		}
		decorationPO.setCouponCut(couponCut);
		decorationPO.setThingCut(thingCut);
		decorationPO.setFactPrice(Arith.sub(decorationPO.getOrderTotalPrice(), couponCut));

		decorationDao.update(decorationPO);
		
		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, String.format("统计装修活动项,装修单:%s", orderId)));

		return 0;
	}
	
	private void subDecorationForCut(DecorationPO decorationPO, DecorationActivityItemPO decorationActivityItemPO){
		
		long couponCut = decorationPO.getCouponCut();
		long thingCut = decorationPO.getThingCut();

		if (Arrays.asList(DecorationActivityItemPO.TYPE_COUPON_INT, DecorationActivityItemPO.TYPE_SPECIALCOUPON_INT).contains(decorationActivityItemPO.getType()) && decorationActivityItemPO.getIsPrefor() == DecorationActivityItemPO.ISPREFOR_CAL_INT) {
			couponCut = Arith.sub(couponCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
		} else if (Arrays.asList(DecorationActivityItemPO.TYPE_THING_INT, DecorationActivityItemPO.TYPE_SPECIALARTICLE_INT).contains(decorationActivityItemPO.getType()) && decorationActivityItemPO.getIsPrefor() == DecorationActivityItemPO.ISPREFOR_CAL_INT) {
			thingCut = Arith.sub(thingCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
		}

		decorationPO.setCouponCut(couponCut);
		decorationPO.setThingCut(thingCut);
		decorationPO.setFactPrice(Arith.sub(decorationPO.getOrderTotalPrice(), couponCut));

		decorationDao.update(decorationPO);
	}

}
