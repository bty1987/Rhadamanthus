package com.fanglin.sales.service.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesPreFollowupDao;
import com.fanglin.sales.po.SalesPreFollowupPO;
import com.fanglin.sales.service.SalesPreFollowupService;
import com.fanglin.sales.vo.SalesPreFollowupVO;
import com.fanglin.utils.DateUtil;

@Service("salesPreFollowupService")
@Transactional(readOnly = true)
public class SalesPreFollowupServiceImpl implements SalesPreFollowupService {

	@Autowired
	private SalesPreFollowupDao salesPreFollowupDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<SalesPreFollowupVO> querySalesPreFollowupByOrderId(SalesPreFollowupVO salesPreFollowup) throws FLException {

		List<SalesPreFollowupPO> salesPreFollowupPOs = salesPreFollowupDao.querySalesPreFollowupByOrderId(salesPreFollowup.getOrderId());

		List<SalesPreFollowupVO> salesPreFollowupVOs = new ArrayList<SalesPreFollowupVO>();

		for (SalesPreFollowupPO salesPreFollowupPO : salesPreFollowupPOs) {
			salesPreFollowupVOs.add(salesPreFollowupPO.ptv(new SalesPreFollowupVO(new UserBaseVO())));
		}

		return salesPreFollowupVOs;
	}

	@Override
	public SalesPreFollowupVO countSalesPreFollowup(SalesPreFollowupVO salesPreFollowup) throws FLException {

		Object[] counts = salesPreFollowupDao.countSalesPreFollowup(salesPreFollowup.getOrderId());

		salesPreFollowup.setTotal(counts[0] != null ? ((BigInteger) counts[0]).longValue() : 0l);
		salesPreFollowup.setLastTime((Timestamp) counts[1]);
		salesPreFollowup.setOverdueCount(counts[2] != null ? ((BigDecimal) counts[2]).longValue() : 0l);

		return salesPreFollowup;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSalesPreFollowup(SalesPreFollowupVO salesPreFollowup, String userId) throws FLException {

		if (salesPreFollowup.getContent() == null || salesPreFollowup.getContent().trim().isEmpty()) {
			throw new FLException(370039, "跟单内容不能为空");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(salesPreFollowup.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		SalesPreFollowupPO salesPreFollowupPO = new SalesPreFollowupPO();

		salesPreFollowupPO.setCompany(decorationPO.getCompany());
		salesPreFollowupPO.setOrderId(decorationPO.getOrderId());
		salesPreFollowupPO.setItem(salesPreFollowup.getItem() == null ? SalesPreFollowupPO.ITEM_INTENTION_INT : salesPreFollowup.getItem());
		salesPreFollowupPO.setWay(salesPreFollowup.getWay() == null ? SalesPreFollowupPO.WAY_WECHAT_INT : salesPreFollowup.getWay());
		salesPreFollowupPO.setContent(salesPreFollowup.getContent());
		salesPreFollowupPO.setPlan(salesPreFollowup.getPlan());
		salesPreFollowupPO.setPlanTime(salesPreFollowup.getPlanTime());
		salesPreFollowupPO.setIsDelete(SalesPreFollowupPO.ISDELETE_ENABLE_INT);
		salesPreFollowupPO.setCreater(creater);
		salesPreFollowupPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		if (salesPreFollowup.getBid() != null && salesPreFollowup.getBid() != 0) {

			BrandPO brandPO = brandDao.get(salesPreFollowup.getBid());

			if (brandPO == null) {
				throw new FLException(130077, "品牌不存在");
			}

			salesPreFollowupPO.setBrand(brandPO);
			salesPreFollowupPO.setCategory(brandPO.getCategory() != null ? brandPO.getCategory().getName() : salesPreFollowup.getCategory());
		} else {
			salesPreFollowupPO.setCategory(salesPreFollowup.getCategory());
		}

		salesPreFollowupDao.save(salesPreFollowupPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteSalesPreFollowup(SalesPreFollowupVO salesPreFollowup, String userId) throws FLException {

		SalesPreFollowupPO salesPreFollowupPO = salesPreFollowupDao.get(salesPreFollowup.getSfid());

		if (salesPreFollowupPO == null || salesPreFollowupPO.getIsDelete() == SalesPreFollowupPO.ISDELETE_NONE_INT) {
			throw new FLException(370037, "跟单记录不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		if (operater == null || salesPreFollowupPO.getCreater() == null || operater.getUid() != salesPreFollowupPO.getCreater().getUid()) {
			throw new FLException(370038, "仅记录人可删除");
		}

		salesPreFollowupPO.setIsDelete(SalesPreFollowupPO.ISDELETE_NONE_INT);
		salesPreFollowupPO.setDeleteTime(DateUtil.getDateToTimestamp(new Date()));

		salesPreFollowupDao.update(salesPreFollowupPO);
	}

}
