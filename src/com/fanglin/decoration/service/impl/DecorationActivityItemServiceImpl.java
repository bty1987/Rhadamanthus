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
	public List<DecorationActivityItemVO> queryDecorationActivityItemForCouponAVaildByOrderId(DecorationVO decorationVO) {

		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItemForCouponAVaildByOrderId(decorationVO.getOrderId());
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

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT , DecorationPO.STATUS_RESIGNED_INT);

		if (!statuses.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单已签约");
		}

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

		decorationActivityItemDao.update(decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId, String userName) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());
		
		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_RECEIVE_INT);
		decorationActivityItemPO.setReceiveUserId(userDao.queryUserByUserId(userId));
		decorationActivityItemPO.setReceiveUserName(userName);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityItemDao.update(decorationActivityItemPO);

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());

		float couponCut = decorationPO.getCouponCut();
		float thingCut = decorationPO.getThingCut();

		if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_COUPON_INT && decorationActivityItemPO.getIsPrefor() == DecorationActivityItemPO.ISPREFOR_CAL_INT) {
			couponCut = Arith.add(couponCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
		} else if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_THING_INT && decorationActivityItemPO.getIsPrefor() == DecorationActivityItemPO.ISPREFOR_CAL_INT) {
			thingCut = Arith.add(thingCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
		} else if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_SPECIALCOUPON_INT && decorationActivityItemPO.getIsPrefor() == DecorationActivityItemPO.ISPREFOR_CAL_INT) {
			couponCut = Arith.add(couponCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
		} else if (decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_SPECIALARTICLE_INT && decorationActivityItemPO.getIsPrefor() == DecorationActivityItemPO.ISPREFOR_CAL_INT) {
			thingCut = Arith.add(thingCut, Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
		}

		decorationPO.setCouponCut(couponCut);
		decorationPO.setThingCut(thingCut);

		decorationDao.update(decorationPO);

		if (decorationActivityItemPO.getIsStock() == DecorationActivityItemPO.ISSTOCK_CAL_INT) {

			AwardStockPO awardStockPO = awardStockDao.get(decorationActivityItemPO.getAsid());
			float num = Arith.sub(awardStockPO.getNum(), decorationActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "库存不足");
			}

			awardStockPO.setNum(num);

			awardStockDao.update(awardStockPO);

			AwardRecordPO awardRecordPO = new AwardRecordPO();
			awardRecordPO.setAwardStock(awardStockPO);
			awardRecordPO.setCreater(userDao.queryUserByUserId(userId));
			awardRecordPO.setNum(decorationActivityItemPO.getNum());
			awardRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			awardRecordPO.setTotalPrice(Arith.mul(decorationActivityItemPO.getMoney(), decorationActivityItemPO.getNum()));
			awardRecordPO.setUnitPrice(decorationActivityItemPO.getMoney());
			awardRecordPO.setType(AwardRecordPO.TYPE_XG_INT);
			awardRecordPO.setContent("领取活动奖品");
			awardRecordPO.setOrderId(decorationActivityItemPO.getOrderId());

			awardRecordDao.save(awardRecordPO);
		}

		return 0;
	}

}
