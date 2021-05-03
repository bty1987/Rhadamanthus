package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesActivityItemDao;
import com.fanglin.sales.po.SalesActivityItemPO;
import com.fanglin.sales.service.SalesActivityItemService;
import com.fanglin.sales.service.SalesActivityService;
import com.fanglin.sales.vo.SalesActivityItemVO;
import com.fanglin.sales.vo.SalesActivityVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("salesActivityItemService")
@Transactional(readOnly = true)
public class SalesActivityItemServiceImpl implements SalesActivityItemService {

	@Autowired
	private SalesActivityItemDao salesActivityItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private AwardRecordDao awardRecordDao;

	@Autowired
	private SalesActivityService salesActivityService;

	@Override
	public List<SalesActivityItemVO> querySalesActivityItem(String orderId) {

		List<SalesActivityItemPO> salesActivityItemPOs = salesActivityItemDao.querySalesActivityItem(orderId);
		List<SalesActivityItemVO> salesActivityItemVOs = new ArrayList<SalesActivityItemVO>();

		for (SalesActivityItemPO salesActivityItemPO : salesActivityItemPOs) {

			SalesActivityItemVO salesActivityItemVO = new SalesActivityItemVO();

			BeanUtil.copyProperties(salesActivityItemPO, salesActivityItemVO, Arrays.asList("creater", "operater"));

			if (salesActivityItemPO.getAsid() != 0) {
				BeanUtil.copyProperties(salesActivityItemPO.getAsid(), salesActivityItemVO.getAsid());
			}

			salesActivityItemVO.setOperater(new UserBaseVO());
			BeanUtil.copyProperties(salesActivityItemPO.getOperater(), salesActivityItemVO.getOperater(), Arrays.asList("dept", "duty"));

			salesActivityItemVOs.add(salesActivityItemVO);
		}
		return salesActivityItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSalesActivityItem(SalesActivityVO salesActivityVO, List<SalesActivityItemVO> salesActivityItems, String userId) throws FLException {

		salesActivityService.checkSalesActivity(salesActivityVO.getSales().getOrderId(), salesActivityVO.getAmount());

		UserPO user = userDao.queryUserByUserId(userId);

		for (SalesActivityItemVO salesActivityItemVO : salesActivityItems) {

			SalesActivityItemPO salesActivityItemPO = new SalesActivityItemPO();

			BeanUtil.copyProperties(salesActivityItemVO, salesActivityItemPO);

			salesActivityItemPO.setCreater(user);
			salesActivityItemPO.setOrderId(salesActivityVO.getSales().getOrderId());
			salesActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			AwardStockPO awardStockPO = awardStockDao.get(salesActivityItemVO.getAsid());

			salesActivityItemPO.setIsStock(awardStockPO.getIsStock());

			salesActivityItemDao.save(salesActivityItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int abateSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_VALID_INT) {// 0--初始
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		salesActivityItemPO.setOperater(userDao.queryUserByUserId(userId));
		salesActivityItemPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_UNVALID_INT);
		salesActivityItemPO.setIsStock(SalesActivityItemPO.STATUS_UNVALID_INT);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId, String userName) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_RECEIVE_INT);
		salesActivityItemPO.setIsStock(SalesActivityItemPO.STATUS_VALID_INT);
		salesActivityItemPO.setOperater(userDao.queryUserByUserId(userId));
		salesActivityItemPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		salesActivityItemDao.update(salesActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(salesActivityItemPO.getAsid());

		if (salesActivityItemPO.getIsStock() == SalesActivityItemPO.ISSTOCK_COUNTIN_INT) {// 0--计入库存

			if (awardStockPO == null) {
				throw new FLException(160043, "物品不存在!");
			}

			int num = Arith.sub(awardStockPO.getNum(), salesActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "奖品库存数量不足!");
			}

			awardStockPO.setNum(Arith.sub(awardStockPO.getNum(), salesActivityItemPO.getNum()));

			awardStockDao.update(awardStockPO);
		}

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, userDao.queryUserByUserId(userId), salesActivityItemPO.getOrderId(), AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_RECEIVE_INT, AwardRecordPO.ONETYPE_SALES_INT, salesActivityItemPO.getIsStock(), salesActivityItemPO.getMoney(), salesActivityItemPO.getNum(), salesActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deliveSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId, String userName) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_VALID_INT) {// 0--初始
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_DELIVERY_INT);// 更改为状态4--配送
		salesActivityItemPO.setOperater(creater);
		salesActivityItemPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		salesActivityItemDao.update(salesActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(salesActivityItemPO.getAsid());

		if (salesActivityItemPO.getIsStock() == SalesActivityItemPO.ISSTOCK_COUNTIN_INT) {// 计入库存

			int num = Arith.sub(awardStockPO.getNum(), salesActivityItemPO.getNum());
			if (num < 0) {
				throw new FLException(160038, "奖品库存数量不足!");
			}
			awardStockPO.setNum(Arith.sub(awardStockPO.getNum(), salesActivityItemPO.getNum()));

			awardStockDao.update(awardStockPO);
		}

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, creater, salesActivityItemPO.getOrderId(), AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_DELIVERY_INT, AwardRecordPO.ONETYPE_SALES_INT, salesActivityItemPO.getIsStock(), salesActivityItemPO.getMoney(), salesActivityItemPO.getNum(), salesActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void unrefundSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_RECEIVE_INT) {// 已领--2
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		salesActivityItemPO.setOperater(userDao.queryUserByUserId(userId));
		salesActivityItemPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_UNRETURNED_INT);// 更改为状态5--未退

		salesActivityItemDao.update(salesActivityItemPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refundSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_RECEIVE_INT && salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_UNRETURNED_INT && salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_DELIVERY_INT) {// 已领--2, 未退--5, 配送--4
			throw new FLException(140057, "订单活动奖品不可操作");
		}
		salesActivityItemPO.setOperater(userDao.queryUserByUserId(userId));
		salesActivityItemPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_REFUND_INT);// 更改为状态3--退货

		salesActivityItemDao.update(salesActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(salesActivityItemPO.getAsid());

		if (salesActivityItemPO.getIsStock() == SalesActivityItemPO.ISSTOCK_COUNTIN_INT) {// 0--计入库存

			awardStockPO.setNum(Arith.add(awardStockPO.getNum(), salesActivityItemPO.getNum()));

			awardStockDao.update(awardStockPO);
		}

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, userDao.queryUserByUserId(userId), salesActivityItemPO.getOrderId(), AwardRecordPO.TYPE_CG_INT, AwardRecordPO.SUBTYPE_REFUND_INT, AwardRecordPO.ONETYPE_SALES_INT, salesActivityItemPO.getIsStock(), salesActivityItemPO.getMoney(), salesActivityItemPO.getNum(), salesActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void expendSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_RECEIVE_INT && salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_DELIVERY_INT) {// 已领--2, 配送--4
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		salesActivityItemPO.setOperater(userDao.queryUserByUserId(userId));
		salesActivityItemPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_CONSUME_INT);// 更改为状态7--消耗

		salesActivityItemDao.update(salesActivityItemPO);
	}

}
