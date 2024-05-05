package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceSalesBalanceDao;
import com.fanglin.balance.po.BalanceSalesBalancePO;
import com.fanglin.balance.service.BalanceSalesBalanceService;
import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.balance.vo.BalanceSalesVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.sales.vo.SalesRefundsVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("balanceSalesBalanceService")
@Transactional(readOnly = true)
public class BalanceSalesBalanceServiceImpl implements BalanceSalesBalanceService {

	@Autowired
	private BalanceSalesBalanceDao balanceSalesBalanceDao;

	@Override
	public void pageBalanceSalesBalance(Paging paging, List<Filter> filters, long bsid) {

		paging.setData(ptv(balanceSalesBalanceDao.pageBalanceSalesBalance(paging, filters, bsid)));
	}

	@Override
	public List<BalanceSalesBalanceVO> queryBalanceSalesBalance(BalanceSalesBalanceVO balanceSalesBalance) {

		return ptv(balanceSalesBalanceDao.queryBalanceSalesBalance(balanceSalesBalance.getBsid()));
	}

	@Override
	public int countBalanceSalesBalance(BalanceSalesVO balanceSales) {
		return balanceSalesBalanceDao.countBalanceSalesBalance(balanceSales.getBsid());
	}

	private List<BalanceSalesBalanceVO> ptv(List<BalanceSalesBalancePO> balanceSalesBalancePOs) {

		List<BalanceSalesBalanceVO> balanceSalesBalanceVOs = new ArrayList<BalanceSalesBalanceVO>();

		BalanceSalesBalanceVO balanceSalesBalanceVO;

		for (BalanceSalesBalancePO balanceSalesBalancePO : balanceSalesBalancePOs) {

			balanceSalesBalanceVO = new BalanceSalesBalanceVO(new SalesBalanceVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new SalesRefundsVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO()));

			BeanUtil.copyProperties(balanceSalesBalancePO, balanceSalesBalanceVO, Arrays.asList("salesBalance"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance(), balanceSalesBalanceVO.getSalesBalance(), Arrays.asList("sales", "refunds", "creater", "poster", "salesman", "dept", "region", "checker", "voster"));

			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getPoster(), balanceSalesBalanceVO.getSalesBalance().getPoster(), Arrays.asList("duty", "dept"));

			balanceSalesBalancePO.getSalesBalance().getSales().ptv(balanceSalesBalanceVO.getSalesBalance().getSales());

			balanceSalesBalanceVOs.add(balanceSalesBalanceVO);
		}

		return balanceSalesBalanceVOs;
	}

}
