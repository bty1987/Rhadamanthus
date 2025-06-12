package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.SalesActivityRecordService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesActivityItemDao;
import com.fanglin.sales.dao.SalesActivityRecordDao;
import com.fanglin.sales.po.SalesActivityItemPO;
import com.fanglin.sales.po.SalesActivityRecordPO;
import com.fanglin.sales.vo.SalesActivityItemVO;
import com.fanglin.sales.vo.SalesActivityRecordVO;

@Service("salesActivityRecordService")
@Transactional(readOnly = true)
public class SalesActivityRecordServiceImpl implements SalesActivityRecordService {

	@Autowired
	private SalesActivityRecordDao salesActivityRecordDao;

	@Autowired
	private SalesActivityItemDao salesActivityItemDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<SalesActivityRecordVO> querySalesActivityRecord(SalesActivityRecordVO salesActivityRecordVO) throws FLException {

		List<SalesActivityRecordPO> salesActivityRecordPOs = salesActivityRecordDao.querySalesActivityRecord(salesActivityRecordVO.getSalesActivityItem().getSaiid());
		List<SalesActivityRecordVO> salesActivityRecordVOs = new ArrayList<SalesActivityRecordVO>();

		for (SalesActivityRecordPO salesActivityRecordPO : salesActivityRecordPOs) {
			salesActivityRecordVOs.add(salesActivityRecordPO.ptv(new SalesActivityRecordVO(new SalesActivityItemVO(), new UserBaseVO())));
		}

		return salesActivityRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSalesActivityRecord(SalesActivityRecordVO salesActivityRecordVO, String userId) throws FLException {

		SalesActivityItemPO salesActivityItemPO = salesActivityItemDao.get(salesActivityRecordVO.getSalesActivityItem().getSaiid());

		SalesActivityRecordPO salesActivityRecordPO = new SalesActivityRecordPO();

		UserPO operater = userDao.queryUserByUserId(userId);

		salesActivityRecordPO.init(salesActivityRecordVO.getSaid(), salesActivityItemPO, SalesActivityItemPO.STATUS_PURCHER_INT, operater, salesActivityRecordVO.getComment());

		salesActivityItemDao.save(salesActivityRecordPO);

		return 0;
	}

}
