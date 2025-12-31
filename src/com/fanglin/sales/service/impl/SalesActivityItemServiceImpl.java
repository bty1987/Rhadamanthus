package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesActivityItemDao;
import com.fanglin.sales.dao.SalesActivityRecordDao;
import com.fanglin.sales.po.SalesActivityItemPO;
import com.fanglin.sales.po.SalesActivityRecordPO;
import com.fanglin.sales.service.SalesActivityItemService;
import com.fanglin.sales.service.SalesActivityService;
import com.fanglin.sales.vo.SalesActivityItemVO;
import com.fanglin.sales.vo.SalesActivityVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("salesActivityItemService")
@Transactional(readOnly = true)
public class SalesActivityItemServiceImpl implements SalesActivityItemService {

	@Autowired
	private SalesActivityItemDao salesActivityItemDao;

	@Autowired
	private SalesActivityRecordDao salesActivityRecordDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private AwardRecordDao awardRecordDao;

	@Autowired
	private SalesActivityService salesActivityService;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private WeChatAppService weChatAppService;

	@Override
	public List<SalesActivityItemVO> querySalesActivityItem(String orderId) {

		List<SalesActivityItemPO> salesActivityItemPOs = salesActivityItemDao.querySalesActivityItem(orderId);
		List<SalesActivityItemVO> salesActivityItemVOs = new ArrayList<SalesActivityItemVO>();

		for (SalesActivityItemPO salesActivityItemPO : salesActivityItemPOs) {

			SalesActivityItemVO salesActivityItemVO = new SalesActivityItemVO();

			BeanUtil.copyProperties(salesActivityItemPO, salesActivityItemVO, Arrays.asList("creater", "operater", "refunder"));

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

			salesActivityRecordDao.save(new SalesActivityRecordPO().init(salesActivityItemVO.getAid(), salesActivityItemPO, SalesActivityItemPO.STATUS_VALID_INT, user, salesActivityItemVO.getContent()));
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

		if (salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_VALID_INT) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		salesActivityItemPO.setOperater(operater);
		salesActivityItemPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_UNVALID_INT);
		salesActivityItemPO.setIsStock(SalesActivityItemPO.STATUS_UNVALID_INT);

		salesActivityItemPO.setContent(salesActivityItemVO.getContent());

		salesActivityItemDao.update(salesActivityItemPO);

		salesActivityRecordDao.save(new SalesActivityRecordPO().init(salesActivityItemPO.getAid(), salesActivityItemPO, SalesActivityItemPO.STATUS_UNVALID_INT, operater, salesActivityItemVO.getContent()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId, String userName) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_RECEIVE_INT);
		salesActivityItemPO.setIsStock(SalesActivityItemPO.STATUS_VALID_INT);

		salesActivityItemPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		salesActivityItemPO.setOperater(operater);

		salesActivityItemPO.setContent(salesActivityItemVO.getContent());

		salesActivityItemDao.update(salesActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(salesActivityItemPO.getAsid());

		if (salesActivityItemPO.getIsStock() == SalesActivityItemPO.ISSTOCK_COUNTIN_INT) {// 0--计入库存

			if (awardStockPO == null) {
				throw new FLException(160043, "物品不存在");
			}

			int num = Arith.sub(awardStockPO.getNum(), salesActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "库存不足");
			}

			awardStockPO.setNum(Arith.sub(awardStockPO.getNum(), salesActivityItemPO.getNum()));

			awardStockDao.update(awardStockPO);
		}

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, userDao.queryUserByUserId(userId), salesActivityItemPO.getOrderId(), AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_RECEIVE_INT, AwardRecordPO.ONETYPE_SALES_INT, salesActivityItemPO.getIsStock(), salesActivityItemPO.getMoney(), salesActivityItemPO.getNum(), salesActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);

		salesActivityRecordDao.save(new SalesActivityRecordPO().init(salesActivityItemPO.getAid(), salesActivityItemPO, SalesActivityItemPO.STATUS_RECEIVE_INT, operater, salesActivityItemVO.getContent()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deliveSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId, String userName) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_VALID_INT) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_DELIVERY_INT);

		salesActivityItemPO.setOperater(operater);
		salesActivityItemPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		salesActivityItemPO.setContent(salesActivityItemVO.getContent());

		salesActivityItemDao.update(salesActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(salesActivityItemPO.getAsid());

		if (salesActivityItemPO.getIsStock() == SalesActivityItemPO.ISSTOCK_COUNTIN_INT) {

			int num = Arith.sub(awardStockPO.getNum(), salesActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "库存不足");
			}

			awardStockPO.setNum(Arith.sub(awardStockPO.getNum(), salesActivityItemPO.getNum()));

			awardStockDao.update(awardStockPO);
		}

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, operater, salesActivityItemPO.getOrderId(), AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_DELIVERY_INT, AwardRecordPO.ONETYPE_SALES_INT, salesActivityItemPO.getIsStock(), salesActivityItemPO.getMoney(), salesActivityItemPO.getNum(), salesActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);

		salesActivityRecordDao.save(new SalesActivityRecordPO().init(salesActivityItemPO.getAid(), salesActivityItemPO, SalesActivityItemPO.STATUS_DELIVERY_INT, operater, salesActivityItemVO.getContent()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void discountSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_VALID_INT) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		salesActivityItemPO.setDiscountPrice(salesActivityItemVO.getDiscountPrice());

		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_DISCOUNT_INT);

		salesActivityItemPO.setOperater(operater);
		salesActivityItemPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		salesActivityItemPO.setContent(salesActivityItemVO.getContent());

		salesActivityItemDao.update(salesActivityItemPO);

		salesActivityRecordDao.save(new SalesActivityRecordPO().init(salesActivityItemPO.getAid(), salesActivityItemPO, SalesActivityItemPO.STATUS_DISCOUNT_INT, operater, salesActivityItemVO.getContent()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void unrefundSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_RECEIVE_INT) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_UNRETURNED_INT);

		salesActivityItemPO.setRefunder(operater);
		salesActivityItemPO.setRefundTime(DateUtil.getDateToTimestamp(new Date()));

		salesActivityItemPO.setComment(salesActivityItemVO.getContent());

		salesActivityItemDao.update(salesActivityItemPO);

		salesActivityRecordDao.save(new SalesActivityRecordPO().init(salesActivityItemPO.getAid(), salesActivityItemPO, SalesActivityItemPO.STATUS_UNRETURNED_INT, operater, ""));
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

		UserPO operater = userDao.queryUserByUserId(userId);

		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_REFUND_INT);

		salesActivityItemPO.setRefunder(operater);
		salesActivityItemPO.setRefundTime(DateUtil.getDateToTimestamp(new Date()));

		salesActivityItemPO.setComment(salesActivityItemVO.getContent());

		salesActivityItemDao.update(salesActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(salesActivityItemPO.getAsid());

		if (salesActivityItemPO.getIsStock() == SalesActivityItemPO.ISSTOCK_COUNTIN_INT) {// 0--计入库存

			awardStockPO.setNum(Arith.add(awardStockPO.getNum(), salesActivityItemPO.getNum()));

			awardStockDao.update(awardStockPO);
		}

		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, userDao.queryUserByUserId(userId), salesActivityItemPO.getOrderId(), AwardRecordPO.TYPE_CG_INT, AwardRecordPO.SUBTYPE_REFUND_INT, AwardRecordPO.ONETYPE_SALES_INT, salesActivityItemPO.getIsStock(), salesActivityItemPO.getMoney(), salesActivityItemPO.getNum(), salesActivityItemVO.getContent());

		awardRecordDao.save(awardRecordPO);

		salesActivityRecordDao.save(new SalesActivityRecordPO().init(salesActivityItemPO.getAid(), salesActivityItemPO, SalesActivityItemPO.STATUS_REFUND_INT, operater, salesActivityItemVO.getContent()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void expendSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItemVO.getSaiid());

		if (salesActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if (salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_RECEIVE_INT && salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_DELIVERY_INT && salesActivityItemPO.getState() != SalesActivityItemPO.STATUS_DISCOUNT_INT) {
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		salesActivityItemPO.setExpendPrice(salesActivityItemVO.getExpendPrice());

		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_CONSUME_INT);

		salesActivityItemPO.setRefunder(operater);
		salesActivityItemPO.setRefundTime(DateUtil.getDateToTimestamp(new Date()));

		salesActivityItemPO.setComment(salesActivityItemVO.getContent());

		salesActivityItemDao.update(salesActivityItemPO);

		salesActivityRecordDao.save(new SalesActivityRecordPO().init(salesActivityItemPO.getAid(), salesActivityItemPO, SalesActivityItemPO.STATUS_CONSUME_INT, operater, salesActivityItemVO.getContent()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendSalesActivityItem(SalesActivityItemVO salesActivityItemVO) throws FLException {

		String orderId = salesActivityItemVO.getOrderId();

		System.out.println(String.format("pages/decoration/activityItem/activityItem?orderId=%s&saiids=%s", orderId, salesActivityItemVO.getContent()));

		decorationService.sendMessage(orderId, "装修单", String.format("请您及时查收点确认礼品领取信息."), String.format("pages/decoration/activityItem/activityItem?orderId=%s&saiids=%s", orderId, salesActivityItemVO.getContent()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirmSalesActivityItem(SalesVO salesVO, List<SalesActivityItemVO> salesActivityItems, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		String orderId = salesVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (salesVO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			salesVO.getCustomer().setPhone(weChatPhoneInfoVO.getPhoneNumber());
		}

		if (salesVO.getCustomer().getPhone() != null && !decorationPO.getCustomer().getPhone().equals(FormatUtil.encodePhone(salesVO.getCustomer().getPhone()))) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cecorationVO.setOrderId(orderId);
		cecorationVO.setUnionId(salesVO.getCustomer().getNo());

		if (salesVO.getCustomer().getNo() != null && decorationService.queryDecoration(cecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

		for (SalesActivityItemVO salesActivityItem : salesActivityItems) {

			SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityItem.getSaiid());

			if (salesActivityItemPO == null) continue;

			if (salesActivityItemPO.getIsAffirm() == SalesActivityItemPO.ISAFFIRM_UNSUBMIT_INT && salesActivityItemPO.getState() == SalesActivityItemPO.STATUS_VALID_INT) {

				salesActivityItemPO.setIsAffirm(SalesActivityItemPO.ISAFFIRM_CONFIRMED_INT);
				salesActivityItemPO.setAffirmTime(DateUtil.getDateToTimestamp(new Date()));
			}

			if (salesActivityItemPO.getIsAffirm() == SalesActivityItemPO.ISAFFIRM_CONFIRMED_INT && !Arrays.asList(SalesActivityItemPO.STATUS_VALID_INT, SalesActivityItemPO.STATUS_REFUND_INT, SalesActivityItemPO.STATUS_CONSUME_INT).contains(salesActivityItemPO.getState())) {

				salesActivityItemPO.setIsAffirm(SalesActivityItemPO.ISAFFIRM_CHECKED_INT);
				salesActivityItemPO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));
			}

			salesActivityItemDao.update(salesActivityItemPO);
		}

		return 0;
	}

}
