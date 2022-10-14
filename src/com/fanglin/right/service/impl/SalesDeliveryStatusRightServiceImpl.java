package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.right.dao.SalesDeliveryStatusRightDao;
import com.fanglin.right.po.SalesDeliveryStatusRightPO;
import com.fanglin.right.service.SalesDeliveryStatusRightService;
import com.fanglin.right.vo.SalesDeliveryStatusRightVO;
import com.fanglin.utils.BeanUtil;

@Service("salesDeliveryStatusRightService")
@Transactional(readOnly = true)
public class SalesDeliveryStatusRightServiceImpl implements SalesDeliveryStatusRightService {

	@Autowired
	private SalesDeliveryStatusRightDao salesDeliveryStatusRightDao;

	@Override
	public List<SalesDeliveryStatusRightVO> querySalesDeliveryStatusRight(SalesDeliveryStatusRightVO salesDeliveryStatusRightVO) {

		List<SalesDeliveryStatusRightPO> salesDeliveryStatusRightPOs = salesDeliveryStatusRightDao.querySalesDeliveryStatusRight(salesDeliveryStatusRightVO.getBid());
		List<SalesDeliveryStatusRightVO> salesDeliveryStatusRightVOs = new ArrayList<SalesDeliveryStatusRightVO>();

		for (SalesDeliveryStatusRightPO salesDeliveryStatusRightPO : salesDeliveryStatusRightPOs) {

			salesDeliveryStatusRightVO = new SalesDeliveryStatusRightVO();

			BeanUtil.copyPropertie(salesDeliveryStatusRightPO, salesDeliveryStatusRightVO);

			salesDeliveryStatusRightVOs.add(salesDeliveryStatusRightVO);
		}

		return salesDeliveryStatusRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSalesDeliveryStatusRight(List<SalesDeliveryStatusRightVO> salesDeliveryStatusRightsVO) {

		SalesDeliveryStatusRightVO salesDeliveryStatusRight = salesDeliveryStatusRightsVO.get(0);

		Long bid = salesDeliveryStatusRight.getBid();

		salesDeliveryStatusRightDao.deleteSalesDeliveryStatus(bid);

		for (SalesDeliveryStatusRightVO salesDeliveryStatusRightVO : salesDeliveryStatusRightsVO) {

			SalesDeliveryStatusRightPO salesDeliveryStatusRightPO = new SalesDeliveryStatusRightPO();

			BeanUtil.copyProperties(salesDeliveryStatusRightVO, salesDeliveryStatusRightPO);

			salesDeliveryStatusRightDao.save(salesDeliveryStatusRightPO);
		}

	}

}
