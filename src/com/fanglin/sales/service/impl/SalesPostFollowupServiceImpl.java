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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesPostFollowupDao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.po.SalesPostFollowupPO;
import com.fanglin.sales.service.SalesPostFollowupService;
import com.fanglin.sales.vo.SalesPostFollowupVO;
import com.fanglin.utils.DateUtil;

@Service("salesPostFollowupService")
@Transactional(readOnly = true)
public class SalesPostFollowupServiceImpl implements SalesPostFollowupService {

	@Autowired
	private SalesPostFollowupDao salesPostFollowupDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<SalesPostFollowupVO> querySalesPostFollowupBySid(SalesPostFollowupVO salesPostFollowup) throws FLException {

		List<SalesPostFollowupPO> salesPostFollowupPOs = salesPostFollowupDao.querySalesPostFollowupBySid(salesPostFollowup.getSid());

		List<SalesPostFollowupVO> salesPostFollowupVOs = new ArrayList<SalesPostFollowupVO>();

		for (SalesPostFollowupPO salesPostFollowupPO : salesPostFollowupPOs) {
			salesPostFollowupVOs.add(salesPostFollowupPO.ptv(new SalesPostFollowupVO(new UserBaseVO())));
		}

		return salesPostFollowupVOs;
	}

	@Override
	public SalesPostFollowupVO countSalesPostFollowup(SalesPostFollowupVO salesPostFollowup) throws FLException {

		Object[] counts = salesPostFollowupDao.countSalesPostFollowup(salesPostFollowup.getSid());

		salesPostFollowup.setTotal(counts[0] != null ? ((BigInteger) counts[0]).longValue() : 0l);
		salesPostFollowup.setLastTime((Timestamp) counts[1]);
		salesPostFollowup.setOverdueCount(counts[2] != null ? ((BigDecimal) counts[2]).longValue() : 0l);

		return salesPostFollowup;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSalesPostFollowup(SalesPostFollowupVO salesPostFollowup, String userId) throws FLException {

		if (salesPostFollowup.getContent() == null || salesPostFollowup.getContent().trim().isEmpty()) {
			throw new FLException(370039, "跟单内容不能为空");
		}

		SalesPO salesPO = salesDao.get(salesPostFollowup.getSid());

		if (salesPO == null) {
			throw new FLException(370001, "销售单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		SalesPostFollowupPO salesPostFollowupPO = new SalesPostFollowupPO();

		salesPostFollowupPO.setCompany(salesPO.getCompany());
		salesPostFollowupPO.setSid(salesPO.getSid());
		salesPostFollowupPO.setOrderId(salesPO.getOrderId());
		salesPostFollowupPO.setItem(salesPostFollowup.getItem() == null ? SalesPostFollowupPO.ITEM_RETURNVISIT_INT : salesPostFollowup.getItem());
		salesPostFollowupPO.setWay(salesPostFollowup.getWay() == null ? SalesPostFollowupPO.WAY_PHONE_INT : salesPostFollowup.getWay());
		salesPostFollowupPO.setContent(salesPostFollowup.getContent());
		salesPostFollowupPO.setResult(salesPostFollowup.getResult());
		salesPostFollowupPO.setPlan(salesPostFollowup.getPlan());
		salesPostFollowupPO.setPlanTime(salesPostFollowup.getPlanTime());
		salesPostFollowupPO.setIsDelete(SalesPostFollowupPO.ISDELETE_ENABLE_INT);
		salesPostFollowupPO.setCreater(creater);
		salesPostFollowupPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		salesPostFollowupDao.save(salesPostFollowupPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteSalesPostFollowup(SalesPostFollowupVO salesPostFollowup, String userId) throws FLException {

		SalesPostFollowupPO salesPostFollowupPO = salesPostFollowupDao.get(salesPostFollowup.getSfid());

		if (salesPostFollowupPO == null || salesPostFollowupPO.getIsDelete() == SalesPostFollowupPO.ISDELETE_NONE_INT) {
			throw new FLException(370037, "跟单记录不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		if (operater == null || salesPostFollowupPO.getCreater() == null || operater.getUid() != salesPostFollowupPO.getCreater().getUid()) {
			throw new FLException(370038, "仅记录人可删除");
		}

		salesPostFollowupPO.setIsDelete(SalesPostFollowupPO.ISDELETE_NONE_INT);
		salesPostFollowupPO.setDeleteTime(DateUtil.getDateToTimestamp(new Date()));

		salesPostFollowupDao.update(salesPostFollowupPO);
	}

}
