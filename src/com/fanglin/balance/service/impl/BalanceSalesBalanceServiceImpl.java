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
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.vo.RefundsVO;
import com.fanglin.sales.vo.SalesBalanceVO;
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

		List<BalanceSalesBalancePO> balanceSalesBalancePOs = balanceSalesBalanceDao.pageBalanceSalesBalance(paging, filters, bsid);
		List<BalanceSalesBalanceVO> balanceSalesBalanceVOs = new ArrayList<BalanceSalesBalanceVO>();

		BalanceSalesBalanceVO balanceSalesBalanceVO;

		for (BalanceSalesBalancePO balanceSalesBalancePO : balanceSalesBalancePOs) {
			balanceSalesBalanceVO = new BalanceSalesBalanceVO(new SalesBalanceVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new RefundsVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO()));
			BeanUtil.copyProperties(balanceSalesBalancePO, balanceSalesBalanceVO, Arrays.asList("salesBalance"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance(), balanceSalesBalanceVO.getSalesBalance(), Arrays.asList("sales", "refunds", "creater", "poster", "salesman", "dept", "region", "checker", "voster"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales(), balanceSalesBalanceVO.getSalesBalance().getSales(), Arrays.asList("house", "customer", "salesman", "dept", "region", "guider", "instorer", "guideDept", "supplier", "finisher"));

			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getHouse(), balanceSalesBalanceVO.getSalesBalance().getSales().getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getHouse().getVillage(), balanceSalesBalanceVO.getSalesBalance().getSales().getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getSalesman(), balanceSalesBalanceVO.getSalesBalance().getSales().getSupplier(), Arrays.asList("duty", "dept"));

			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getCustomer(), balanceSalesBalanceVO.getSalesBalance().getSales().getCustomer());
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getSalesman(), balanceSalesBalanceVO.getSalesBalance().getSales().getSalesman(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getDept(), balanceSalesBalanceVO.getSalesBalance().getSales().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getRegion(), balanceSalesBalanceVO.getSalesBalance().getSales().getRegion(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getGuider(), balanceSalesBalanceVO.getSalesBalance().getSales().getGuider(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getInstorer(), balanceSalesBalanceVO.getSalesBalance().getSales().getInstorer(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getGuideDept(), balanceSalesBalanceVO.getSalesBalance().getSales().getGuideDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getInstorer(), balanceSalesBalanceVO.getSalesBalance().getSales().getSupplier(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getInstorer(), balanceSalesBalanceVO.getSalesBalance().getSales().getFinisher(), Arrays.asList("duty", "dept"));

			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getPoster(), balanceSalesBalanceVO.getSalesBalance().getPoster(), Arrays.asList("duty", "dept"));

			balanceSalesBalanceVOs.add(balanceSalesBalanceVO);
		}

		paging.setData(balanceSalesBalanceVOs);
	}

	@Override
	public List<BalanceSalesBalanceVO> queryBalanceSalesBalance(BalanceSalesBalanceVO balanceSalesBalance) {

		List<BalanceSalesBalancePO> balanceSalesBalancePOs = balanceSalesBalanceDao.queryBalanceSalesBalance(balanceSalesBalance.getBsid());
		List<BalanceSalesBalanceVO> balanceSalesBalanceVOs = new ArrayList<BalanceSalesBalanceVO>();

		for (BalanceSalesBalancePO balanceSalesBalancePO : balanceSalesBalancePOs) {
			BalanceSalesBalanceVO balanceSalesBalanceVO = new BalanceSalesBalanceVO(new SalesBalanceVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new RefundsVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO()));

			BeanUtil.copyProperties(balanceSalesBalancePO, balanceSalesBalanceVO, Arrays.asList("salesBalance"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance(), balanceSalesBalanceVO.getSalesBalance(), Arrays.asList("sales", "refunds", "creater", "poster", "salesman", "dept", "region", "checker", "voster"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales(), balanceSalesBalanceVO.getSalesBalance().getSales(), Arrays.asList("house", "customer", "salesman", "dept", "region", "guider", "instorer", "guideDept", "supplier", "finisher"));

			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getHouse(), balanceSalesBalanceVO.getSalesBalance().getSales().getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getHouse().getVillage(), balanceSalesBalanceVO.getSalesBalance().getSales().getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getSalesman(), balanceSalesBalanceVO.getSalesBalance().getSales().getSupplier(), Arrays.asList("duty", "dept"));

			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getCustomer(), balanceSalesBalanceVO.getSalesBalance().getSales().getCustomer());
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getSalesman(), balanceSalesBalanceVO.getSalesBalance().getSales().getSalesman(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getDept(), balanceSalesBalanceVO.getSalesBalance().getSales().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getRegion(), balanceSalesBalanceVO.getSalesBalance().getSales().getRegion(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getGuider(), balanceSalesBalanceVO.getSalesBalance().getSales().getGuider(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getInstorer(), balanceSalesBalanceVO.getSalesBalance().getSales().getInstorer(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getGuideDept(), balanceSalesBalanceVO.getSalesBalance().getSales().getGuideDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getInstorer(), balanceSalesBalanceVO.getSalesBalance().getSales().getSupplier(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getSales().getInstorer(), balanceSalesBalanceVO.getSalesBalance().getSales().getFinisher(), Arrays.asList("duty", "dept"));

			BeanUtil.copyProperties(balanceSalesBalancePO.getSalesBalance().getPoster(), balanceSalesBalanceVO.getSalesBalance().getPoster(), Arrays.asList("duty", "dept"));

			balanceSalesBalanceVOs.add(balanceSalesBalanceVO);
		}

		return balanceSalesBalanceVOs;
	}
	
	@Override
	public int countBalanceSalesBalance(long bsid) {
		return balanceSalesBalanceDao.countBalanceSalesBalance(bsid);
	}

}
