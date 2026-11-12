package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesOperateDao;
import com.fanglin.sales.po.SalesOperatePO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesOperateService;
import com.fanglin.sales.vo.SalesOperateVO;
import com.fanglin.sales.vo.SalesVO;

@Service("salesOperateService")
public class SalesOperateServiceImpl implements SalesOperateService {

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SalesOperateDao salesOperateDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<SalesOperateVO> querySalesOperateBySid(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		List<SalesOperateVO> salesOperateVOs = new ArrayList<SalesOperateVO>();

		for (SalesOperatePO salesOperatePO : salesOperateDao.querySalesOperateBySid(salesPO.getSid())) {
			salesOperateVOs.add(salesOperatePO.ptv(new SalesOperateVO(new UserBaseVO())));
		}

		return salesOperateVOs;
	}

}
