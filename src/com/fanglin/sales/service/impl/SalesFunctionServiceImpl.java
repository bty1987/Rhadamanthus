package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.sales.dao.SalesFunctionDao;
import com.fanglin.sales.po.SalesFunctionPO;
import com.fanglin.sales.service.SalesFunctionService;
import com.fanglin.sales.vo.SalesFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("salesFunctionService")
@Transactional(readOnly = true)
public class SalesFunctionServiceImpl implements SalesFunctionService{

	@Autowired
	private SalesFunctionDao salesFunctionDao;
	
	@Override
	public List<SalesFunctionVO> querySalesFunction(SalesFunctionVO salesFunctionVO) {
		List<SalesFunctionPO> salesFunctionPOs = salesFunctionDao.querySalesFunction(salesFunctionVO.getType());
		List<SalesFunctionVO> salesFunctionVOs = new ArrayList<SalesFunctionVO>();
		
		for(SalesFunctionPO salesFunctionPO : salesFunctionPOs){
			
			salesFunctionVO = new SalesFunctionVO();
			BeanUtil.copyPropertie(salesFunctionPO, salesFunctionVO);
			
			salesFunctionVOs.add(salesFunctionVO);
			
		}
		
		return salesFunctionVOs;
	}

	@Override
	public List<SalesFunctionVO> querySalesFunctionByName(SalesFunctionVO salesFunctionVO) {
		
		List<SalesFunctionPO> salesFunctionPOs = salesFunctionDao.querySalesFunctionByName(salesFunctionVO.getName());
		List<SalesFunctionVO> salesFunctionVOs = new ArrayList<SalesFunctionVO>();
		
		for(SalesFunctionPO salesFunctionPO : salesFunctionPOs){
			
			salesFunctionVO = new SalesFunctionVO();
			BeanUtil.copyPropertie(salesFunctionPO, salesFunctionVO);
			
			salesFunctionVOs.add(salesFunctionVO);
			
		}
		
		return salesFunctionVOs;
	}

}
