package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesActivityDao;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.po.SalesActivityItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesActivityService;
import com.fanglin.sales.vo.SalesActivityItemVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("salesActivityService")
@Transactional(readOnly = true)
public class SalesActivityServiceImpl implements SalesActivityService {
	
	@Autowired
	private SalesActivityDao salesActivityDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private SalesDao salesDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private AwardStockDao awardStockDao;
	
	@Autowired
	private AwardRecordDao awardRecordDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSalesActivityItem(List<SalesActivityItemVO> salesActivityItems) throws FLException {
		
		for(SalesActivityItemVO salesActivityItemVO:salesActivityItems){
			
			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(salesActivityItemVO.getOrderId());
			
			if (decorationPO == null) {
				throw new FLException(140013, "订单不存在");
			}
			
			SalesActivityItemPO salesActivityItemPO=new SalesActivityItemPO();
			
			BeanUtil.copyProperties(salesActivityItemVO, salesActivityItemPO);
			
			salesActivityItemPO.setReceiveUserName("");
			salesActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));
			
			salesActivityDao.save(salesActivityItemPO);
		}
		return 0;
	}

	@Override
	public List<SalesActivityItemVO> querySalesActivityItem(String orderId) {
		
		List<SalesActivityItemPO> salesActivityItemPOs=salesActivityDao.querySalesActivityItem(orderId);
		List<SalesActivityItemVO> salesActivityItemVOs=new ArrayList<SalesActivityItemVO>();
		
		for(SalesActivityItemPO salesActivityItemPO:salesActivityItemPOs){
			
			SalesActivityItemVO salesActivityItemVO=new SalesActivityItemVO();
			
			BeanUtil.copyProperties(salesActivityItemPO, salesActivityItemVO,Arrays.asList("receiveUserId"));
			
			if (salesActivityItemPO.getAsid() != 0) {
				BeanUtil.copyProperties(salesActivityItemPO.getAsid(), salesActivityItemVO.getAsid());
			}

			salesActivityItemVO.setReceiveUserId(new UserBaseVO());
			BeanUtil.copyProperties(salesActivityItemPO.getReceiveUserId(), salesActivityItemVO.getReceiveUserId(), Arrays.asList("dept", "duty"));

			salesActivityItemVOs.add(salesActivityItemVO);
		}
		return salesActivityItemVOs;
	}

	@Override
	public Object querySalesActivity(String orderId) {
		
		List<Object> salesTotal=salesDao.querySalesActivityByTotal(orderId);
		
		Object sales=JSONObject.toJSON(salesTotal);
		
		return sales;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesForActivity(SalesVO salesVO) throws FLException {
		
		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		salesPO.setActivityId(salesVO.getActivityId());

		salesDao.update(salesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int abateSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException {
		
		SalesActivityItemPO salesActivityItemPO=salesActivityDao.get(salesActivityItemVO.getSaiid());
		
		if(salesActivityItemPO==null){
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_UNVALID_INT);
		salesActivityItemPO.setIsStock(SalesActivityItemPO.STATUS_UNVALID_INT);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId, String userName) throws FLException {

		SalesActivityItemPO salesActivityItemPO=salesActivityDao.get(salesActivityItemVO.getSaiid());
		
		if(salesActivityItemPO==null){
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		salesActivityItemPO.setState(SalesActivityItemPO.STATUS_RECEIVE_INT);
		salesActivityItemPO.setIsStock(SalesActivityItemPO.STATUS_VALID_INT);
		salesActivityItemPO.setReceiveUserId(userDao.queryUserByUserId(userId));
		salesActivityItemPO.setReceiveUserName(userName);
		salesActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		salesActivityDao.update(salesActivityItemPO);
		
		if (salesActivityItemPO.getIsStock() == 0) {

			AwardStockPO awardStockPO = awardStockDao.get(salesActivityItemPO.getAsid());
			float num = Arith.sub(awardStockPO.getNum(), salesActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "奖品库存数量不足!");
			}

			awardStockPO.setNum((int) Arith.sub(awardStockPO.getNum(), salesActivityItemPO.getNum()));

			awardStockDao.update(awardStockPO);

			AwardRecordPO awardRecordPO = new AwardRecordPO();
			awardRecordPO.setAwardStock(awardStockPO);
			awardRecordPO.setCreater(userDao.queryUserByUserId(userId));
			awardRecordPO.setOrderId(salesActivityItemPO.getOrderId());
			awardRecordPO.setNum(salesActivityItemPO.getNum());
			awardRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			awardRecordPO.setTotalPrice(Arith.mul(salesActivityItemPO.getMoney(), salesActivityItemPO.getNum()));
			awardRecordPO.setUnitPrice(salesActivityItemPO.getMoney());
			awardRecordPO.setType(AwardRecordPO.TYPE_XG_INT);
			awardRecordPO.setContent("领取活动奖品");

			awardRecordDao.save(awardRecordPO);
		}
		return 0;
	}

}
