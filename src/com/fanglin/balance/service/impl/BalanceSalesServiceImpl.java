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
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
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
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;


@Service("balanceSalesService")
@Transactional(readOnly=true)
public class BalanceSalesServiceImpl implements BalanceSalesService {
	
	@Autowired
	private BalanceSalesDao balanceSalesDao;
	
	@Autowired
	private CompanyDao companyDao;
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Autowired
	private BalanceDao balanceDao;
	
	@Override
	public List<SalesBalanceVO> queryBalanceSalesForSales(BalanceSalesVO balanceSalesVO) {
		
		List<BalanceSalesPO> balanceSalesPOs = balanceSalesDao.queryBalanceSalesForSales(balanceSalesVO.getBalance().getBid());
		List<SalesBalanceVO> salesBalanceVOs = new ArrayList<SalesBalanceVO>();
		
		for (BalanceSalesPO balanceSalesPO : balanceSalesPOs) {
			

			SalesBalanceVO salesBalanceVO = new SalesBalanceVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO()), new RefundsVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());

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
			
			BalanceVO balanceVO = new BalanceVO(new UserBaseVO(),new UserBaseVO());
			
			BeanUtil.copyProperties(balanceSalesPO.getBalance(), balanceVO, Arrays.asList("belonger", "creater"));
			BeanUtil.copyProperties(balanceSalesPO.getBalance().getBelonger(), balanceVO.getBelonger(), Arrays.asList("duty", "dept","role"));
			BeanUtil.copyProperties(balanceSalesPO.getBalance().getCreater(), balanceVO.getCreater(), Arrays.asList("duty", "dept","role"));
	
			balanceVOs.add(balanceVO);
		}
		return balanceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitBalanceSales(List<BalanceSalesVO> balanceSalesVOs, String userId, int company) throws FLException  {
		
		 	CompanyPO companyPO = companyDao.get(company);
		    
		    BalancePO balancePO = new BalancePO();
		    
		    String currentDate = DateUtil.current("yyMMdd").toString();
		    
		    int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT, currentDate, company);
		    
		    String no =  companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		    
		    UserPO creater = userDao.queryUserByUserId(userId);
		    
		    balancePO.setNo(no);
		    balancePO.setBelonger(creater);
		    balancePO.setCreater(creater);
		    balancePO.setCompany(company);
		    balancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		    balanceDao.save(balancePO);
		    
		    UserPO supplier = new UserPO();
		    
		    long total = 0;
		    
		    for (BalanceSalesVO balanceSalesVO : balanceSalesVOs) {

		        SalesBalancePO salesBalancePO = salesBalanceDao.get(balanceSalesVO.getSalesBalance().getSbid());
	        
		        supplier = salesBalancePO.getSales().getSupplier();
		        
		        total = Arith.add(total, salesBalancePO.getPbalance());
		     
		        BalanceSalesPO balanceSalesPO = new BalanceSalesPO();
		        
		        balanceSalesPO.setBalance(balancePO);
		        balanceSalesPO.setSalesBalance(salesBalancePO);
		        
		        balanceSalesDao.save(balanceSalesPO);
		    }
		    
		    BalancePO balance = balanceDao.queryBalance(no);
		    
		    balance.setBelonger(supplier);
		    balance.setAmount(total);
		    balance.setSurplus(total); 
		    
		    balanceDao.update(balance);
		    
		    return 0;
		  }
	}

