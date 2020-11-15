package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.dao.BalanceSalesDao;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.po.BalanceSalesPO;
import com.fanglin.balance.service.BalanceSalesService;
import com.fanglin.balance.vo.BalanceSalesVO;
import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.sales.vo.RefundsVO;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("balanceSalesService")
@Transactional(readOnly = true)
public class BalanceSalesServiceImpl implements BalanceSalesService {

	@Autowired
	private BalanceSalesDao balanceSalesDao;

	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Autowired
	private BalanceDao balanceDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<SalesBalanceVO> queryBalanceSalesForSales(BalanceSalesVO balanceSalesVO) {

		List<BalanceSalesPO> balanceSalesPOs = balanceSalesDao.queryBalanceSalesForSales(balanceSalesVO.getBalance().getBid());
		List<SalesBalanceVO> salesBalanceVOs = new ArrayList<SalesBalanceVO>();

		for (BalanceSalesPO balanceSalesPO : balanceSalesPOs) {

			SalesBalanceVO salesBalanceVO = new SalesBalanceVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new RefundsVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(),new UserBaseVO());

			BeanUtil.copyPropertie(balanceSalesPO.getSalesBalance(), salesBalanceVO, Arrays.asList("sales", "refunds", "creater", "poster", "salesman", "dept", "region"));

			BeanUtil.copyPropertie(balanceSalesPO.getSalesBalance().getPoster(), salesBalanceVO.getPoster(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(balanceSalesPO.getSalesBalance().getSales(), salesBalanceVO.getSales(), Arrays.asList("salesman", "dept", "region", "guider", "instorer", "guideDept", "house", "customer", "supplier"));
			BeanUtil.copyProperties(balanceSalesPO.getSalesBalance().getSales().getSalesman(), salesBalanceVO.getSales().getSalesman(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(balanceSalesPO.getSalesBalance().getSales().getDept(), salesBalanceVO.getSales().getDept(), Arrays.asList("fatherDept", "type", "manager"));
			BeanUtil.copyProperties(balanceSalesPO.getSalesBalance().getSales().getRegion(), salesBalanceVO.getSales().getRegion(), Arrays.asList("fatherDept", "type", "manager"));
			BeanUtil.copyProperties(balanceSalesPO.getSalesBalance().getSales().getInstorer(), salesBalanceVO.getSales().getInstorer(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(balanceSalesPO.getSalesBalance().getSales().getGuider(), salesBalanceVO.getSales().getGuider(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(balanceSalesPO.getSalesBalance().getSales().getGuideDept(), salesBalanceVO.getSales().getGuideDept(), Arrays.asList("fatherDept", "type", "manager"));
			BeanUtil.copyProperties(balanceSalesPO.getSalesBalance().getSales().getHouse(), salesBalanceVO.getSales().getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(balanceSalesPO.getSalesBalance().getSales().getHouse().getVillage(), salesBalanceVO.getSales().getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(balanceSalesPO.getSalesBalance().getSales().getCustomer(), salesBalanceVO.getSales().getCustomer());

			salesBalanceVOs.add(salesBalanceVO);
		}

		return salesBalanceVOs;
	}

	@Override
	public List<BalanceVO> queryBalanceSalesForBalance(BalanceSalesVO balanceSalesVO) {

		List<BalanceSalesPO> balanceSalesPOs = balanceSalesDao.queryBalanceSalesForBalance(balanceSalesVO.getSalesBalance().getSbid());
		List<BalanceVO> balanceVOs = new ArrayList<BalanceVO>();

		for (BalanceSalesPO balanceSalesPO : balanceSalesPOs) {

			BalanceVO balanceVO = new BalanceVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(balanceSalesPO.getBalance(), balanceVO, Arrays.asList("belonger", "creater"));
			BeanUtil.copyProperties(balanceSalesPO.getBalance().getBelonger(), balanceVO.getBelonger(), Arrays.asList("duty", "dept", "role"));
			BeanUtil.copyProperties(balanceSalesPO.getBalance().getCreater(), balanceVO.getCreater(), Arrays.asList("duty", "dept", "role"));

			balanceVOs.add(balanceVO);
		}

		return balanceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitBalanceSales(BalanceVO balanceVO, List<BalanceSalesVO> balanceSalesVOs, String userId, int company) throws FLException {

		BalancePO balancePO = balanceDao.get(balanceVO.getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		UserPO checker = userDao.queryUserByUserId(userId);
		UserPO belonger = balancePO.getBelonger();

		long total = balancePO.getAmount();

		for (BalanceSalesVO balanceSalesVO : balanceSalesVOs) {

			SalesBalancePO salesBalancePO = salesBalanceDao.get(balanceSalesVO.getSalesBalance().getSbid());

			if (salesBalancePO == null) {
				throw new FLException(260037, "销售结算信息不存在");
			}

			if (salesBalancePO.getCheckStatus() != SalesBalancePO.CHECKSTATUS_INIT_INT) {
				throw new FLException(260038, "销售结算状态不可操作");
			}

			UserPO supplier = salesBalancePO.getSales().getSupplier();

			if (supplier == null || supplier.getUid() != belonger.getUid()) {
				throw new FLException(350007, "归属人不匹配");
			}

			salesBalancePO.setChecker(checker);
			salesBalancePO.setCheckStatus(SalesBalancePO.CHECKSTATUS_CHECK_INT);
			salesBalancePO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));

			total = Arith.add(total, salesBalancePO.getPbalance());

			BalanceSalesPO balanceSalesPO = new BalanceSalesPO();

			balanceSalesPO.setBalance(balancePO);
			balanceSalesPO.setSalesBalance(salesBalancePO);

			salesBalanceDao.update(salesBalancePO);
			balanceSalesDao.save(balanceSalesPO);
		}

		balancePO.setAmount(total);
		balancePO.setSurplus(total);

		balanceDao.update(balancePO);

		return 0;
	}
}
