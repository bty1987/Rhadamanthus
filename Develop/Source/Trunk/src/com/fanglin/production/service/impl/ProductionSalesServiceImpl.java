package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.dao.ProductionSalesDao;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.production.po.ProductionSalesPO;
import com.fanglin.production.service.ProductionSalesService;
import com.fanglin.production.vo.ProductionSalesVO;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;


@Service("productionsalesService")
@Transactional(readOnly=true)
public class ProductionSalesServiceImpl implements ProductionSalesService {

	@Autowired
	private ProductionSalesDao productionsalesDao;
	
	@Autowired
	private ProductionDao productionDao;

	@Override
	public List<ProductionSalesVO> queryProductionSalesByPid(ProductionSalesVO productionSalesVO) {
		
		List<ProductionSalesPO> productionSalesPOs = productionsalesDao.queryProductionSalesByPid(productionSalesVO.getPid());
		List<ProductionSalesVO> productionSalesVOs = new ArrayList<ProductionSalesVO>();
		
		ProductionSalesVO _productionSalesVO;
		
		for(ProductionSalesPO productionSalesPO:productionSalesPOs){
			
			_productionSalesVO = new ProductionSalesVO();
			
			BeanUtil.copyProperties(productionSalesPO, _productionSalesVO);
			
			productionSalesVOs.add(_productionSalesVO);
		}
		
		return productionSalesVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int bindProductionSales(ProductionSalesVO productionSalesVO,ProductionVO productionVO) throws FLException {
		
		ProductionSalesPO productionSalesPO = new ProductionSalesPO();
		
		ProductionPO productionPO = new ProductionPO();
		
		productionPO = productionDao.get(productionSalesVO.getPid());
	
		float newTotal = Arith.add(productionPO.getTotal(), productionVO.getTotal());
		productionPO.setTotal(newTotal);
		
		productionDao.update(productionPO);
		
		BeanUtil.copyPropertie(productionSalesVO, productionSalesPO);
		
		productionsalesDao.save(productionSalesPO);
		
		
		return 0;
	}
}
