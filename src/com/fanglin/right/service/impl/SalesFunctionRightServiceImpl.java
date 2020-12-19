package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.utils.BeanUtil;


import com.fanglin.right.dao.SalesFunctionRightDao;
import com.fanglin.right.po.SalesFunctionRightPO;
import com.fanglin.right.service.SalesFunctionRightService;
import com.fanglin.right.vo.SalesFunctionRightVO;
import com.fanglin.sales.dao.SalesFunctionDao;
import com.fanglin.sales.po.SalesFunctionPO;
import com.fanglin.sales.vo.SalesFunctionVO;

@Service("salesFunctionRightService")
@Transactional(readOnly = true)
public class SalesFunctionRightServiceImpl implements SalesFunctionRightService{

	@Autowired
	private SalesFunctionRightDao salesFunctionRightDao;
	
	@Autowired
	private SalesFunctionDao salesFunctionDao;
	
	@Override
	public List<SalesFunctionRightVO> querySalesFunctionRightByName(SalesFunctionRightVO salesFunctionRightVO) {
		List<SalesFunctionRightPO> salesFunctionRightPOs = salesFunctionRightDao.querySalesFunctionRightByName(salesFunctionRightVO.getName());
		List<SalesFunctionRightVO> salesFunctionRightVOs = new ArrayList<SalesFunctionRightVO>();
		
		for(SalesFunctionRightPO salesFunctionRightPO : salesFunctionRightPOs){
			
			salesFunctionRightVO = new SalesFunctionRightVO(new SalesFunctionVO());
			
			BeanUtil.copyPropertie(salesFunctionRightPO, salesFunctionRightVO, Arrays.asList("salesFunction"));
			BeanUtil.copyPropertie(salesFunctionRightPO.getSalesFunction(), salesFunctionRightVO.getSalesFunction());
			
			salesFunctionRightVOs.add(salesFunctionRightVO);
		}
		
		return salesFunctionRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSalesFunctionRight(SalesFunctionRightVO salesFunctionRightVO, List<Long> sfids,int company) {
		
		if(salesFunctionRightVO == null) salesFunctionRightVO = new SalesFunctionRightVO();
		
		salesFunctionRightDao.deleteSalesFunctionRightByName(salesFunctionRightVO.getName());
		
		if(sfids==null) sfids = new ArrayList<Long>();
		
		for (Long sfid : sfids) {
			SalesFunctionRightPO salesFunctionRightPO = new SalesFunctionRightPO();
			SalesFunctionPO salesFunctionPO = salesFunctionDao.get(sfid);
			
			salesFunctionRightPO.setName(salesFunctionRightVO.getName());
			salesFunctionRightPO.setSalesFunction(salesFunctionPO);
			salesFunctionRightPO.setCompany(company);
			
			salesFunctionRightDao.save(salesFunctionRightPO);
		}
		
	}
		

}
