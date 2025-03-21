package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.vo.ActivityVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesActivityDao;
import com.fanglin.sales.po.SalesActivityPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesActivityService;
import com.fanglin.sales.vo.SalesActivityVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("salesActivityService")
@Transactional(readOnly = true)
public class SalesActivityServiceImpl implements SalesActivityService {

	@Autowired
	private SalesActivityDao salesActivityDao;

	@Override
	public void pageSalesActivity(Paging paging, List<Filter> filter, String orderId) throws FLException {

		List<SalesActivityPO> salesActivityPOs = salesActivityDao.pageSalesActivity(paging, filter, orderId);

		List<SalesActivityVO> salesActivityVOs = new ArrayList<SalesActivityVO>();

		SalesActivityVO salesActivityVO = null;

		for (SalesActivityPO salesActivityPO : salesActivityPOs) {

			ActivityPO activityPO = salesActivityPO.getActivity();

			SalesPO salesPO = salesActivityPO.getSales();

			salesActivityVO = new SalesActivityVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(),new BrandVO()), new ActivityVO(new UserBaseVO()));

			BeanUtil.copyProperties(activityPO, salesActivityVO.getActivity(), Arrays.asList("creater"));

			salesActivityVO.getActivity().getCreater().setBaseInfo(activityPO.getCreater());

			salesPO.ptv(salesActivityVO.getSales());

			salesActivityVOs.add(salesActivityVO);
		}

		paging.setData(salesActivityVOs);
	}

	@Override
	public List<SalesActivityVO> amountSalesActivity(String orderId) {

		List<Object> salesTotal = salesActivityDao.querySalesActivityByTotal(orderId);

		List<SalesActivityVO> SalesActivityVOs = new ArrayList<SalesActivityVO>();

		for (Iterator<Object> iterator = salesTotal.iterator(); iterator.hasNext();) {

			SalesActivityVO salesActivityVO = new SalesActivityVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(),new BrandVO()), new ActivityVO(new UserBaseVO()));

			Object[] objects = (Object[]) iterator.next();

			String amount = String.valueOf(objects[1]);
			String name = String.valueOf(objects[0]);

			salesActivityVO.setAmount(Long.valueOf(amount));
			salesActivityVO.getActivity().setName(name);

			SalesActivityVOs.add(salesActivityVO);
		}

		return SalesActivityVOs;
	}

	@Override
	public int amountSalesActivityForActivity(SalesActivityVO salesActivityVO) {

		long amount = salesActivityDao.amountSalesActivityForActivity(salesActivityVO.getSales().getOrderId());

		salesActivityVO.setAmount(amount);

		return 0;
	}

	@Override
	public int amountSalesActivityForPayment(SalesActivityVO salesActivityVO) {

		long amount = salesActivityDao.amountSalesActivityForPayment(salesActivityVO.getSales().getOrderId());

		salesActivityVO.setAmount(amount);

		return 0;
	}

	@Override
	public int checkSalesActivity(String orderId, long integral) throws FLException {

		long activity = salesActivityDao.amountSalesActivityForActivity(orderId);
		long payment = salesActivityDao.amountSalesActivityForPayment(orderId);

		if (Arith.add(activity, integral) > payment) {
			throw new FLException(160037, "积分不足");
		}

		return 0;
	}

	@Override
	public int checkSalesActivity(long sid, long integral) throws FLException {

		SalesActivityPO salesActivityPO = salesActivityDao.get(sid);

		if (salesActivityPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		long activity = salesActivityDao.amountSalesActivityForActivity(salesActivityPO.getSales().getOrderId());
		long payment = salesActivityDao.amountSalesActivityForPayment(salesActivityPO.getSales().getOrderId());

		if (Arith.sub(payment, Arith.mul(integral, salesActivityPO.getActivity() == null ? 0 : salesActivityPO.getActivity().getMultiple())) < activity) {
			throw new FLException(160037, "积分不足");
		}

		return 0;
	}

}
