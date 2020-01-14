package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.fanglin.production.dao.ProductionFunctionDao;
import com.fanglin.production.po.ProductionFunctionPO;
import com.fanglin.production.vo.ProductionFunctionVO;
import com.fanglin.right.dao.ProductionFunctionRightDao;
import com.fanglin.right.po.ProductionFunctionRightPO;
import com.fanglin.right.service.ProductionFunctionRightService;
import com.fanglin.right.vo.ProductionFunctionRightVO;
import com.fanglin.utils.BeanUtil;

@Service("productionFunctionRightService")
@Transactional(readOnly = true)
public class ProductionFunctionRightServiceImpl implements ProductionFunctionRightService {

	@Autowired
	private ProductionFunctionRightDao productionFunctionRightDao;
	
	@Autowired
	private ProductionFunctionDao productionFunctionDao;
	
	@Override
	public List<ProductionFunctionRightVO> queryProductionFunctionRightByName(ProductionFunctionRightVO productionFunctionRightVO) {
		
		List<ProductionFunctionRightPO> productionFunctionRightPOs = productionFunctionRightDao.queryProductionFunctionRightByName(productionFunctionRightVO.getName());
		List<ProductionFunctionRightVO> productionFunctionRightVOs = new ArrayList<ProductionFunctionRightVO>();
		
		for(ProductionFunctionRightPO productionFunctionRightPO:productionFunctionRightPOs){
			
			productionFunctionRightVO = new ProductionFunctionRightVO(new ProductionFunctionVO());
			
			BeanUtil.copyProperties(productionFunctionRightPO, productionFunctionRightVO, Arrays.asList("productionFunction"));
			BeanUtil.copyPropertie(productionFunctionRightPO.getProductionFunction(), productionFunctionRightVO.getProductionFunction());
			
			productionFunctionRightVOs.add(productionFunctionRightVO);
		}
		
		return productionFunctionRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateProductionFunctionRight(ProductionFunctionRightVO productionFunctionRightVO, List<Long> pfids, int company) {
		
		productionFunctionRightDao.deleteProductionFunctionRightByName(productionFunctionRightVO.getName());
		
		for (Long pfid:pfids){
			
			ProductionFunctionRightPO productionFunctionRightPO = new ProductionFunctionRightPO();
			ProductionFunctionPO productionFunctionPO = productionFunctionDao.get(pfid); 
			
			productionFunctionRightPO.setName(productionFunctionRightVO.getName());
			productionFunctionRightPO.setProductionFunction(productionFunctionPO);
			productionFunctionRightPO.setCompany(company);
			
			productionFunctionRightDao.save(productionFunctionRightPO);
		}
		
	}

}
